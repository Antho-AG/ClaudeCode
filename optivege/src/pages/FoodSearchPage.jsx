import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import FoodCard from '../components/food/FoodCard'
import { useAllFoods } from '../hooks/useFoodData'
import { matchesQuery } from '../utils/searchUtils'

const CATEGORIES = ['Toutes', 'légumineuse', 'légume-feuille', 'légume', 'fruit', 'pseudo-céréale', 'oléagineux', 'épice', 'légumineuse transformée']

export default function FoodSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState('Toutes')
  const allFoods = useAllFoods()

  useEffect(() => {
    const q = searchParams.get('q') || ''
    setQuery(q)
  }, [searchParams])

  const filtered = allFoods.filter(food => {
    const matchQ = !query || matchesQuery(food, query)
    const matchCat = category === 'Toutes' || food.categorie === category
    return matchQ && matchCat
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams(query ? { q: query } : {})
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-green-dark mb-2">🥦 Recherche par aliment</h1>
      <p className="text-gray-600 mb-6">
        Trouvez un aliment végétarien et découvrez ses synergies alimentaires documentées.
      </p>

      {/* Barre de recherche */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Épinard, lentille, quinoa, avocat..."
          className="flex-1 px-4 py-3 rounded-xl border border-green-pale focus:outline-none focus:border-green-main bg-white"
        />
        <button type="submit" className="btn-primary px-6">
          Rechercher
        </button>
      </form>

      {/* Filtres catégorie */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-green-dark text-white'
                : 'bg-white border border-green-pale text-gray-600 hover:border-green-main'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Résultats */}
      <p className="text-sm text-gray-500 mb-4">
        {filtered.length} aliment{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
        {query && ` pour "${query}"`}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(food => <FoodCard key={food.id} food={food} />)}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium">Aucun aliment trouvé pour "{query}"</p>
          <p className="text-sm mt-1">Essayez avec un terme plus général ou <Link to="/aliments" className="text-green-dark underline">effacez la recherche</Link>.</p>
        </div>
      )}
    </div>
  )
}
