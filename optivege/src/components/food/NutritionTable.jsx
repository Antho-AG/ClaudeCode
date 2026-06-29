import { useState } from 'react'

// AJR de référence selon Anses 2021 pour les principales valeurs
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
  calories: 'Calories',
  proteines: 'Protéines',
  glucides: 'Glucides',
  lipides: 'Lipides',
  fibres: 'Fibres',
  fer: 'Fer',
  calcium: 'Calcium',
  vitamine_c: 'Vitamine C',
  folates: 'Folates (B9)',
  magnesium: 'Magnésium',
  zinc: 'Zinc',
  vitamine_e: 'Vitamine E',
  potassium: 'Potassium',
  omega3_ala: 'Oméga-3 ALA',
  vitamine_k: 'Vitamine K1',
  curcumine: 'Curcumine',
}

const PRIORITY = ['calories', 'proteines', 'glucides', 'lipides', 'fibres']

// Tableau nutritionnel avec % AJR et source de données
export default function NutritionTable({ teneurs }) {
  const [expanded, setExpanded] = useState(false)

  if (!teneurs) return null

  const { source_teneurs, ...values } = teneurs
  const priorityKeys = PRIORITY.filter(k => values[k])
  const otherKeys = Object.keys(values).filter(k => !PRIORITY.includes(k))

  const displayKeys = expanded ? [...priorityKeys, ...otherKeys] : priorityKeys

  const calcPercent = (key, valeur) => {
    if (!AJR[key] || typeof valeur !== 'number') return null
    return Math.round((valeur / AJR[key].valeur) * 100)
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-green-pale">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-bg">
              <th className="text-left px-4 py-2.5 font-semibold text-green-dark">Nutriment</th>
              <th className="text-right px-4 py-2.5 font-semibold text-green-dark">Valeur</th>
              <th className="text-right px-4 py-2.5 font-semibold text-green-dark hidden sm:table-cell">% AJR*</th>
            </tr>
          </thead>
          <tbody>
            {displayKeys.map((key, i) => {
              const item = values[key]
              if (!item || typeof item !== 'object') return null
              const pct = calcPercent(key, item.valeur)
              return (
                <>
                  <tr key={key} className={i % 2 === 0 ? 'bg-white' : 'bg-green-bg/40'}>
                    <td className="px-4 py-2 text-gray-700">{LABELS[key] || key}</td>
                    <td className="px-4 py-2 text-right font-medium text-gray-900">
                      {typeof item.valeur === 'number' ? item.valeur : item.valeur} {item.unite}
                    </td>
                    <td className="px-4 py-2 text-right hidden sm:table-cell">
                      {pct !== null ? (
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5">
                            <div
                              className="bg-green-main h-1.5 rounded-full"
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${pct >= 20 ? 'text-green-dark' : 'text-gray-500'}`}>
                            {pct}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                  {item.note && (
                    <tr key={`${key}-note`}>
                      <td colSpan={3} className="px-4 pb-3 pt-0">
                        <p
                          className="text-xs italic leading-relaxed rounded-lg px-3 py-2"
                          style={{ color: '#0F6E56', backgroundColor: '#0F6E5612' }}
                        >
                          ⚠️ {item.note}
                        </p>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      {otherKeys.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm text-green-dark font-medium hover:text-green-mid transition-colors"
        >
          {expanded ? '▲ Réduire' : `▼ Voir tous les micronutriments (${otherKeys.length} de plus)`}
        </button>
      )}

      {source_teneurs && (
        <p className="mt-2 text-xs text-gray-400">
          📊 Source : {source_teneurs} — *AJR selon Anses 2021 (adulte moyen)
        </p>
      )}
    </div>
  )
}
