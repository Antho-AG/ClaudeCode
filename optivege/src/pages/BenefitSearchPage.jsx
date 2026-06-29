import { useParams, Link } from 'react-router-dom'
import useMeta from '../hooks/useMeta'
import { useAllBenefits, useBenefit, useFoodsByBenefit, useRecipe } from '../hooks/useFoodData'
import SourceCitation from '../components/ui/SourceCitation'
import FoodCard from '../components/food/FoodCard'
import RecipeCard from '../components/recipes/RecipeCard'
import benefitsData from '../data/benefits.json'

// Page liste des bienfaits
function BenefitList() {
  const benefits = useAllBenefits()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-green-dark mb-2">💪 Recherche par bienfait</h1>
      <p className="text-gray-600 mb-6">
        Choisissez un nutriment ou bienfait pour découvrir les meilleurs aliments végétariens et les synergies associées.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {benefits.map(b => (
          <Link
            key={b.id}
            to={`/bienfaits/${b.id}`}
            className="card hover:shadow-md hover:border-green-main transition-all flex items-start gap-4"
          >
            <span className="text-4xl">{b.emoji}</span>
            <div>
              <h3 className="font-heading font-semibold text-green-dark">{b.label}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{b.description}</p>
              {b.ajr && (
                <p className="text-xs text-gray-400 mt-1">AJR : {b.ajr.valeur}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Page détail d'un bienfait
function BenefitDetail({ id }) {
  const benefit = useBenefit(id)
  const foods = useFoodsByBenefit(id)
  const recipe = useRecipe(benefit?.recette_optimisee_id)

  if (!benefit) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🌿</div>
        <h2 className="font-heading text-2xl font-bold text-green-dark mb-2">Bienfait introuvable</h2>
        <Link to="/bienfaits" className="btn-primary">← Retour aux bienfaits</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      {/* Fil d'Ariane */}
      <Link to="/bienfaits" className="text-sm text-green-dark hover:text-green-mid font-medium">
        ← Retour aux bienfaits
      </Link>

      {/* Section A — Présentation */}
      <section>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-5xl">{benefit.emoji}</span>
          <div>
            <h1 className="text-3xl font-heading font-bold text-green-dark">{benefit.label}</h1>
            {benefit.role && (
              <p className="text-sm text-gray-500 mt-1">{benefit.role}</p>
            )}
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
        {benefit.ajr && (
          <div className="mt-4 inline-flex items-center gap-2 bg-green-bg border border-green-pale px-4 py-2 rounded-xl text-sm">
            <span className="font-semibold text-green-dark">AJR :</span>
            <span className="text-gray-700">{benefit.ajr.valeur}</span>
            <span className="text-gray-400 text-xs">— Source : {benefit.ajr.source}</span>
          </div>
        )}
        {benefit.note && (
          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-gray-700">
            💡 {benefit.note}
          </div>
        )}
      </section>

      {/* Section B — Top aliments */}
      {foods.length > 0 && (
        <section>
          <h2 className="section-title">🏆 Top aliments végétariens</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {foods.map(food => <FoodCard key={food.id} food={food} />)}
          </div>
        </section>
      )}

      {/* Section C — Synergies globales */}
      {benefit.conseil_synergie_global && (
        <section>
          <h2 className="section-title">✨ Synergies pour ce nutriment</h2>
          <div className="card border-l-4 border-l-green-main">
            <p className="text-gray-700 leading-relaxed">{benefit.conseil_synergie_global}</p>
            {benefit.sources?.length > 0 && (
              <div className="mt-3 flex flex-col gap-1">
                {benefit.sources.map((s, i) => <SourceCitation key={i} source={s} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section D — Recette optimisée */}
      {recipe && (
        <section>
          <h2 className="section-title">🍽️ Recette optimisée pour ce bienfait</h2>
          <div className="relative">
            <span className="absolute -top-2 left-4 bg-orange-main text-white text-xs px-2 py-0.5 rounded-full font-medium z-10">
              Optimisé : {benefit.label}
            </span>
            <RecipeCard recipe={recipe} />
          </div>
        </section>
      )}
    </div>
  )
}

export default function BenefitSearchPage() {
  useMeta({
    title: 'Rechercher par bienfait nutritionnel (fer, calcium, protéines...) | Optivege',
    description: 'Explorez les aliments végétaux par bienfait nutritionnel : fer, calcium, protéines, oméga-3, antioxydants. Données sourcées CIQUAL 2020 et PubMed.',
  })
  const { id } = useParams()
  return id ? <BenefitDetail id={id} /> : <BenefitList />
}
