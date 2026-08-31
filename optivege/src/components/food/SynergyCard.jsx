import { Link } from 'react-router-dom'
import SourceCitation from '../ui/SourceCitation'
import DebateWarning from '../ui/DebateWarning'
import TermeLink from '../ui/TermeLink'

// Card de synergie alimentaire avec mécanisme et source scientifique
export default function SynergyCard({ synergie }) {
  if (!synergie || !synergie.aliment_associe_id) return null

  return (
    <div className="card border-l-4 border-l-green-main">
      <div className="flex items-start gap-3">
        <span className="text-3xl mt-0.5">{synergie.aliment_associe_emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <h4 className="font-semibold text-green-dark">
              <Link
                to={`/aliments/${synergie.aliment_associe_id}`}
                className="hover:text-green-mid transition-colors"
              >
                + {synergie.aliment_associe_nom}
              </Link>
            </h4>
            <span className="text-xs bg-green-pale text-green-dark px-2 py-0.5 rounded-full font-medium">
              {synergie.nutriment_cle}
            </span>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            <TermeLink>{synergie.mecanisme}</TermeLink>
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {synergie.gain_estime && (
              <span className="text-sm font-semibold text-orange-main">
                📈 {synergie.gain_estime}
              </span>
            )}
            {synergie.sources?.[0] && (
              <SourceCitation source={synergie.sources[0]} compact />
            )}
          </div>

          {synergie.sujet_a_debat && (
            <DebateWarning detail={synergie.debat_detail} sources={synergie.sources} />
          )}
        </div>
      </div>
    </div>
  )
}
