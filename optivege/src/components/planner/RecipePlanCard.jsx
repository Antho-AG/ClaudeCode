import { Link } from 'react-router-dom'

export default function RecipePlanCard({ recipe, onReplace, onRemove, showActions = true }) {
  return (
    <div className="card flex items-start gap-3 group">
      <span className="text-3xl flex-shrink-0">{recipe.emoji}</span>
      <div className="flex-1 min-w-0">
        <Link
          to={`/recettes/${recipe.id}`}
          className="font-heading font-semibold text-green-dark hover:text-green-mid transition-colors block leading-snug"
        >
          {recipe.nom}
        </Link>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
          <span>⏱️ {recipe.temps}</span>
          <span>👤 {recipe.portions} portions</span>
          <span className="text-green-main font-medium">{recipe.difficulte}</span>
        </div>
        {recipe.synergies_utilisees?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {recipe.synergies_utilisees.slice(0, 2).map((s, i) => (
              <span key={i} className="text-xs bg-orange-50 text-orange-dark px-2 py-0.5 rounded-full font-medium">
                ✨ {s.benefice}
              </span>
            ))}
          </div>
        )}
      </div>
      {showActions && (
        <div className="flex flex-col gap-1 flex-shrink-0">
          {onReplace && (
            <button
              onClick={() => onReplace(recipe.id)}
              title="Remplacer par une autre recette"
              className="text-xs px-2 py-1 rounded-lg border border-green-pale text-green-dark hover:bg-green-bg transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              ↻
            </button>
          )}
          {onRemove && (
            <button
              onClick={() => onRemove(recipe.id)}
              title="Retirer du plan"
              className="text-xs px-2 py-1 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  )
}
