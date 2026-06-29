import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'

const BENEFIT_EMOJI = {
  fer: '⚙️', proteines: '💪', calcium: '🦴', omega3: '🐟',
  antioxydants: '🛡️', fibres: '🌿', vitamine_c: '🍋', folates: '🧬',
  magnesium: '⚡', proteines_completes: '💪', vitamine_k: '🦴', anti_inflammatoire: '🔥',
}

// Card de recette pour la liste
export default function RecipeCard({ recipe }) {
  if (!recipe) return null

  return (
    <Link
      to={`/recettes/${recipe.id}`}
      className="card group hover:shadow-md hover:border-green-main transition-all duration-200 flex flex-col gap-3"
    >
      <div className="flex items-start gap-3">
        <span className="text-4xl">{recipe.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-green-dark group-hover:text-green-mid transition-colors leading-tight">
            {recipe.nom}
          </h3>
          <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
            <span>⏱️ {recipe.temps}</span>
            <span>👤 {recipe.portions} portions</span>
            <span className="font-medium text-green-main">{recipe.difficulte}</span>
          </div>
        </div>
      </div>

      {recipe.bienfaits_cles?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {recipe.bienfaits_cles.slice(0, 3).map(tag => (
            <Badge
              key={tag}
              label={tag.replace(/_/g, ' ')}
              emoji={BENEFIT_EMOJI[tag]}
              variant="green"
            />
          ))}
        </div>
      )}

      {recipe.synergies_utilisees?.[0] && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-2.5 text-xs">
          <span className="font-semibold text-orange-dark">✨ Synergie star : </span>
          <span className="text-gray-700">{recipe.synergies_utilisees[0].benefice}</span>
        </div>
      )}

      <span className="text-xs text-green-main font-medium mt-auto">Voir la recette →</span>
    </Link>
  )
}
