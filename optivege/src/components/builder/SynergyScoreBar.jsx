import { scoreBadge } from '../../hooks/useSynergyBuilder'

export default function SynergyScoreBar({ score, activeSynergies, chosenFoods }) {
  const badge = scoreBadge(score)

  if (chosenFoods.length === 0) return null

  return (
    <div className="card mb-6" style={{ background: 'linear-gradient(135deg, #E8F7F2 0%, #F5FBF8 100%)', boxShadow: 'none', border: '1px solid #D1EDE5' }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-sm font-semibold text-green-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
            Score synergie
          </span>
          {badge && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: '#1D9E75', color: 'white', fontFamily: 'Inter, sans-serif' }}>
              {badge}
            </span>
          )}
        </div>
        <span className="text-lg font-bold text-green-dark" style={{ fontFamily: 'DM Serif Display, Georgia, serif' }}>
          {score}<span className="text-sm text-gray-400 font-normal">/100</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="ajr-bar-track mb-2" style={{ height: '8px' }}>
        <div
          className="ajr-bar-fill"
          style={{ width: `${score}%`, background: score >= 60 ? '#0F6E56' : '#1D9E75', height: '8px', transition: 'width 600ms ease' }}
        />
      </div>

      {/* Chosen ingredients pills */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {chosenFoods.map(f => (
          <span key={f.id} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
            style={{ background: 'white', color: '#0F6E56', border: '1px solid #D1EDE5', fontFamily: 'Inter, sans-serif' }}>
            <span>{f.emoji}</span> {f.nom}
          </span>
        ))}
      </div>

      {activeSynergies.length > 0 && (
        <p className="text-xs text-green-main mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          ✨ {activeSynergies.length} synergie{activeSynergies.length > 1 ? 's' : ''} active{activeSynergies.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
