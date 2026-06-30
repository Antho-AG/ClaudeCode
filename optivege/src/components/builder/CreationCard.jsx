import { scoreBadge } from '../../hooks/useSynergyBuilder'

export default function CreationCard({ chosenFoods, activeSynergies, score, onReset, onAddToPlanner, onCopy }) {
  const badge = scoreBadge(score)
  const combos = activeSynergies.filter(s => {
    // A combo = one food is synergistic with 2+ others
    const aLinks = activeSynergies.filter(x => x.foodA.id === s.foodA.id || x.foodB.id === s.foodA.id)
    return aLinks.length >= 3
  })

  async function handleCopy() {
    await onCopy()
    // Brief visual feedback — simplest approach
    const btn = document.getElementById('copy-btn')
    if (btn) { btn.textContent = '✓ Copié !'; setTimeout(() => { btn.textContent = '📋 Copier ma création' }, 2000) }
  }

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="card text-center py-8"
        style={{ background: 'linear-gradient(135deg, #0F6E56 0%, #1D9E75 100%)' }}>
        <div className="text-5xl mb-3">🌿</div>
        <h2 className="font-heading text-2xl text-white mb-1">Mon assiette synergie</h2>
        {badge && (
          <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-3"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontFamily: 'Inter, sans-serif' }}>
            {badge}
          </span>
        )}
        <div className="text-white/80 text-4xl font-bold" style={{ fontFamily: 'DM Serif Display, Georgia, serif' }}>
          {score}<span className="text-lg text-white/60">/100</span>
        </div>
        <div className="ajr-bar-track mt-3 mx-auto max-w-xs" style={{ height: '6px', background: 'rgba(255,255,255,0.2)' }}>
          <div style={{ width: `${score}%`, height: '6px', borderRadius: '99px', background: 'white', transition: 'width 800ms ease' }} />
        </div>
      </div>

      {/* Ingredients */}
      <div className="card">
        <h3 className="font-heading text-lg text-green-dark mb-3">Ingrédients choisis</h3>
        <div className="flex flex-wrap gap-2">
          {chosenFoods.map(f => (
            <span key={f.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ background: '#E8F7F2', color: '#0F6E56', fontFamily: 'Inter, sans-serif' }}>
              {f.emoji} {f.nom}
            </span>
          ))}
        </div>
      </div>

      {/* Active synergies */}
      {activeSynergies.length > 0 && (
        <div className="card">
          <h3 className="font-heading text-lg text-green-dark mb-3">
            Synergies actives <span className="text-green-main text-base">({activeSynergies.length})</span>
          </h3>
          <div className="space-y-3">
            {activeSynergies.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#F5FBF8' }}>
                <div className="flex items-center gap-1 text-sm flex-shrink-0 font-medium text-green-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span>{s.foodA.emoji}</span>
                  <span>+</span>
                  <span>{s.foodB.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {s.foodA.nom} + {s.foodB.nom}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    → {s.syn.nutriment_cle}
                    {s.syn.gain_estime && <span className="text-green-main font-medium ml-1">· {s.syn.gain_estime}</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Combo bonus */}
      {combos.length > 0 && (
        <div className="card" style={{ border: '2px solid #E76F51', background: '#FFF8F5' }}>
          <h3 className="font-heading text-lg mb-2" style={{ color: '#C85A3C' }}>✨ Combo bonus</h3>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Certains aliments de votre assiette créent une synergie en réseau — chaque ingrédient amplifie les autres !
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={onAddToPlanner}
          className="btn-primary flex items-center justify-center gap-2 py-3"
        >
          📅 Ajouter au planificateur
        </button>
        <button
          id="copy-btn"
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-colors"
          style={{ borderColor: '#1D9E75', color: '#0F6E56', background: 'white', fontFamily: 'Inter, sans-serif' }}
        >
          📋 Copier ma création
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-colors"
          style={{ borderColor: '#D1D5DB', color: '#6B7280', background: 'white', fontFamily: 'Inter, sans-serif' }}
        >
          🔄 Recommencer
        </button>
      </div>
    </div>
  )
}
