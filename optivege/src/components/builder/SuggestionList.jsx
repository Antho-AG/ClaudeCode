import { useState } from 'react'

function comboLabel(count) {
  if (count >= 3) return '💥 Triple synergie'
  if (count >= 2) return '🔥 Double synergie'
  return null
}

function SuggestionCard({ candidate, onPick }) {
  const [imgErr, setImgErr] = useState(false)
  const { food, count, synLinks, level } = candidate
  const combo = comboLabel(count)
  const firstSyn = synLinks[0]?.syn

  return (
    <button
      onClick={() => onPick(food)}
      className="card text-left w-full transition-all duration-200 flex items-start gap-3 relative overflow-hidden"
      style={{ border: combo ? '2px solid #E76F51' : '2px solid transparent' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {combo && (
        <span className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: '#E76F51', color: 'white', fontFamily: 'Inter, sans-serif' }}>
          {combo}
        </span>
      )}

      {/* Icon */}
      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
        {!imgErr ? (
          <img
            src={`/icons/${food.id}.svg`}
            alt={food.nom}
            width={40} height={40}
            style={{ objectFit: 'contain' }}
            onError={() => setImgErr(true)}
          />
        ) : (
          <span className="text-2xl">{food.emoji}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-green-dark text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
          {food.nom}
        </p>
        {firstSyn ? (
          <p className="text-xs text-gray-500 mt-0.5 leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>
            🔗 {firstSyn.nutriment_cle}
            {firstSyn.gain_estime && (
              <span className="ml-1 text-green-main font-medium">· {firstSyn.gain_estime}</span>
            )}
          </p>
        ) : level === 2 ? (
          <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
            🧩 Complément nutritionnel
          </p>
        ) : level === 3 ? (
          <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
            🌿 Diversité de l'assiette
          </p>
        ) : null}
        {count > 1 && (
          <p className="text-xs mt-1" style={{ color: '#E76F51', fontFamily: 'Inter, sans-serif' }}>
            Synergie avec {[...new Set(synLinks.map(l => l.fromFood.nom))].join(' & ')}
          </p>
        )}
      </div>

      <span className="text-green-main text-lg flex-shrink-0 self-center">+</span>
    </button>
  )
}

export default function SuggestionList({ suggestions, onPick, stepNumber, canFinish, onFinalize, maxReached }) {
  // Only show "no more suggestions" if we have 5+ ingredients AND all fallbacks are exhausted
  if (suggestions.length === 0 && (maxReached || stepNumber >= 5)) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
        Aucune suggestion supplémentaire — votre assiette est déjà très synergique !
        {canFinish && (
          <button onClick={onFinalize} className="btn-primary block mx-auto mt-4">
            Voir ma création →
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-heading text-xl text-green-dark">Enrichir l'assiette</h2>
          <p className="text-sm text-gray-500 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
            Ces aliments créent des synergies avec ce que vous avez déjà choisi
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#E8F7F2', color: '#0F6E56', fontFamily: 'Inter, sans-serif' }}>
          Étape {stepNumber + 1}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {suggestions.map(c => (
          <SuggestionCard key={c.food.id} candidate={c} onPick={onPick} />
        ))}
      </div>

      {canFinish && (
        <button
          onClick={onFinalize}
          className="w-full py-3 rounded-xl text-sm font-semibold border-2 transition-colors"
          style={{ borderColor: '#1D9E75', color: '#0F6E56', fontFamily: 'Inter, sans-serif', background: 'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#E8F7F2' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          Je n'ajoute rien de plus → Voir ma création ✨
        </button>
      )}
    </div>
  )
}
