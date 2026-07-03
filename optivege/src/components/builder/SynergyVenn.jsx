// Colour theme per key nutrient
const NUTRIENT_THEME = {
  vitamine_c:    { bg: '#FFF4EC', border: '#F97316' },
  fer:           { bg: '#E8F7F2', border: '#1D9E75' },
  calcium:       { bg: '#EFF6FF', border: '#3B82F6' },
  vitamine_d:    { bg: '#EFF6FF', border: '#3B82F6' },
  omega3:        { bg: '#F0FDF4', border: '#22C55E' },
  antioxydants:  { bg: '#FAF5FF', border: '#A855F7' },
  anthocyanes:   { bg: '#FAF5FF', border: '#A855F7' },
  proteines:     { bg: '#FFF7ED', border: '#F97316' },
  zinc:          { bg: '#FFFBEB', border: '#EAB308' },
  magnesium:     { bg: '#F0FDF4', border: '#22C55E' },
  curcumine:     { bg: '#FFFBEB', border: '#EAB308' },
  default:       { bg: '#F9FAFB', border: '#6B7280' },
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

// Extract a short "key value" from the gain_estime string
// e.g. "+2 à +3x" → "×2–3", "+2000%" → "+2000%", "Profil complet" → null
function extractKeyValue(gain) {
  if (!gain) return null

  // "×N à ×M", "xN à xM", "+N à +Mx", "xN à xM"
  const absorbMatch = gain.match(/[+×x](\d[\d,.]*)\s*(?:à|a|-)\s*[+×x]?(\d[\d,.]*)\s*[x×%]?/i)
  if (absorbMatch) {
    const a = absorbMatch[1].replace(',', '.')
    const b = absorbMatch[2].replace(',', '.')
    // Detect if it's a multiplier or percent
    const hasPercent = gain.includes('%')
    const hasMult = /[×x]/i.test(gain)
    if (hasMult && !hasPercent) return `×${a}–${b}`
    return `+${a}–${b}%`
  }

  // Single "+N%" or "+N%"
  const pctMatch = gain.match(/\+(\d[\d,.]*)\s*%/)
  if (pctMatch) return `+${pctMatch[1]}%`

  // Single "×N" or "xN"
  const multMatch = gain.match(/[×x](\d[\d,.]*)/i)
  if (multMatch) return `×${multMatch[1]}`

  // "+N à +M x" pattern (written in reverse)
  const altMatch = gain.match(/\+(\d[\d,.]*)(?:\s*à\s*\+(\d[\d,.]*))?/)
  if (altMatch && altMatch[2]) return `+${altMatch[1]}–${altMatch[2]}`
  if (altMatch) return `+${altMatch[1]}`

  return null
}

function FoodCircle({ food, theme, side }) {
  const isLeft = side === 'left'
  return (
    <div
      style={{
        width: 110,
        height: 110,
        borderRadius: '50%',
        background: isLeft ? '#E8F7F2' : theme.bg,
        border: `2px solid ${isLeft ? '#1D9E75' : theme.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        flexShrink: 0,
        position: 'relative',
        zIndex: isLeft ? 2 : 1,
        marginRight: isLeft ? -32 : 0,
        marginLeft: isLeft ? 0 : -32,
      }}
    >
      <span style={{ fontSize: 26, lineHeight: 1 }}>{food.emoji}</span>
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        color: '#0F6E56',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
        lineHeight: 1.2,
        maxWidth: 80,
        wordBreak: 'break-word',
      }}>
        {food.nom}
      </span>
    </div>
  )
}

export default function SynergyVenn({ synergy, isCombo }) {
  const { foodA, foodB, syn } = synergy
  const theme = resolveTheme(syn.nutriment_cle)
  const keyValue = extractKeyValue(syn.gain_estime)

  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: '16px 14px 14px',
      boxShadow: '0 2px 12px rgba(15,110,86,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#1D9E75',
          fontFamily: 'Inter, sans-serif',
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
            fontFamily: 'Inter, sans-serif',
          }}>
            🔥 Double synergie
          </span>
        )}
      </div>

      {/* Venn diagram */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <FoodCircle food={foodA} theme={theme} side="left" />

        {/* Intersection badge */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'white',
          boxShadow: '0 2px 8px rgba(15,110,86,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {keyValue ? (
            <span style={{
              fontSize: keyValue.length > 5 ? 9 : 11,
              fontWeight: 800,
              color: '#0F6E56',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
              lineHeight: 1.1,
              padding: '0 2px',
            }}>
              {keyValue}
            </span>
          ) : (
            <span style={{ fontSize: 18 }}>✨</span>
          )}
        </div>

        <FoodCircle food={foodB} theme={theme} side="right" />
      </div>

      {/* Nutriment label */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#0F6E56',
          fontFamily: 'Inter, sans-serif',
          margin: 0,
        }}>
          {syn.nutriment_cle}
        </p>
        {syn.gain_estime && (
          <p style={{
            fontSize: 10,
            color: '#6B7280',
            fontStyle: 'italic',
            fontFamily: 'Inter, sans-serif',
            margin: '2px 0 0',
          }}>
            {syn.gain_estime}
          </p>
        )}
      </div>
    </div>
  )
}
