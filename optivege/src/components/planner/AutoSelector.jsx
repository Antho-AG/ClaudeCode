import RecipePlanCard from './RecipePlanCard'

export default function AutoSelector({ nbRepas, selectedRecipes, onGenerate, onReplace, onRemove }) {
  const hasRecipes = selectedRecipes.length > 0

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          {hasRecipes
            ? `${selectedRecipes.length} recette${selectedRecipes.length > 1 ? 's' : ''} sélectionnée${selectedRecipes.length > 1 ? 's' : ''} · Cliquez ↻ pour changer une recette`
            : 'Laissez l\'algorithme composer un plan varié et riche en synergies.'}
        </p>
        <button
          onClick={onGenerate}
          className="btn-primary flex items-center gap-2 text-sm px-4 py-2"
        >
          ⚡ {hasRecipes ? 'Régénérer' : `Générer ${nbRepas} repas`}
        </button>
      </div>

      {hasRecipes && (
        <div className="space-y-3">
          {selectedRecipes.map(recipe => (
            <RecipePlanCard
              key={recipe.id}
              recipe={recipe}
              onReplace={onReplace}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}

      {!hasRecipes && (
        <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-green-pale rounded-2xl">
          Cliquez sur "Générer" pour obtenir un plan équilibré
        </div>
      )}
    </div>
  )
}
