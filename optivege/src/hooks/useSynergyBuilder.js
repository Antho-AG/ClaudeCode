import { useState, useMemo, useCallback } from 'react'
import foodsData from '../data/foods.json'

const FOOD_MAP = new Map(foodsData.map(f => [f.id, f]))

// ── Protein filter ──────────────────────────────────────────────────────────
const PROTEIN_CATS = new Set(['légumineuse', 'légumineuse transformée', 'pseudo-céréale'])
const PROTEIN_IDS  = new Set(['spiruline', 'levure_nutritionnelle', 'chlorelle'])

export const proteinSources = foodsData.filter(f =>
  PROTEIN_CATS.has(f.categorie) ||
  PROTEIN_IDS.has(f.id) ||
  f.tags?.includes('proteines') ||
  f.tags?.includes('proteines_completes')
)

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

  return [...candidates.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, maxCount)
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
