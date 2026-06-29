import { useParams, Link } from 'react-router-dom'
import FoodDetail from '../components/food/FoodDetail'
import { useFood } from '../hooks/useFoodData'
import useMeta from '../hooks/useMeta'

export default function FoodDetailPage() {
  const { id } = useParams()
  const food = useFood(id)

  useMeta({
    title: food ? `${food.nom} : teneurs, synergies et associations | Optivege` : 'Optivege',
    description: food ? `Découvrez les bienfaits nutritionnels de ${food.nom}, ses synergies alimentaires documentées et les meilleures associations pour maximiser ses apports.` : undefined,
  })

  if (!food) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🌿</div>
        <h2 className="font-heading text-2xl font-bold text-green-dark mb-2">Aliment introuvable</h2>
        <p className="text-gray-600 mb-6">L'aliment "{id}" n'existe pas dans notre base de données.</p>
        <Link to="/aliments" className="btn-primary">← Retour à la recherche</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-green-bg border-b border-green-pale py-3 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/aliments" className="text-sm text-green-dark hover:text-green-mid font-medium">
            ← Retour aux aliments
          </Link>
        </div>
      </div>
      <FoodDetail food={food} />
    </div>
  )
}
