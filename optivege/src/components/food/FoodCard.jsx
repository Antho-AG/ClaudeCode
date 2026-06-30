import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import FoodIcon from './FoodIcon'

const BENEFIT_EMOJI = {
  fer: '⚙️', proteines: '💪', calcium: '🦴', omega3: '🐟',
  antioxydants: '🛡️', fibres: '🌿', vitamine_c: '🍋', folates: '🧬',
  magnesium: '⚡', proteines_completes: '💪', vitamine_k: '🦴',
  isoflavones: '🌱', omega9: '🫒', potassium: '❤️', anti_inflammatoire: '🔥',
  zinc: '⚡', iode: '🌊', detox: '🧹', immunite: '🛡️',
}

export default function FoodCard({ food }) {
  if (!food) return null

  return (
    <Link
      to={`/aliments/${food.id}`}
      className="card group hover:shadow-md hover:border-green-main transition-all duration-200 flex flex-col gap-3 relative"
    >
      {food.super_aliment && (
        <div className="absolute -top-2 -right-2 bg-orange-main text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
          ⭐ Super
        </div>
      )}

      <div className="flex items-start gap-3">
        <FoodIcon food={food} size={40} />
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-green-dark group-hover:text-green-mid transition-colors">
            {food.nom}
          </h3>
          <span className="text-xs text-gray-500 capitalize">{food.categorie}</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
        {food.description}
      </p>

      {food.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {food.tags.slice(0, 3).map(tag => (
            <Badge
              key={tag}
              label={tag.replace(/_/g, ' ')}
              emoji={BENEFIT_EMOJI[tag]}
              variant="green"
            />
          ))}
        </div>
      )}

      <div className="text-xs text-green-main font-medium mt-auto">
        {food.synergies?.length || 0} synergie{(food.synergies?.length || 0) !== 1 ? 's' : ''} documentée{(food.synergies?.length || 0) !== 1 ? 's' : ''} →
      </div>
    </Link>
  )
}
