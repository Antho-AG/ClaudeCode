import { useState, useEffect, useCallback } from 'react'
import recipesData from '../data/recipes.json'
import foodsData from '../data/foods.json'

const STORAGE_KEY = 'optivege_planner'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// ─── Ingredient parsing ────────────────────────────────────────────────────

const FRAC_MAP = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 0.333, '⅔': 0.667 }

export function parseIngredient(quantiteStr) {
  // Absent or empty → treat as 1 piece
  if (!quantiteStr || String(quantiteStr).trim() === '') {
    return { amount: 1, unit: null, raw: null }
  }
  let s = String(quantiteStr).trim()

  // Replace unicode fractions before anything else
  for (const [frac, val] of Object.entries(FRAC_MAP)) {
    s = s.replace(frac, val + ' ')
  }
  s = s.trim()

  // Match leading number (int or decimal) optionally followed by unit
  // "200g" "200 g" "1 c.s." "2 betteraves" "1" "0.5 c.c."
  const m = s.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/)
  if (m) {
    return {
      amount: parseFloat(m[1].replace(',', '.')),
      unit: m[2].trim() || null,
      raw: quantiteStr,
    }
  }
  // Non-numeric string ("Sel, poivre", "Optionnel", "Épices", "Quelques feuilles"…)
  return { amount: null, unit: null, raw: quantiteStr }
}

function roundSmart(n, unit) {
  if (unit === 'g' || unit === 'ml') {
    if (n < 10) return Math.round(n / 5) * 5 || 5
    return Math.round(n / 10) * 10
  }
  if (!unit) return Math.ceil(n) // pieces
  return Math.round(n * 10) / 10 // other units
}

function displayAmount(n, unit) {
  // Fractions only make sense for sub-1 values without a weight/volume unit
  if (!unit) {
    if (Math.abs(n - 0.5) < 0.05) return '½'
    if (Math.abs(n - 0.25) < 0.05) return '¼'
    if (Math.abs(n - 0.75) < 0.05) return '¾'
  }
  return String(n)
}

// ─── Ingredient normalisation ───────────────────────────────────────────────

// Aliases: any of these nom fragments → canonical display name used as grouping key
const NAME_ALIASES = [
  [/huile d.olive\b.*/i,          "Huile d'olive"],
  [/citrons?\s*\(.*\)/i,          'Citron'],
  [/citron vert\s*\(.*\)/i,       'Citron vert'],
  [/citrons?\b/i,                 'Citron'],
  [/oranges?\s*\(.*\)/i,          'Orange'],
  [/oranges?\b/i,                 'Orange'],
  [/épinards? frais\b.*/i,        'Épinards frais'],
  [/épinards?\b/i,                'Épinards frais'],
  [/kale frais\b.*/i,             'Kale'],
  [/poivrons? rouges?\b.*/i,      'Poivron rouge'],
  [/poivrons? verts?\b.*/i,       'Poivron vert'],
  [/persil\b.*/i,                 'Persil frais'],
  [/menthe\b.*/i,                 'Menthe fraîche'],
  [/oignons? nouveaux?\b.*/i,     'Oignon nouveau'],
  [/oignons?\b.*/i,               'Oignon'],
  [/gingembre\b.*/i,              'Gingembre frais'],
  [/sauce soja\b.*/i,             'Sauce soja (tamari)'],
  [/lait végétal\b.*/i,           'Lait végétal'],
  [/lentilles? corail\b.*/i,      'Lentilles corail (sèches)'],
  [/lentilles? vertes?\b.*/i,     'Lentilles vertes (sèches)'],
  [/pois chiches? cuits?\b.*/i,   'Pois chiches (cuits)'],
  [/graines? de chia\b.*/i,       'Graines de chia'],
  [/graines? de lin\b.*/i,        'Graines de lin'],
  [/graines? de courge\b.*/i,     'Graines de courge'],
  [/graines? de sésame\b.*/i,     'Graines de sésame'],
  [/tofu ferme\b.*/i,             'Tofu ferme'],
  [/riz complet\b.*/i,            'Riz complet'],
  [/sarrasin\b.*/i,               'Sarrasin'],
  [/patate douce\b.*/i,           'Patate douce'],
  [/quinoa\b.*/i,                 'Quinoa'],
  [/avocat\b.*/i,                 'Avocat'],
  [/maïs\b.*/i,                   'Maïs'],
  [/coriandre fraîche\b.*/i,      'Coriandre fraîche'],
]

// Strips prep instructions that don't belong in the shopping list
const PREP_SUFFIXES = [
  /\s+en\s+(lamelles|brunoise|dés|rondelles|cubes?|julienne|quartiers?|tranches?)/i,
  /\s+(haché[es]?|râpé[es]?|émincé[es]?|coupé[es]?|tranché[es]?|écrasé[es]?|pressé[es]?)/i,
  /\s+(frais|fraîche[s]?|sec[s]?|sèches?|décortiqué[es]?|rôti[es]?|cuit[es]?)/i,
  /\s+\(.*\)$/,   // parenthetical notes at end
  /\s*!.*/,       // "généreux !" etc
]

function canonicalName(nom) {
  // 1. Try exact alias match first (most reliable)
  for (const [pattern, canonical] of NAME_ALIASES) {
    if (pattern.test(nom)) return canonical
  }
  // 2. Strip prep suffixes progressively
  let cleaned = nom
  for (const suffix of PREP_SUFFIXES) {
    cleaned = cleaned.replace(suffix, '').trim()
  }
  // 3. Strip trailing parenthetical
  cleaned = cleaned.split('(')[0].trim()
  return cleaned
}

// Explode "Cumin, paprika fumé, sel" blocks into individual spice entries
function explodeSpiceBlock(ing) {
  const nom = ing.nom || ''
  // Detect: no numeric quantite AND nom contains commas between recognizable spice names
  if (ing.quantite && /^\d/.test(String(ing.quantite))) return [ing]
  const parts = nom.split(',').map(s => s.trim()).filter(Boolean)
  if (parts.length <= 1) return [ing]
  // Each part becomes an individual "au goût" entry
  return parts.map(p => ({ ...ing, nom: p, quantite: 'Au goût' }))
}

// ─── Shopping list computation ──────────────────────────────────────────────

const CATEGORY_KEYWORDS = {
  '🥦 Légumes & légumes-feuilles': [
    'épinard', 'spinach', 'kale', 'brocoli', 'carotte', 'courgette', 'tomate', 'aubergine',
    'oignon', 'ail', 'poireau', 'chou', 'betterave', 'poivron', 'asperge', 'artichaut',
    'concombre', 'patate douce', 'céleri', 'navet', 'radis', 'persil', 'coriandre', 'basilic',
    'menthe', 'avocats', 'courge', 'butternut', 'champignon', 'shiitake',
  ],
  '🫘 Légumineuses': [
    'lentille', 'pois chiche', 'haricot', 'edamame', 'fève', 'soja', 'pois cassé',
  ],
  '🌾 Céréales & pseudo-céréales': [
    'riz', 'quinoa', 'avoine', 'sarrasin', 'millet', 'orge', 'blé', 'farro', 'teff',
    'amarante', 'flocon',
  ],
  '🍎 Fruits': [
    'citron', 'orange', 'avocat', 'mangue', 'grenade', 'pomme', 'banane', 'fraise',
    'myrtille', 'kiwi', 'papaye', 'raisin', 'cerise', 'abricot', 'datte', 'figue',
    'goji', 'baie', 'lime', 'pamplemousse',
  ],
  '🌰 Oléagineux & graines': [
    'amande', 'noix', 'sésame', 'chia', 'lin', 'tournesol', 'chanvre', 'courge', 'cajou',
    'noisette', 'pistache', 'tahini', 'beurre d\'amande', 'purée d\'amande',
  ],
  '🧂 Épices & condiments': [
    'cumin', 'curcuma', 'gingembre', 'cannelle', 'poivre', 'sel', 'miso', 'tamari',
    'shoyu', 'sauce soja', 'vinaigre', 'levure', 'moutarde', 'paprika', 'coriandre en poudre',
    'curry', 'muscade', 'cardamome', 'sumac', 'zaatar', 'ras el hanout',
  ],
}

function categorizeIngredient(nom) {
  const lower = nom.toLowerCase()
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return cat
  }
  return '🧴 Autres'
}

const CATEGORY_ORDER = [
  '🥦 Légumes & légumes-feuilles',
  '🫘 Légumineuses',
  '🌾 Céréales & pseudo-céréales',
  '🍎 Fruits',
  '🌰 Oléagineux & graines',
  '🧂 Épices & condiments',
  '🧴 Autres',
]

export function computeShoppingList(selectedRecipes, nbPersonnes) {
  const aggregated = {} // key: `${canonName_lower}||${unit}` → { nom, amount, unit, category }

  for (const recipe of selectedRecipes) {
    const ratio = nbPersonnes / (recipe.portions || 2)
    const ingredients = (recipe.ingredients || []).flatMap(explodeSpiceBlock)

    for (const ing of ingredients) {
      const { amount, unit, raw } = parseIngredient(ing.quantite)
      const canonName = canonicalName(ing.nom)
      const category = categorizeIngredient(canonName)

      if (amount !== null) {
        const key = `${canonName.toLowerCase()}||${unit || ''}`
        if (aggregated[key]) {
          aggregated[key].amount += amount * ratio
        } else {
          aggregated[key] = { nom: canonName, amount: amount * ratio, unit, category, raw }
        }
        // If a quantified entry exists, remove a prior "Au goût" entry for same ingredient
        const rawKey = `${canonName.toLowerCase()}||raw`
        delete aggregated[rawKey]
      } else {
        // Non-numeric quantity — only add if no quantified entry already exists
        const canonLower = canonName.toLowerCase()
        const hasQuantified = Object.keys(aggregated).some(
          k => k.startsWith(canonLower + '||') && !k.endsWith('||raw')
        )
        if (!hasQuantified) {
          const key = `${canonLower}||raw`
          if (!aggregated[key]) {
            aggregated[key] = { nom: canonName, amount: null, unit: null, category, raw }
          }
        }
      }
    }
  }

  // Round and format
  const items = Object.values(aggregated).map(item => ({
    ...item,
    amountDisplay: item.amount !== null
      ? displayAmount(roundSmart(item.amount, item.unit), item.unit)
      : null,
  }))

  // Group by category in defined order
  const groups = {}
  for (const cat of CATEGORY_ORDER) groups[cat] = []
  for (const item of items) {
    const cat = item.category
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(item)
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([category, items]) => ({ category, items }))
}

// ─── Auto-selection algorithm ───────────────────────────────────────────────

export function autoSelectRecipes(n, excluded = []) {
  const pool = recipesData.filter(r => !excluded.includes(r.id))
  const selected = []
  const usedBenefits = new Set()
  const usedMainIngredients = new Set()

  // Score each recipe
  function score(recipe) {
    let s = 0
    // Prefer multi-synergy recipes
    s += (recipe.synergies_utilisees?.length || 0) * 10
    // Prefer uncovered benefits
    const newBenefits = (recipe.bienfaits_cles || []).filter(b => !usedBenefits.has(b))
    s += newBenefits.length * 5
    // Prefer diverse main ingredients
    const mainIng = recipe.ingredients?.[0]?.nom?.toLowerCase().split(' ')[0] || ''
    if (!usedMainIngredients.has(mainIng)) s += 8
    // Penalize same prep time cluster
    return s
  }

  const candidates = [...pool]

  for (let i = 0; i < Math.min(n, candidates.length); i++) {
    // Shuffle slightly with weighting
    candidates.sort((a, b) => score(b) - score(a))
    const pick = candidates.shift()
    if (!pick) break
    selected.push(pick)
    ;(pick.bienfaits_cles || []).forEach(b => usedBenefits.add(b))
    const mainIng = pick.ingredients?.[0]?.nom?.toLowerCase().split(' ')[0] || ''
    usedMainIngredients.add(mainIng)
  }

  return selected
}

// ─── Manual mode helpers ────────────────────────────────────────────────────

export function findRecipesForFood(foodNom) {
  const lower = foodNom.toLowerCase()
  return recipesData.filter(r =>
    r.ingredients?.some(ing => ing.nom.toLowerCase().includes(lower))
  )
}

export function getFoodSynergies(foodId) {
  const food = foodsData.find(f => f.id === foodId)
  return food?.synergies || []
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function usePlanner() {
  const saved = loadFromStorage()

  const [nbRepas, setNbRepas] = useState(saved?.nbRepas ?? 6)
  const [nbPersonnes, setNbPersonnes] = useState(saved?.nbPersonnes ?? 2)
  const [mode, setMode] = useState(saved?.mode ?? 'auto')
  const [selectedRecipes, setSelectedRecipes] = useState(() => {
    if (!saved?.selectedIds) return []
    return saved.selectedIds.map(id => recipesData.find(r => r.id === id)).filter(Boolean)
  })
  const [checkedItems, setCheckedItems] = useState(saved?.checkedItems ?? {})

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        nbRepas, nbPersonnes, mode,
        selectedIds: selectedRecipes.map(r => r.id),
        checkedItems,
      }))
    } catch {}
  }, [nbRepas, nbPersonnes, mode, selectedRecipes, checkedItems])

  const generateAuto = useCallback(() => {
    const recipes = autoSelectRecipes(nbRepas)
    setSelectedRecipes(recipes)
    setCheckedItems({})
  }, [nbRepas])

  const replaceRecipe = useCallback((recipeId) => {
    setSelectedRecipes(prev => {
      const excluded = prev.map(r => r.id)
      const [replacement] = autoSelectRecipes(1, excluded)
      if (!replacement) return prev
      return prev.map(r => r.id === recipeId ? replacement : r)
    })
  }, [])

  const addRecipe = useCallback((recipe) => {
    setSelectedRecipes(prev => {
      if (prev.find(r => r.id === recipe.id)) return prev
      return [...prev, recipe]
    })
  }, [])

  const removeRecipe = useCallback((recipeId) => {
    setSelectedRecipes(prev => prev.filter(r => r.id !== recipeId))
  }, [])

  const toggleItem = useCallback((key) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const reset = useCallback(() => {
    setSelectedRecipes([])
    setCheckedItems({})
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const shoppingList = computeShoppingList(selectedRecipes, nbPersonnes)

  const totalItems = shoppingList.reduce((acc, g) => acc + g.items.length, 0)

  return {
    nbRepas, setNbRepas,
    nbPersonnes, setNbPersonnes,
    mode, setMode,
    selectedRecipes,
    generateAuto,
    replaceRecipe,
    addRecipe,
    removeRecipe,
    checkedItems,
    toggleItem,
    shoppingList,
    totalItems,
    reset,
  }
}
