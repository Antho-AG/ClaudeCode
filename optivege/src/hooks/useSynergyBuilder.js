import { useState, useMemo, useCallback } from 'react'
import foodsData from '../data/foods.json'

const FOOD_MAP = new Map(foodsData.map(f => [f.id, f]))

// ── Protein filter ──────────────────────────────────────────────────────────
const PROTEINES_BASE = new Set([
  'lentille', 'lentille_corail', 'pois_chiche',
  'haricot_noir', 'haricot_rouge', 'haricot_blanc',
  'edamame', 'quinoa', 'tofu', 'tempeh',
  'riz_complet', 'sarrasin', 'amarante', 'teff',
])

export const proteinSources = foodsData.filter(f => PROTEINES_BASE.has(f.id))

// ── Active synergies between chosen foods ───────────────────────────────────
export function computeActiveSynergies(chosenFoods) {
  const chosenIds = new Set(chosenFoods.map(f => f.id))
  const seen = new Set()
  const result = []

  for (const food of chosenFoods) {
    for (const syn of food.synergies || []) {
      if (!chosenIds.has(syn.aliment_associe_id)) continue
      const key = [food.id, syn.aliment_associe_id].sort().join('||')
      if (seen.has(key)) continue
      seen.add(key)
      result.push({ foodA: food, foodB: FOOD_MAP.get(syn.aliment_associe_id), syn })
    }
  }
  return result
}

// ── Nutrient key → teneurs field + AJR reference (per 100g) ────────────────
// AJR sources: EFSA/ANSES reference values
const NUTRIENT_MAP = {
  vitamine_c:   { key: 'vitamine_c',   ajr: 80   },   // mg
  fer:          { key: 'fer',          ajr: 14   },   // mg
  zinc:         { key: 'zinc',         ajr: 10   },   // mg
  calcium:      { key: 'calcium',      ajr: 1000 },   // mg
  magnesium:    { key: 'magnesium',    ajr: 375  },   // mg
  vitamine_d:   { key: 'vitamine_d',   ajr: 15   },   // µg
  vitamine_e:   { key: 'vitamine_e',   ajr: 12   },   // mg
  vitamine_k:   { key: 'vitamine_k',   ajr: 75   },   // µg
  vitamine_b6:  { key: 'vitamine_b6',  ajr: 1.4  },   // mg
  folates:      { key: 'folates',      ajr: 200  },   // µg
  potassium:    { key: 'potassium',    ajr: 2000 },   // mg
  selenium:     { key: 'selenium',     ajr: 55   },   // µg
  omega3:       { key: 'omega3_ala',   ajr: 2000 },   // mg
  beta_carotene:{ key: 'beta_carotene',ajr: 5000 },   // µg
  anthocyanes:  { key: 'anthocyanes',  ajr: 50   },   // mg (no official AJR, estimate)
  curcumine:    { key: 'curcumine',    ajr: 200  },   // mg (estimate)
  lipides:      { key: 'lipides',      ajr: 70000},   // mg (~70g)
  proteines:    { key: 'proteines',    ajr: 50   },   // g → handled separately
}

// Map common nutriment_cle substrings to nutrient keys
const SYNERGY_KEYWORD_MAP = [
  ['vitamine c',    'vitamine_c'],
  ['fer',           'fer'],
  ['zinc',          'zinc'],
  ['calcium',       'calcium'],
  ['magnesium',     'magnesium'],
  ['vitamine d',    'vitamine_d'],
  ['vitamine e',    'vitamine_e'],
  ['vitamine k',    'vitamine_k'],
  ['vitamine b',    'vitamine_b6'],
  ['folates',       'folates'],
  ['potassium',     'potassium'],
  ['selenium',      'selenium'],
  ['oméga',         'omega3'],
  ['omega',         'omega3'],
  ['ala',           'omega3'],
  ['bêta-carotène', 'beta_carotene'],
  ['beta-carotene', 'beta_carotene'],
  ['caroténoïde',   'beta_carotene'],
  ['anthocyan',     'anthocyanes'],
  ['curcumin',      'curcumine'],
  ['lipide',        'lipides'],
  ['graisse',       'lipides'],
  ['protéine',      'proteines'],
]

function resolveNutrientKey(nutrimentCle) {
  const lower = nutrimentCle.toLowerCase()
  for (const [keyword, nutrientId] of SYNERGY_KEYWORD_MAP) {
    if (lower.includes(keyword)) return nutrientId
  }
  return null
}

function synergyNutrientScore(candidate) {
  // Take the best AJR % across all synergy links for this candidate
  let best = -1
  for (const { syn } of candidate.synLinks) {
    const nutrientId = resolveNutrientKey(syn.nutriment_cle)
    if (!nutrientId) continue
    const mapping = NUTRIENT_MAP[nutrientId]
    if (!mapping) continue
    const teneur = candidate.food.teneurs?.[mapping.key]
    if (!teneur || teneur.valeur == null) continue
    const pct = (teneur.valeur / mapping.ajr) * 100
    if (pct > best) best = pct
  }
  return best // -1 if no data → sorts last
}

// ── Reverse synergy index: targetId → [{sourceFood, syn}] ──────────────────
const REVERSE_SYNERGY = new Map() // targetId → [{sourceFood, syn}]
for (const food of foodsData) {
  for (const syn of food.synergies || []) {
    const tid = syn.aliment_associe_id
    if (!REVERSE_SYNERGY.has(tid)) REVERSE_SYNERGY.set(tid, [])
    REVERSE_SYNERGY.get(tid).push({ sourceFood: food, syn })
  }
}

// Priority categories for level-3 fallback (category diversity)
const CATEGORY_PRIORITY = [
  'épice', 'légume', 'légume-feuille', 'fruit', 'oléagineux',
  'champignon', 'algue', 'condiment', 'céréale',
]

// ── Suggestions: foods that synergise with what's already chosen ───────────
export function computeSuggestions(chosenFoods, maxCount = 6) {
  const chosenIds = new Set(chosenFoods.map(f => f.id))
  const excluded = new Set(chosenIds) // never suggest already-chosen foods

  // ── Level 1: bidirectional direct synergies ────────────────────────────
  const candidates = new Map() // id → { food, count, synLinks, level }

  function addCandidate(targetId, fromFood, syn) {
    if (excluded.has(targetId)) return
    const target = FOOD_MAP.get(targetId)
    if (!target) return
    if (!candidates.has(targetId)) {
      candidates.set(targetId, { food: target, count: 0, synLinks: [], level: 1 })
    }
    const c = candidates.get(targetId)
    c.count++
    c.synLinks.push({ fromFood, syn })
  }

  for (const food of chosenFoods) {
    // Forward: food → its synergy targets
    for (const syn of food.synergies || []) {
      addCandidate(syn.aliment_associe_id, food, syn)
    }
    // Reverse: other foods that point to this food
    for (const { sourceFood, syn } of REVERSE_SYNERGY.get(food.id) || []) {
      if (excluded.has(sourceFood.id)) continue
      // The sourceFood synergizes with food → suggest sourceFood
      if (!candidates.has(sourceFood.id)) {
        candidates.set(sourceFood.id, { food: sourceFood, count: 0, synLinks: [], level: 1 })
      }
      const c = candidates.get(sourceFood.id)
      c.count++
      c.synLinks.push({ fromFood: food, syn })
    }
  }

  const level1 = [...candidates.values()]
    .sort((a, b) => b.count - a.count || synergyNutrientScore(b) - synergyNutrientScore(a))

  if (level1.length >= maxCount) {
    return level1.slice(0, maxCount).sort((a, b) => synergyNutrientScore(b) - synergyNutrientScore(a))
  }

  // ── Level 2: nutritional complementarity ────────────────────────────────
  // Find nutrients already covered by chosen foods
  const coveredBienfaits = new Set(chosenFoods.flatMap(f => f.bienfaits?.map(b => b.id) || []))
  const coveredTeneurs = new Set(chosenFoods.flatMap(f => Object.keys(f.teneurs || {}).filter(k => k !== 'source_teneurs')))

  // Priority nutrients not yet represented
  const PRIORITY_NUTRIENTS = [
    'omega3', 'calcium', 'vitamine_d', 'magnesium', 'zinc',
    'vitamine_e', 'vitamine_k', 'folates', 'potassium', 'anthocyanes',
    'beta_carotene', 'vitamine_c', 'fer',
  ]
  const uncoveredPriority = PRIORITY_NUTRIENTS.filter(n => !coveredTeneurs.has(n))

  const level2candidates = []
  for (const food of foodsData) {
    if (excluded.has(food.id) || candidates.has(food.id)) continue
    const foodTeneurs = Object.keys(food.teneurs || {}).filter(k => k !== 'source_teneurs')
    const foodBienfaits = food.bienfaits?.map(b => b.id) || []
    // Score: how many uncovered priority nutrients does this food bring?
    const newNutrients = uncoveredPriority.filter(n => foodTeneurs.includes(n) || foodBienfaits.includes(n))
    if (newNutrients.length > 0) {
      level2candidates.push({
        food,
        count: 0,
        synLinks: [],
        level: 2,
        l2score: newNutrients.length,
      })
    }
  }
  level2candidates.sort((a, b) => b.l2score - a.l2score)

  const combined = [...level1]
  const needed = maxCount - combined.length
  combined.push(...level2candidates.slice(0, needed))

  if (combined.length >= maxCount) {
    return combined.slice(0, maxCount).sort((a, b) =>
      a.level - b.level || synergyNutrientScore(b) - synergyNutrientScore(a)
    )
  }

  // ── Level 3: category diversity ─────────────────────────────────────────
  const chosenCats = new Set(chosenFoods.map(f => f.categorie))
  const alreadySuggested = new Set(combined.map(c => c.food.id))

  const level3candidates = []
  for (const cat of CATEGORY_PRIORITY) {
    if (chosenCats.has(cat)) continue
    const reps = foodsData.filter(f =>
      f.categorie === cat && !excluded.has(f.id) && !alreadySuggested.has(f.id)
    )
    if (reps.length > 0) {
      level3candidates.push({ food: reps[0], count: 0, synLinks: [], level: 3 })
    }
  }

  combined.push(...level3candidates.slice(0, maxCount - combined.length))

  return combined.slice(0, maxCount).sort((a, b) =>
    a.level - b.level || synergyNutrientScore(b) - synergyNutrientScore(a)
  )
}

// ── Score ───────────────────────────────────────────────────────────────────
export function computeScore(activeSynergies) {
  return Math.min(activeSynergies.length * 20, 100)
}

export function scoreBadge(score) {
  if (score >= 80) return '🏆 Synergie maximale'
  if (score >= 60) return '💥 Assiette optimisée'
  if (score >= 40) return '🔥 Combo puissant'
  if (score >= 20) return '⚡ Duo synergique'
  return null
}

// ── Copy text ───────────────────────────────────────────────────────────────
export function buildCopyText(chosenFoods, activeSynergies, score) {
  const ingredients = chosenFoods.map(f => `${f.emoji} ${f.nom}`).join(', ')
  const synLines = activeSynergies.map(s =>
    `• ${s.foodA.nom} + ${s.foodB.nom} → ${s.syn.nutriment_cle}`
  ).join('\n')
  return [
    'Mon assiette synergie OptiVégé 🌿',
    '',
    `Ingrédients : ${ingredients}`,
    '',
    'Synergies :',
    synLines,
    '',
    `Score : ${score}/100`,
    '',
    'Créé sur optivege.vercel.app/creer',
  ].join('\n')
}

// ── Hook ────────────────────────────────────────────────────────────────────
export function useSynergyBuilder() {
  const [chosenFoods, setChosenFoods] = useState([])
  const [showResult, setShowResult] = useState(false)

  const activeSynergies = useMemo(() => computeActiveSynergies(chosenFoods), [chosenFoods])
  const score = useMemo(() => computeScore(activeSynergies), [activeSynergies])
  const suggestions = useMemo(() => computeSuggestions(chosenFoods), [chosenFoods])

  const step = chosenFoods.length  // 0 = pick protein, 1+ = pick enrichments
  const canFinish = chosenFoods.length >= 2
  const maxReached = chosenFoods.length >= 6

  const pickFood = useCallback((food) => {
    setChosenFoods(prev => {
      if (prev.find(f => f.id === food.id)) return prev
      return [...prev, food]
    })
    if (chosenFoods.length >= 5) setShowResult(true) // 6th food auto-finishes
  }, [chosenFoods.length])

  const finalize = useCallback(() => setShowResult(true), [])

  const reset = useCallback(() => {
    setChosenFoods([])
    setShowResult(false)
  }, [])

  const addToPlanner = useCallback(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('optivege_planner') || '{}')
      // Just store the food ids as a hint — planner uses recipe ids, so we flag it
      localStorage.setItem('optivege_planner', JSON.stringify({
        ...existing,
        creatorFoodIds: chosenFoods.map(f => f.id),
        nbPersonnes: existing.nbPersonnes ?? 2,
      }))
    } catch {}
  }, [chosenFoods])

  const copyCreation = useCallback(async () => {
    const text = buildCopyText(chosenFoods, activeSynergies, score)
    try {
      await navigator.clipboard.writeText(text)
    } catch {}
  }, [chosenFoods, activeSynergies, score])

  return {
    chosenFoods, step, showResult,
    activeSynergies, score, suggestions,
    canFinish, maxReached,
    pickFood, finalize, reset,
    addToPlanner, copyCreation,
  }
}
