import { Link } from 'react-router-dom'
import lexiqueData from '../../data/lexique.json'

// Construit une regex qui match tous les variants de tous les termes du lexique
// Triés par longueur décroissante pour éviter les matchs partiels (ex: "NF-κB" avant "NF")
const buildTermeMap = () => {
  const map = [] // [{regex, id}]
  for (const entry of lexiqueData) {
    for (const variant of entry.termes_variants) {
      map.push({ variant, id: entry.id })
    }
  }
  // Du plus long au plus court pour éviter les sous-matchs
  map.sort((a, b) => b.variant.length - a.variant.length)
  return map
}

const TERME_MAP = buildTermeMap()

const ESCAPED = TERME_MAP.map(({ variant, id }) => ({
  // Lookbehind/lookahead Unicode-aware : refuse les lettres/chiffres accentués adjacents
  regex: new RegExp(
    `(?<![a-zA-ZÀ-ÿ0-9])(${variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?![a-zA-ZÀ-ÿ0-9])`,
    'gi'
  ),
  id,
}))

// Parse un texte et retourne un tableau [string | ReactElement]
function parseText(text) {
  if (!text || typeof text !== 'string') return [text]

  let parts = [text]

  for (const { regex, id } of ESCAPED) {
    const next = []
    for (const part of parts) {
      if (typeof part !== 'string') {
        next.push(part)
        continue
      }
      const split = part.split(regex)
      for (let i = 0; i < split.length; i++) {
        if (split[i] === '') continue
        if (i % 2 === 1) {
          next.push(
            <Link
              key={`${id}-${i}-${split[i]}`}
              to={`/lexique#${id}`}
              className="terme-link"
              title="Voir la définition dans le lexique"
              onClick={e => e.stopPropagation()}
            >
              {split[i]}
            </Link>
          )
        } else {
          next.push(split[i])
        }
      }
    }
    parts = next
  }

  return parts
}

export default function TermeLink({ children }) {
  if (!children || typeof children !== 'string') return children
  const parsed = parseText(children)
  return <>{parsed}</>
}
