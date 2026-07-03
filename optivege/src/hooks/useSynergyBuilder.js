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

// ── Suggestions: foods that synergise with what's already chosen ───────────
export function computeSuggestions(chosenFoods, maxCount = 6) {
  const chosenIds = new Set(chosenFoods.map(f => f.id))
  const candidates = new Map() // id → { food, count, synLinks }

  for (const food of chosenFoods) {
    for (const syn of food.synergies || []) {
      const targetId = syn.aliment_associe_id
      if (chosenIds.has(targetId)) continue
      const target = FOOD_MAP.get(targetId)
      if (!target) continue

      if (!candidates.has(targetId)) {
        candidates.set(targetId, { food: target, count: 0, synLinks: [] })
      }
      const c = candidates.get(targetId)
      c.count++
      c.synLinks.push({ fromFood: food, syn })
    }
  }

  const selected = [...candidates.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, maxCount)

  // Re-sort selected candidates by nutritional efficacy of the key synergy nutrient
  return selected.sort((a, b) => synergyNutrientScore(b) - synergyNutrientScore(a))
}

// ── Score ───────────────────────────────────────────────────────────────────
export function computeScore(activeSynergies) {
  return Math.min(activeSynergies.length * 10, 100)
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
