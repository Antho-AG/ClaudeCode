function Stepper({ label, value, min, max, onChange }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-semibold uppercase tracking-widest text-green-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
        {label}
      </span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
          style={{ background: value <= min ? '#E8F7F2' : '#1D9E75', color: value <= min ? '#A8D5C2' : 'white' }}
        >
          −
        </button>
        <span className="text-2xl font-bold text-green-dark w-8 text-center" style={{ fontFamily: 'DM Serif Display, Georgia, serif' }}>
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
          style={{ background: value >= max ? '#E8F7F2' : '#1D9E75', color: value >= max ? '#A8D5C2' : 'white' }}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default function PlannerParams({ nbRepas, setNbRepas, nbPersonnes, setNbPersonnes, mode, setMode }) {
  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, #E8F7F2 0%, #F5FBF8 100%)', boxShadow: 'none', border: '1px solid #D1EDE5' }}>
      <div className="flex flex-wrap items-center justify-between gap-6">
        {/* Steppers */}
        <div className="flex items-center gap-8">
          <Stepper label="Repas à planifier" value={nbRepas} min={1} max={14} onChange={setNbRepas} />
          <Stepper label="Personnes" value={nbPersonnes} min={1} max={8} onChange={setNbPersonnes} />
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl overflow-hidden border border-green-pale">
          {['auto', 'manual'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-4 py-2 text-sm font-medium transition-colors"
              style={{
                fontFamily: 'Inter, sans-serif',
                background: mode === m ? '#1D9E75' : 'white',
                color: mode === m ? 'white' : '#2D6A4F',
              }}
            >
              {m === 'auto' ? '⚡ Sélection auto' : '🔍 Je choisis'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
