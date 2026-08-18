import { useState } from 'react'

const AJR = {
  calories: { valeur: 2000, unite: 'kcal' },
  proteines: { valeur: 50, unite: 'g' },
  glucides: { valeur: 260, unite: 'g' },
  lipides: { valeur: 70, unite: 'g' },
  fibres: { valeur: 30, unite: 'g' },
  fer: { valeur: 14, unite: 'mg' },
  calcium: { valeur: 950, unite: 'mg' },
  vitamine_c: { valeur: 110, unite: 'mg' },
  folates: { valeur: 330, unite: 'µg' },
  magnesium: { valeur: 375, unite: 'mg' },
  zinc: { valeur: 10, unite: 'mg' },
  vitamine_e: { valeur: 12, unite: 'mg' },
  potassium: { valeur: 2000, unite: 'mg' },
}

const LABELS = {
  calories: 'Calories', proteines: 'Protéines', glucides: 'Glucides',
  lipides: 'Lipides', fibres: 'Fibres', fer: 'Fer', calcium: 'Calcium',
  vitamine_c: 'Vitamine C', folates: 'Folates (B9)', magnesium: 'Magnésium',
  zinc: 'Zinc', vitamine_e: 'Vitamine E', potassium: 'Potassium',
  omega3_ala: 'Oméga-3 ALA', vitamine_k: 'Vitamine K1', curcumine: 'Curcumine',
}

const PRIORITY = ['calories', 'proteines', 'glucides', 'lipides', 'fibres']

function barColor(pct) {
  if (pct >= 100) return '#0F6E56'
  if (pct >= 20) return '#1D9E75'
  return '#A8D5C2'
}

export default function NutritionTable({ teneurs, portionUsuelle }) {
  const [expanded, setExpanded] = useState(false)

  if (!teneurs) return null

  const { source_teneurs, ...values } = teneurs
  const portionRatio = portionUsuelle ? portionUsuelle.grammes / 100 : null
  const priorityKeys = PRIORITY.filter(k => values[k])
  const otherKeys = Object.keys(values).filter(k => !PRIORITY.includes(k))
  const displayKeys = expanded ? [...priorityKeys, ...otherKeys] : priorityKeys

  const calcPercent = (key, valeur) => {
    if (!AJR[key] || typeof valeur !== 'number') return null
    return Math.round((valeur / AJR[key].valeur) * 100)
  }

  return (
    <div>
      <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(15,110,86,0.08), 0 1px 3px rgba(0,0,0,0.04)' }}>
        {/* En-tête */}
        <div className="flex justify-between items-center px-5 py-3" style={{ background: 'linear-gradient(135deg, #E8F7F2 0%, #F5FBF8 100%)' }}>
          <span className="text-xs font-semibold uppercase tracking-widest text-green-dark" style={{ fontFamily: 'Inter, sans-serif' }}>Nutriment</span>
          <div className="flex gap-4 items-baseline">
            {portionUsuelle && (
              <span className="text-xs font-semibold text-orange-500" style={{ fontFamily: 'Inter, sans-serif' }}>{portionUsuelle.label}</span>
            )}
            <span className="text-xs font-semibold uppercase tracking-widest text-green-dark" style={{ fontFamily: 'Inter, sans-serif' }}>Pour 100g · % AJR*</span>
          </div>
        </div>

        {/* Lignes */}
        <div className="bg-white divide-y divide-gray-50">
          {displayKeys.map((key) => {
            const item = values[key]
            if (!item || typeof item !== 'object') return null
            const pct = calcPercent(key, item.valeur)
            const fillPct = pct !== null ? Math.min(pct, 100) : null

            return (
              <div key={key}>
                <div className="px-5 py-3">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {LABELS[key] || key}
                    </span>
                    <div className="flex items-baseline gap-3 ml-4">
                      {portionRatio !== null && typeof item.valeur === 'number' && (
                        <span className="text-xs font-medium text-orange-500 whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {Math.round(item.valeur * portionRatio * 10) / 10} {item.unite}
                          {pct !== null && (
                            <span className="ml-1 text-orange-400">({Math.round(pct * portionRatio)}%)</span>
                          )}
                        </span>
                      )}
                      <span className="text-sm font-medium text-gray-900 whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {typeof item.valeur === 'number' ? item.valeur : item.valeur} {item.unite}
                        {pct !== null && (
                          <span className="ml-2 text-xs font-semibold" style={{ color: barColor(pct) }}>
                            · {pct}%
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  {fillPct !== null && (
                    <div className="ajr-bar-track">
                      <div
                        className="ajr-bar-fill"
                        style={{ width: `${fillPct}%`, background: barColor(pct) }}
                      />
                    </div>
                  )}
                </div>
                {item.note && (
                  <div className="px-5 pb-3 -mt-1">
                    <p className="text-xs italic leading-relaxed rounded-lg px-3 py-2" style={{ color: '#0F6E56', backgroundColor: '#0F6E5612', fontFamily: 'Inter, sans-serif' }}>
                      ⚠️ {item.note}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {otherKeys.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-green-dark font-medium hover:text-green-mid transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {expanded ? '▲ Réduire' : `▼ Voir tous les micronutriments (${otherKeys.length} de plus)`}
        </button>
      )}

      {source_teneurs && (
        <p className="mt-2 text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
          📊 Source : {source_teneurs} — *AJR selon Anses 2021 (adulte moyen)
        </p>
      )}
      {portionUsuelle && (
        <p className="mt-1 text-xs text-gray-400 italic" style={{ fontFamily: 'Inter, sans-serif' }}>
          ℹ️ Les %AJR pour 100g sont une référence scientifique standard (CIQUAL). Cet aliment étant consommé en petite quantité, les valeurs pour {portionUsuelle.label} ({portionUsuelle.grammes}g) sont affichées en orange à titre indicatif.
        </p>
      )}
    </div>
  )
}
