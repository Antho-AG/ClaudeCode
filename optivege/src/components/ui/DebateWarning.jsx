import { useState } from 'react'
import SourceCitation from './SourceCitation'

// Badge et accordéon pour les résultats scientifiques sujets à débat
export default function DebateWarning({ detail, sources = [] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-dark text-xs font-medium hover:bg-orange-200 transition-colors"
      >
        ⚠️ Résultat sujet à débat — voir sources
        <span className="text-xs opacity-70">{open ? '▲' : '▼'}</span>
      </button>

      {open && detail && (
        <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-xl text-sm space-y-2">
          <p className="font-medium text-orange-dark">Ce point fait l'objet de débats dans la communauté scientifique</p>
          {detail.pour && (
            <div>
              <span className="font-semibold text-green-dark">✅ Arguments pour :</span>
              <p className="text-gray-700 mt-0.5">{detail.pour}</p>
            </div>
          )}
          {detail.contre && (
            <div>
              <span className="font-semibold text-orange-dark">⚠️ Points de prudence :</span>
              <p className="text-gray-700 mt-0.5">{detail.contre}</p>
            </div>
          )}
          {detail.recommandation && (
            <div className="pt-1 border-t border-orange-200">
              <span className="font-semibold text-gray-700">💡 Recommandation :</span>
              <p className="text-gray-700 mt-0.5">{detail.recommandation}</p>
            </div>
          )}
          {sources.length > 0 && (
            <div className="pt-1 flex flex-col gap-1">
              {sources.map((s, i) => <SourceCitation key={i} source={s} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
