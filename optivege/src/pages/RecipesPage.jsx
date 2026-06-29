import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useMeta from '../hooks/useMeta'
import RecipeCard from '../components/recipes/RecipeCard'
import RecipeDetail from '../components/recipes/RecipeDetail'
import { useAllRecipes, useRecipe } from '../hooks/useFoodData'

const BENEFIT_FILTERS = [
  { id: 'all', label: 'Toutes' },
  { id: 'fer', label: '⚙️ Fer' },
  { id: 'proteines', label: '💪 Protéines' },
  { id: 'calcium', label: '🦴 Calcium' },
  { id: 'omega3', label: '🐟 Oméga-3' },
  { id: 'antioxydants', label: '🛡️ Antioxydants' },
  { id: 'anti_inflammatoire', label: '🔥 Anti-inflam.' },
]

const DIFFICULTY_FILTERS = ['Toutes', 'Très facile', 'Facile', 'Moyen']

function RecipeList() {
  const [benefitFilter, setBenefitFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('Toutes')
  const recipes = useAllRecipes()

  const filtered = recipes.filter(r => {
    const matchBenefit = benefitFilter === 'all' || r.bienfaits_cles?.includes(benefitFilter)
    const matchDiff = difficultyFilter === 'Toutes' || r.difficulte === difficultyFilter
    return matchBenefit && matchDiff
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-green-dark mb-2">🍽️ Recettes végétariennes</h1>
      <p className="text-gray-600 mb-6">
        Des recettes qui exploitent les synergies alimentaires pour maximiser l'absorption des nutriments. Chaque recette est documentée scientifiquement.
      </p>

      {/* Filtres bienfaits */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Filtrer par bienfait</p>
        <div className="flex flex-wrap gap-2">
          {BENEFIT_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setBenefitFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                benefitFilter === f.id
                  ? 'bg-green-dark text-white'
                  : 'bg-white border border-green-pale text-gray-600 hover:border-green-main'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtres difficulté */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Filtrer par difficulté</p>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTY_FILTERS.map(d => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                difficultyFilter === d
                  ? 'bg-green-dark text-white'
                  : 'bg-white border border-green-pale text-gray-600 hover:border-green-main'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {filtered.length} recette{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>Aucune recette ne correspond à ces filtres.</p>
          <button
            onClick={() => { setBenefitFilter('all'); setDifficultyFilter('Toutes') }}
            className="mt-3 text-green-dark underline text-sm"
          >
            Effacer les filtres
          </button>
        </div>
      )}
    </div>
  )
}

function RecipeDetailPage() {
  const { id } = useParams()
  const recipe = useRecipe(id)

  if (!recipe) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🍽️</div>
        <h2 className="font-heading text-2xl font-bold text-green-dark mb-2">Recette introuvable</h2>
        <Link to="/recettes" className="btn-primary">← Retour aux recettes</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-green-bg border-b border-green-pale py-3 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/recettes" className="text-sm text-green-dark hover:text-green-mid font-medium">
            ← Retour aux recettes
          </Link>
        </div>
      </div>
      <RecipeDetail recipe={recipe} />
    </div>
  )
}

export default function RecipesPage() {
  useMeta({
    title: 'Recettes végétales avec synergies documentées | Optivege',
    description: '21 recettes végétales conçues autour des synergies alimentaires scientifiquement documentées. Fer + vitamine C, protéines complètes, oméga-3 et plus.',
  })
  const { id } = useParams()
  return id ? <RecipeDetailPage /> : <RecipeList />
}
