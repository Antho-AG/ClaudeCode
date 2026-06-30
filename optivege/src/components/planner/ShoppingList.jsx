import { useRef } from 'react'

function formatLine(item) {
  if (item.amount !== null && item.amountDisplay) {
    return `${item.amountDisplay}${item.unit ? ' ' + item.unit : ''} ${item.nom}`
  }
  return item.raw ? `${item.raw} ${item.nom}` : item.nom
}

function buildTextList(groups, nbRepas, nbPersonnes) {
  const header = `🛒 Ma liste de courses OptiVégé (${nbRepas} repas, ${nbPersonnes} personne${nbPersonnes > 1 ? 's' : ''})\n`
  const lines = groups.map(g => {
    const items = g.items.map(item => `- ${formatLine(item)}`).join('\n')
    return `\n${g.category}\n${items}`
  })
  return header + lines.join('\n')
}

export default function ShoppingList({ groups, totalItems, checkedItems, onToggle, nbRepas, nbPersonnes }) {
  const printRef = useRef(null)

  const isEmpty = groups.length === 0

  async function handleCopy() {
    const text = buildTextList(groups, nbRepas, nbPersonnes)
    try {
      await navigator.clipboard.writeText(text)
      alert('Liste copiée !')
    } catch {
      // fallback
    }
  }

  async function handleShare() {
    const text = buildTextList(groups, nbRepas, nbPersonnes)
    try {
      await navigator.share({ title: 'Ma liste OptiVégé', text })
    } catch {}
  }

  function handlePrint() {
    window.print()
  }

  const canShare = typeof navigator !== 'undefined' && !!navigator.share

  return (
    <div>
      {/* Print styles — injected inline to avoid a separate CSS file */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #shopping-print { display: block !important; position: static !important; }
          #shopping-print .no-print { display: none !important; }
        }
        @media screen { #shopping-print { } }
      `}</style>

      <div id="shopping-print" ref={printRef}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-lg text-green-dark">🛒 Liste de courses</h3>
            {!isEmpty && (
              <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                {totalItems} article{totalItems > 1 ? 's' : ''} · {nbPersonnes} personne{nbPersonnes > 1 ? 's' : ''}
              </p>
            )}
          </div>
          {!isEmpty && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: '#E8F7F2', color: '#0F6E56', fontFamily: 'Inter, sans-serif' }}>
              {Object.values(checkedItems).filter(Boolean).length}/{totalItems} cochés
            </span>
          )}
        </div>

        {isEmpty ? (
          <div className="text-center py-10 text-gray-400 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            Sélectionnez des recettes pour générer votre liste de courses
          </div>
        ) : (
          <div className="space-y-5">
            {groups.map(group => (
              <div key={group.category}>
                <p className="text-xs font-semibold uppercase tracking-widest text-green-dark mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {group.category}
                </p>
                <div className="space-y-1.5">
                  {group.items.map((item, i) => {
                    const key = `${group.category}||${i}`
                    const checked = !!checkedItems[key]
                    return (
                      <label
                        key={key}
                        className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-xl hover:bg-green-bg/50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggle(key)}
                          className="w-4 h-4 rounded accent-green-main flex-shrink-0"
                        />
                        <span
                          className={`text-sm flex-1 transition-colors ${checked ? 'line-through text-gray-400' : 'text-gray-700'}`}
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {item.amount !== null && item.amountDisplay && (
                            <span className="font-semibold text-green-dark mr-1">
                              {item.amountDisplay}{item.unit ? ' ' + item.unit : ''}
                            </span>
                          )}
                          {item.nom}
                          {item.amount === null && item.raw && item.raw !== item.nom && (
                            <span className="text-gray-400 ml-1 text-xs">({item.raw})</span>
                          )}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Export buttons */}
        {!isEmpty && (
          <div className="no-print mt-6 flex flex-col gap-2 pt-4 border-t border-green-pale">
            <button
              onClick={handleCopy}
              className="w-full text-sm font-medium py-2.5 rounded-xl border border-green-pale text-green-dark hover:bg-green-bg transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              📋 Copier la liste
            </button>
            {canShare && (
              <button
                onClick={handleShare}
                className="w-full text-sm font-medium py-2.5 rounded-xl border border-green-pale text-green-dark hover:bg-green-bg transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                📱 Partager
              </button>
            )}
            <button
              onClick={handlePrint}
              className="w-full text-sm font-medium py-2.5 rounded-xl border border-green-pale text-green-dark hover:bg-green-bg transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              🖨️ Télécharger PDF
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
