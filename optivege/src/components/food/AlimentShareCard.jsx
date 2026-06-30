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
      {/* Bande décorative en haut */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '10px', backgroundColor: '#1D9E75' }} />

      {/* Bande décorative en bas */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '10px', backgroundColor: '#1D9E75' }} />

      {/* Footer ancré en bas */}
      <div style={{
        position: 'absolute', bottom: '28px', left: 0, right: 0,
        textAlign: 'center', padding: '0 90px',
      }}>
        <div style={{ height: '2px', backgroundColor: '#1D9E75', opacity: 0.3, marginBottom: '20px' }} />
        <div style={{
          fontSize: '24px', fontFamily: 'Arial, sans-serif', fontWeight: '800',
          color: '#0F6E56', letterSpacing: '6px', textTransform: 'uppercase',
        }}>
          OPTIVEGE.FR
        </div>
        <div style={{ fontSize: '17px', color: '#888', fontFamily: 'Arial', marginTop: '5px' }}>
          Synergie alimentaire végétale · Données CIQUAL 2020 & PubMed
        </div>
      </div>

      {/* Contenu principal — padding interne, hauteur calculée pour laisser la place au footer */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: 0,
        right: 0,
        bottom: '110px',
        padding: '52px 76px 0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '96px', lineHeight: 1.1, marginBottom: '14px' }}>
            {food.emoji}
          </div>
          <div style={{
            fontSize: '64px', fontWeight: 'bold', color: '#0F2E1E',
            lineHeight: 1.05, fontFamily: 'Georgia, serif',
            letterSpacing: '-1.5px',
          }}>
            {food.nom}
          </div>
          <div style={{
            marginTop: '10px', fontSize: '22px', color: '#0F6E56',
            fontFamily: 'Arial, sans-serif', fontWeight: '500',
            textTransform: 'capitalize', letterSpacing: '1px',
          }}>
            {food.categorie}
          </div>
        </div>

        {/* Séparateur */}
        <div style={{ height: '3px', backgroundColor: '#1D9E75', marginBottom: '32px', borderRadius: '2px', flexShrink: 0 }} />

        {/* Points forts nutritionnels */}
        {topNutriments.length > 0 && (
          <div style={{ marginBottom: '32px', flexShrink: 0 }}>
            <div style={{
              fontSize: '18px', fontFamily: 'Arial, sans-serif', fontWeight: '700',
              color: '#0F6E56', textTransform: 'uppercase', letterSpacing: '3px',
              marginBottom: '18px',
            }}>
              ✦ Points forts nutritionnels
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topNutriments.map(n => (
                <div key={n.key} style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  backgroundColor: 'rgba(29,158,117,0.08)', borderRadius: '14px',
                  padding: '14px 22px',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    backgroundColor: '#1D9E75',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ color: 'white', fontSize: '18px', fontFamily: 'Arial', fontWeight: 'bold' }}>
                      {n.pct > 99 ? '✓' : `${n.pct}%`}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#0F2E1E', fontFamily: 'Georgia' }}>
                      {n.valeur} {n.unite.split('/')[0]}
                    </div>
                    <div style={{ fontSize: '18px', color: '#0F6E56', fontFamily: 'Arial' }}>
                      {n.label} · {n.pct}% des AJR
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Séparateur */}
        <div style={{ height: '2px', backgroundColor: '#1D9E75', opacity: 0.3, marginBottom: '28px', flexShrink: 0 }} />

        {/* Synergie clé */}
        {synergie && (
          <div style={{ flexShrink: 0 }}>
            <div style={{
              fontSize: '18px', fontFamily: 'Arial, sans-serif', fontWeight: '700',
              color: '#0F6E56', textTransform: 'uppercase', letterSpacing: '3px',
              marginBottom: '16px',
            }}>
              ✦ Synergie clé
            </div>
            <div style={{
              backgroundColor: 'white', borderRadius: '18px',
              padding: '22px 26px', borderLeft: '6px solid #1D9E75',
            }}>
              <div style={{
                fontSize: '26px', fontWeight: 'bold', color: '#0F2E1E',
                fontFamily: 'Georgia', marginBottom: '8px',
              }}>
                {food.nom} + {synergie.aliment_associe_nom} {synergie.aliment_associe_emoji}
              </div>
              {synergie.gain_estime && (
                <div style={{
                  fontSize: '20px', color: '#1D9E75', fontFamily: 'Arial',
                  fontWeight: '600', marginBottom: '8px',
                }}>
                  📈 {synergie.gain_estime}
                </div>
              )}
              <div style={{
                fontSize: '18px', color: '#444', fontFamily: 'Arial',
                lineHeight: 1.5,
              }}>
                {synergie.mecanisme?.length > 120
                  ? synergie.mecanisme.slice(0, 117) + '…'
                  : synergie.mecanisme}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default AlimentShareCard
