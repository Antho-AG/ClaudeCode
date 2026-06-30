import { useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import foodsData from '../../data/foods.json'
import recipesData from '../../data/recipes.json'
import RecipePlanCard from './RecipePlanCard'

function findRecipesForFood(foodNom) {
  const lower = foodNom.toLowerCase()
  return recipesData.filter(r =>
    r.ingredients?.some(ing => ing.nom.toLowerCase().includes(lower))
  )
}

export default function ManualSelector({ nbRepas, selectedRecipes, onAdd, onRemove }) {
  const [query, setQuery] = useState('')
  const [selectedFood, setSelectedFood] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)

  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return []
    const lower = query.toLowerCase()
    return foodsData.filter(f => f.nom.toLowerCase().includes(lower)).slice(0, 8)
  }, [query])

  const matchingRecipes = useMemo(() => {
    if (!selectedFood) return []
    return findRecipesForFood(selectedFood.nom)
  }, [selectedFood])

  const foodSynergies = selectedFood?.synergies?.map(s => s.aliment_associe_nom) || []

  function selectFood(food) {
    setSelectedFood(food)
    setQuery(food.nom)
    setShowSuggestions(false)
  }

  const selectedIds = new Set(selectedRecipes.map(r => r.id))

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          <span className="font-semibold text-green-dark">{selectedRecipes.length}</span> / {nbRepas} repas planifiés
        </p>
        {selectedRecipes.length > 0 && (
          <div className="w-40 bg-green-pale rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, (selectedRecipes.length / nbRepas) * 100)}%`, background: '#1D9E75' }}
            />
          </div>
        )}
      </div>

      {/* Search autocomplete */}
      <div className="relative mb-5">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setShowSuggestions(true); setSelectedFood(null) }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Rechercher un aliment (épinards, lentilles...)"
          className="w-full px-4 py-3 rounded-xl border border-green-pale focus:outline-none focus:ring-2 focus:ring-green-main text-sm"
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setSelectedFood(null); setShowSuggestions(false) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >✕</button>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-green-pale z-20 overflow-hidden">
            {suggestions.map(food => (
              <button
                key={food.id}
                onClick={() => selectFood(food)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-green-bg transition-colors text-sm"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <span className="text-xl">{food.emoji}</span>
                <span className="font-medium text-gray-800">{food.nom}</span>
                <span className="text-xs text-gray-400 capitalize ml-auto">{food.categorie}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Synergy hints */}
      {selectedFood && foodSynergies.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>🔗 Va bien avec :</span>
          {foodSynergies.slice(0, 5).map((nom, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: '#E8F7F2', color: '#0F6E56', fontFamily: 'Inter, sans-serif' }}>
              {nom}
            </span>
          ))}
        </div>
      )}

      {/* Matching recipes */}
      {selectedFood && matchingRecipes.length > 0 && (
        <div className="space-y-3 mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-dark mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Recettes avec {selectedFood.nom}
          </p>
          {matchingRecipes.map(recipe => {
            const added = selectedIds.has(recipe.id)
            const hasSynergy = recipe.synergies_utilisees?.some(s =>
              foodSynergies.some(sn => s.aliment_1?.toLowerCase().includes(sn.toLowerCase()) ||
                s.aliment_2?.toLowerCase().includes(sn.toLowerCase()))
            )
            return (
              <div key={recipe.id} className="relative">
                {hasSynergy && (
                  <span className="absolute -top-2 -right-2 z-10 text-xs bg-orange-main text-white px-2 py-0.5 rounded-full font-bold">
                    ✨ Synergie
                  </span>
                )}
                <RecipePlanCard
                  recipe={recipe}
                  onRemove={added ? onRemove : null}
                  showActions={false}
                />
                <button
                  onClick={() => added ? onRemove(recipe.id) : onAdd(recipe)}
                  className="mt-2 w-full text-sm font-medium py-1.5 rounded-lg transition-colors"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    background: added ? '#FEF2F2' : '#E8F7F2',
                    color: added ? '#DC2626' : '#0F6E56',
                  }}
                >
                  {added ? '✓ Ajouté · Retirer' : '+ Ajouter au plan'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {selectedFood && matchingRecipes.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Aucune recette trouvée avec {selectedFood.nom}. <Link to="/recettes" className="text-green-main underline">Voir toutes les recettes →</Link>
        </p>
      )}

      {/* Selected recipes recap */}
      {selectedRecipes.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
            Plan actuel
          </p>
          {selectedRecipes.map(recipe => (
            <RecipePlanCard key={recipe.id} recipe={recipe} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  )
}
