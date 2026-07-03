const NUTRIENT_THEME = {
  vitamine_c:   { bg: '#FFF4EC', border: '#F97316' },
  fer:          { bg: '#E8F7F2', border: '#1D9E75' },
  calcium:      { bg: '#EFF6FF', border: '#3B82F6' },
  vitamine_d:   { bg: '#EFF6FF', border: '#3B82F6' },
  omega3:       { bg: '#F0FDF4', border: '#22C55E' },
  antioxydants: { bg: '#FAF5FF', border: '#A855F7' },
  anthocyanes:  { bg: '#FAF5FF', border: '#A855F7' },
  proteines:    { bg: '#FFF7ED', border: '#F97316' },
  zinc:         { bg: '#FFFBEB', border: '#EAB308' },
  magnesium:    { bg: '#F0FDF4', border: '#22C55E' },
  curcumine:    { bg: '#FFFBEB', border: '#EAB308' },
  default:      { bg: '#F9FAFB', border: '#6B7280' },
}

const NUTRIENT_KEYWORDS = [
  ['vitamine c', 'vitamine_c'],
  ['fer',        'fer'],
  ['calcium',    'calcium'],
  ['vitamine d', 'vitamine_d'],
  ['omega',      'omega3'],
  ['oméga',      'omega3'],
  ['ala',        'omega3'],
  ['anthocyan',  'anthocyanes'],
  ['antioxyd',   'antioxydants'],
  ['protéin',    'proteines'],
  ['zinc',       'zinc'],
  ['magnésium',  'magnesium'],
  ['curcumin',   'curcumine'],
]

function resolveTheme(nutrimentCle) {
  const lower = nutrimentCle.toLowerCase()
  for (const [kw, id] of NUTRIENT_KEYWORDS) {
    if (lower.includes(kw)) return NUTRIENT_THEME[id] ?? NUTRIENT_THEME.default
  }
  return NUTRIENT_THEME.default
}

function extractKeyValue(gain) {
  if (!gain) return null
  const rangeMatch = gain.match(/[+×x](\d[\d,.]*)\s*(?:à|a|-)\s*[+×x]?(\d[\d,.]*)\s*[x×%]?/i)
  if (rangeMatch) {
    const a = rangeMatch[1].replace(',', '.')
    const b = rangeMatch[2].replace(',', '.')
    const hasMult = /[×x]/i.test(gain) && !gain.includes('%')
    return hasMult ? `×${a}–${b}` : `+${a}–${b}%`
  }
  const pctMatch = gain.match(/\+(\d[\d,.]*)\s*%/)
  if (pctMatch) return `+${pctMatch[1]}%`
  const multMatch = gain.match(/[×x](\d[\d,.]*)/i)
  if (multMatch) return `×${multMatch[1]}`
  const altMatch = gain.match(/\+(\d[\d,.]*)(?:\s*à\s*\+(\d[\d,.]*))?/)
  if (altMatch && altMatch[2]) return `+${altMatch[1]}–${altMatch[2]}`
  if (altMatch) return `+${altMatch[1]}`
  return null
}

// Circle diameter — enlarged for long food names
const D = 130          // px — diameter of each circle
const OVERLAP = D * 0.25  // 25% overlap

export default function SynergyVenn({ synergy, isCombo }) {
  const { foodA, foodB, syn } = synergy
  const theme = resolveTheme(syn.nutriment_cle)
  const keyValue = extractKeyValue(syn.gain_estime)

  // Total width of the Venn row: two circles minus overlap
  const vennWidth = D * 2 - OVERLAP

  return (
    <div style={{
      width: '100%',
      maxWidth: 320,
      background: 'white',
      borderRadius: 16,
      padding: '14px 14px 16px',
      boxShadow: '0 2px 12px rgba(15,110,86,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#1D9E75',
        }}>
          ✦ Synergie active
        </span>
        {isCombo && (
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            background: '#E76F51',
            color: 'white',
            borderRadius: 99,
            padding: '2px 8px',
          }}>
            🔥 Double synergie
          </span>
        )}
      </div>

      {/* Venn diagram */}
      <div style={{
        position: 'relative',
        width: vennWidth,
        height: D,
        margin: '0 auto',
        flexShrink: 0,
      }}>
        {/* Left circle — aliment A */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: D,
          height: D,
          borderRadius: '50%',
          background: '#E8F7F2',
          border: '2px solid #1D9E75',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          zIndex: 2,
          boxSizing: 'border-box',
        }}>
          <span style={{ fontSize: 24, lineHeight: 1 }}>{foodA.emoji}</span>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#0F6E56',
            textAlign: 'center',
            lineHeight: 1.3,
            maxWidth: D * 0.68,
            wordBreak: 'break-word',
            overflow: 'visible',
          }}>
            {foodA.nom}
          </span>
        </div>

        {/* Right circle — aliment B */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: D,
          height: D,
          borderRadius: '50%',
          background: theme.bg,
          border: `2px solid ${theme.border}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          zIndex: 1,
          boxSizing: 'border-box',
        }}>
          <span style={{ fontSize: 24, lineHeight: 1 }}>{foodB.emoji}</span>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#0F6E56',
            textAlign: 'center',
            lineHeight: 1.3,
            maxWidth: D * 0.68,
            wordBreak: 'break-word',
            overflow: 'visible',
          }}>
            {foodB.nom}
          </span>
        </div>

        {/* Intersection badge — centered on the overlap point */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 2px 10px rgba(15,110,86,0.22)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {keyValue ? (
            <span style={{
              fontSize: keyValue.length > 6 ? 8 : keyValue.length > 4 ? 10 : 12,
              fontWeight: 800,
              color: '#0F6E56',
              textAlign: 'center',
              lineHeight: 1.1,
              padding: '0 3px',
            }}>
              {keyValue}
            </span>
          ) : (
            <span style={{ fontSize: 20 }}>✨</span>
          )}
        </div>
      </div>

      {/* Names + benefit below the Venn */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#0F6E56',
          margin: 0,
          lineHeight: 1.4,
        }}>
          {foodA.nom} + {foodB.nom}
        </p>
        {syn.gain_estime && (
          <p style={{
            fontSize: 11,
            color: '#6B7280',
            fontStyle: 'italic',
            margin: '3px 0 0',
            lineHeight: 1.4,
          }}>
            {syn.gain_estime}
          </p>
        )}
      </div>
    </div>
  )
}
