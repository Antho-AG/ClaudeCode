import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useMeta from '../hooks/useMeta'
import RecipeCard from '../components/recipes/RecipeCard'
import RecipeDetail from '../components/recipes/RecipeDetail'
import { useAllRecipes, useRecipe } from '../hooks/useFoodData'

// link: '/bienfaits/id' | '/lexique#id' | null
const BENEFIT_FILTERS = [
  { id: 'all', label: 'Toutes', link: null },
  { id: 'fer', label: '⚙️ Fer', link: '/bienfaits/fer' },
  { id: 'antioxydants', label: '🛡️ Antioxydants', link: '/bienfaits/antioxydants' },
  { id: 'fibres', label: '🌿 Fibres', link: '/bienfaits/fibres' },
  { id: 'proteines', label: '💪 Protéines', link: '/bienfaits/proteines', merge: ['proteines_completes'] },
  { id: 'calcium', label: '🦴 Calcium', link: '/bienfaits/calcium' },
  { id: 'vitamine_c', label: '🍋 Vitamine C', link: '/bienfaits/vitamine_c' },
  { id: 'omega3', label: '🐟 Oméga-3', link: '/bienfaits/omega3' },
  { id: 'vitamine_k', label: '🦴 Vitamine K', link: '/bienfaits/vitamine_k' },
  { id: 'anti_inflammatoire', label: '🔥 Anti-inflammatoire', link: '/bienfaits/anti_inflammatoire' },
  { id: 'folates', label: '🧬 Folates', link: '/bienfaits/folates' },
  { id: 'beta_carotene', label: '🥕 Bêta-carotène', link: null },
  { id: 'immunite', label: '🛡️ Immunité', link: '/bienfaits/immunite' },
  { id: 'vitamine_b12', label: '🌱 Vitamine B12', link: '/bienfaits/vitamine_b12' },
  { id: 'selenium', label: '✨ Sélénium', link: '/bienfaits/selenium' },
  { id: 'iode', label: '🌊 Iode', link: '/bienfaits/iode' },
  { id: 'omega9', label: '🫒 Oméga-9', link: null },
  { id: 'zeaxanthine', label: '👁️ Zéaxanthine', link: '/lexique#zeaxanthine' },
  { id: 'curcumine', label: '🟡 Curcumine', link: '/lexique#curcumine' },
  { id: 'thyroide', label: '🦋 Thyroïde', link: null },
  { id: 'oleocanthal', label: '💚 Oléocanthal', link: '/lexique#oleocanthal' },
  { id: 'anthocyanes', label: '🫐 Anthocyanes', link: '/lexique#anthocyanes' },
]

const DIFFICULTY_FILTERS = ['Toutes', 'Très facile', 'Facile', 'Moyen']

function RecipeList() {
  const [benefitFilter, setBenefitFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('Toutes')
  const recipes = useAllRecipes()

  const activeFilter = BENEFIT_FILTERS.find(f => f.id === benefitFilter)
  const filtered = recipes.filter(r => {
    const bc = r.bienfaits_cles ?? []
    const matchBenefit = benefitFilter === 'all' ||
      bc.includes(benefitFilter) ||
      (activeFilter?.merge ?? []).some(m => bc.includes(m))
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
          {BENEFIT_FILTERS.map(f => {
            const isActive = benefitFilter === f.id
            return (
              <div key={f.id} className={`flex items-center rounded-xl text-sm font-medium transition-colors border ${
                isActive ? 'bg-green-dark text-white border-green-dark' : 'bg-white border-green-pale text-gray-600'
              }`}>
                <button
                  onClick={() => setBenefitFilter(f.id)}
                  className={`px-3 py-1.5 ${f.link && !isActive ? 'pr-1' : ''}`}
                >
                  {f.label}
                </button>
                {f.link && !isActive && (
                  <Link
                    to={f.link}
                    className="pr-2.5 text-green-main hover:text-green-dark"
                    title="En savoir plus"
                    onClick={e => e.stopPropagation()}
                  >
                    <span className="text-xs">→</span>
                  </Link>
                )}
              </div>
            )
          })}
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
