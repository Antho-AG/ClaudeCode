import { forwardRef } from 'react'

const CATEGORY_BG = {
  'légume-feuille':         '#E8F5E9',
  'légume':                 '#F1F8E9',
  'légumineuse':            '#FFF8E1',
  'légumineuse transformée':'#FFF3E0',
  'pseudo-céréale':         '#E8EAF6',
  'céréale':                '#EDE7F6',
  'oléagineux':             '#FFF9C4',
  'graine':                 '#F9FBE7',
  'fruit':                  '#FCE4EC',
  'algue':                  '#E0F7FA',
  'épice':                  '#FBE9E7',
  'champignon':             '#EFEBE9',
  'boisson':                '#E8F5E9',
  'autre':                  '#F3E5F5',
}

const AJR = {
  calories: 2000, proteines: 50, glucides: 260, lipides: 70,
  fibres: 30, fer: 14, calcium: 950, vitamine_c: 110,
  folates: 330, magnesium: 375, zinc: 10, potassium: 2000,
}

const NUTRIMENT_LABELS = {
  fer: 'Fer', calcium: 'Calcium', proteines: 'Protéines',
  fibres: 'Fibres', vitamine_c: 'Vitamine C', folates: 'Folates (B9)',
  magnesium: 'Magnésium', zinc: 'Zinc', potassium: 'Potassium',
  omega3_ala: 'Oméga-3 ALA', vitamine_k: 'Vitamine K1',
}

function getTopNutriments(teneurs, n = 3) {
  if (!teneurs) return []
  const { source_teneurs, calories, glucides, lipides, ...rest } = teneurs
  return Object.entries(rest)
    .filter(([key, item]) => item && typeof item.valeur === 'number' && AJR[key])
    .map(([key, item]) => ({
      key,
      label: NUTRIMENT_LABELS[key] || key,
      valeur: item.valeur,
      unite: item.unite,
      pct: Math.round((item.valeur / AJR[key]) * 100),
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, n)
}

// Coupe au premier "." trouvé ; sinon à 100 chars sans couper un mot
function truncateAtSentence(text) {
  if (!text) return ''
  const dot = text.indexOf('.')
  if (dot !== -1) return text.slice(0, dot + 1)
  if (text.length <= 100) return text
  const cut = text.lastIndexOf(' ', 100)
  return text.slice(0, cut > 0 ? cut : 100) + '…'
}

const CATEGORY_PLAT = {
  'légume-feuille': 'salade', 'légume': 'poêlée', 'légumineuse': 'bowl',
  'légumineuse transformée': 'plat chaud', 'pseudo-céréale': 'bowl',
  'céréale': 'porridge', 'oléagineux': 'encas', 'graine': 'salade',
  'fruit': 'smoothie', 'algue': 'soupe miso', 'épice': 'curry',
  'champignon': 'poêlée', 'boisson': 'infusion', 'autre': 'préparation',
}

function buildConseil(food, synergie) {
  const plat = CATEGORY_PLAT[food.categorie] || 'plat'
  return `Idéal dans un${plat.startsWith('a') || plat.startsWith('i') ? "'" : 'e '} ${plat} avec ${synergie.aliment_associe_nom.toLowerCase()} ${synergie.aliment_associe_emoji} frais.`
}

const AlimentShareCard = forwardRef(function AlimentShareCard({ food }, ref) {
  if (!food) return null

  const bg = CATEGORY_BG[food.categorie] || '#F0FBF6'
  const topNutriments = getTopNutriments(food.teneurs)
  const synergie = food.synergies?.[0]

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 0,
        width: '1080px',
        height: '1350px',
        backgroundColor: bg,
        fontFamily: 'Georgia, serif',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Bandes décoratives */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '10px', backgroundColor: '#1D9E75' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '10px', backgroundColor: '#1D9E75' }} />

      {/* Footer ancré en bas */}
      <div style={{
        position: 'absolute', bottom: '24px', left: 0, right: 0,
        textAlign: 'center', padding: '0 76px',
      }}>
        <div style={{ height: '2px', backgroundColor: '#1D9E75', opacity: 0.3, marginBottom: '16px' }} />
        <div style={{
          fontSize: '22px', fontFamily: 'Arial, sans-serif', fontWeight: '800',
          color: '#0F6E56', letterSpacing: '6px', textTransform: 'uppercase',
        }}>
          OPTIVEGE.FR
        </div>
        <div style={{ fontSize: '16px', color: '#888', fontFamily: 'Arial', marginTop: '4px' }}>
          Synergie alimentaire végétale · Données CIQUAL 2020 & PubMed
        </div>
      </div>

      {/* Contenu principal avec distribution verticale */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: 0,
        right: 0,
        bottom: '104px',
        padding: '44px 76px 0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* En-tête */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '90px', lineHeight: 1.1, marginBottom: '10px' }}>
            {food.emoji}
          </div>
          <div style={{
            fontSize: '62px', fontWeight: 'bold', color: '#0F2E1E',
            lineHeight: 1.05, fontFamily: 'Georgia, serif',
            letterSpacing: '-1.5px',
          }}>
            {food.nom}
          </div>
          <div style={{
            marginTop: '8px', fontSize: '20px', color: '#0F6E56',
            fontFamily: 'Arial, sans-serif', fontWeight: '500',
            textTransform: 'capitalize', letterSpacing: '1px',
          }}>
            {food.categorie}
          </div>
        </div>

        {/* Séparateur */}
        <div style={{ height: '3px', backgroundColor: '#1D9E75', borderRadius: '2px' }} />

        {/* Points forts nutritionnels */}
        {topNutriments.length > 0 && (
          <div>
            <div style={{
              fontSize: '17px', fontFamily: 'Arial, sans-serif', fontWeight: '700',
              color: '#0F6E56', textTransform: 'uppercase', letterSpacing: '3px',
              marginBottom: '14px',
            }}>
              ✦ Points forts nutritionnels
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topNutriments.map(n => (
                <div key={n.key} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  backgroundColor: 'rgba(29,158,117,0.08)', borderRadius: '14px',
                  padding: '12px 20px',
                }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    backgroundColor: '#1D9E75',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ color: 'white', fontSize: '17px', fontFamily: 'Arial', fontWeight: 'bold' }}>
                      {n.pct > 99 ? '✓' : `${n.pct}%`}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0F2E1E', fontFamily: 'Georgia' }}>
                      {n.valeur} {n.unite.split('/')[0]}
                    </div>
                    <div style={{ fontSize: '17px', color: '#0F6E56', fontFamily: 'Arial' }}>
                      {n.label} · {n.pct}% des AJR
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Synergie clé */}
        {synergie && (
          <div>
            <div style={{ height: '2px', backgroundColor: '#1D9E75', opacity: 0.3, marginBottom: '20px' }} />
            <div style={{
              fontSize: '17px', fontFamily: 'Arial, sans-serif', fontWeight: '700',
              color: '#0F6E56', textTransform: 'uppercase', letterSpacing: '3px',
              marginBottom: '12px',
            }}>
              ✦ Synergie clé
            </div>
            <div style={{
              backgroundColor: 'white', borderRadius: '16px',
              padding: '18px 22px', borderLeft: '6px solid #1D9E75',
            }}>
              <div style={{
                fontSize: '24px', fontWeight: 'bold', color: '#0F2E1E',
                fontFamily: 'Georgia', marginBottom: '6px',
              }}>
                {food.nom} + {synergie.aliment_associe_nom} {synergie.aliment_associe_emoji}
              </div>
              {synergie.gain_estime && (
                <div style={{
                  fontSize: '18px', color: '#1D9E75', fontFamily: 'Arial',
                  fontWeight: '600', marginBottom: '6px',
                }}>
                  📈 {synergie.gain_estime}
                </div>
              )}
              <div style={{ fontSize: '17px', color: '#444', fontFamily: 'Arial', lineHeight: 1.5 }}>
                {truncateAtSentence(synergie.mecanisme)}
              </div>
            </div>
          </div>
        )}

        {/* Association idéale */}
        {synergie && (
          <div>
            <div style={{ height: '2px', backgroundColor: '#1D9E75', opacity: 0.3, marginBottom: '20px' }} />
            <div style={{
              fontSize: '17px', fontFamily: 'Arial, sans-serif', fontWeight: '700',
              color: '#0F6E56', textTransform: 'uppercase', letterSpacing: '3px',
              marginBottom: '12px',
            }}>
              💡 Association idéale
            </div>
            <div style={{
              backgroundColor: 'white', borderRadius: '16px',
              padding: '18px 22px',
            }}>
              <div style={{ fontSize: '20px', color: '#333', fontFamily: 'Arial', lineHeight: 1.6 }}>
                {buildConseil(food, synergie)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default AlimentShareCard
