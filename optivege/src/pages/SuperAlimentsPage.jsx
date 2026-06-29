import { Link } from 'react-router-dom'
import { useAllFoods } from '../hooks/useFoodData'
import Badge from '../components/ui/Badge'
import useMeta from '../hooks/useMeta'

const BENEFIT_EMOJI = {
  fer: '⚙️', proteines: '💪', calcium: '🦴', omega3: '🐟',
  antioxydants: '🛡️', fibres: '🌿', vitamine_c: '🍋', folates: '🧬',
  magnesium: '⚡', proteines_completes: '💪', vitamine_k: '🦴',
  isoflavones: '🌱', omega9: '🫒', potassium: '❤️', anti_inflammatoire: '🔥',
  zinc: '⚡', iode: '🌊', detox: '🧹', immunite: '🛡️', selenium: '✨',
  cardiovasculaire: '❤️', chlorophylle: '🌿',
}

const CATEGORY_LABELS = {
  'antioxydants': { label: 'Antioxydants', emoji: '🛡️', color: 'bg-purple-100 text-purple-800' },
  'fer': { label: 'Fer & minéraux', emoji: '⚙️', color: 'bg-red-100 text-red-800' },
  'proteines_completes': { label: 'Protéines complètes', emoji: '💪', color: 'bg-blue-100 text-blue-800' },
  'omega3': { label: 'Oméga-3', emoji: '🐟', color: 'bg-cyan-100 text-cyan-800' },
  'anti_inflammatoire': { label: 'Anti-inflammatoire', emoji: '🔥', color: 'bg-orange-100 text-orange-800' },
  'calcium': { label: 'Calcium', emoji: '🦴', color: 'bg-yellow-100 text-yellow-800' },
  'immunite': { label: 'Immunité', emoji: '🛡️', color: 'bg-green-100 text-green-800' },
}

function getSuperCategory(food) {
  for (const tag of (food.tags || [])) {
    if (CATEGORY_LABELS[tag]) return tag
  }
  return null
}

export default function SuperAlimentsPage() {
  useMeta({
    title: 'Super aliments végétaux — Sélection scientifique | Optivege',
    description: 'Découvrez les super aliments végétaux sélectionnés selon des critères scientifiques stricts : densité nutritionnelle exceptionnelle, études PubMed et propriétés synergiques.',
  })
  const allFoods = useAllFoods()
  const superFoods = allFoods.filter(f => f.super_aliment)

  const grouped = {}
  superFoods.forEach(food => {
    const cat = getSuperCategory(food) || 'autres'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(food)
  })

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-deep via-green-dark to-green-mid text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-3">⭐</div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-3">
            Super Aliments
          </h1>
          <p className="text-green-100 text-lg mb-2">
            Les {superFoods.length} aliments végétaux à densité nutritionnelle exceptionnelle
          </p>
          <p className="text-green-200 text-sm">
            Sélection basée sur la densité en nutriments, les études PubMed et les propriétés synergiques.
          </p>
        </div>
      </section>

      {/* Qu'est-ce qu'un super aliment ? */}
      <section className="bg-orange-50 border-b border-orange-100">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">📖</span>
            <div>
              <h2 className="font-semibold text-green-dark mb-1">Notre définition d'un "Super Aliment"</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                Nous n'utilisons pas ce terme marketing à la légère. Un super aliment Optivege répond à au moins deux critères objectifs :
                densité nutritionnelle exceptionnelle (plusieurs nutriments clés concentrés), propriétés synergiques remarquables documentées,
                et/ou composés bioactifs uniques validés dans des études cliniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grille des super aliments */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {superFoods.map(food => (
            <Link
              key={food.id}
              to={`/aliments/${food.id}`}
              className="card group hover:shadow-lg hover:border-green-main transition-all duration-200 flex flex-col gap-3 relative"
            >
              {/* Badge super aliment */}
              <div className="absolute -top-2 -right-2 bg-orange-main text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
                ⭐ Super
              </div>

              <div className="flex items-start gap-3">
                <span className="text-4xl">{food.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-green-dark group-hover:text-green-mid transition-colors">
                    {food.nom}
                  </h3>
                  <span className="text-xs text-gray-500 capitalize">{food.categorie}</span>
                </div>
              </div>

              {/* Raison super aliment */}
              {food.super_aliment_raison && (
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 bg-green-bg rounded-lg p-2">
                  ⭐ {food.super_aliment_raison}
                </p>
              )}

              {food.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {food.tags.slice(0, 3).map(tag => (
                    <Badge
                      key={tag}
                      label={tag.replace(/_/g, ' ')}
                      emoji={BENEFIT_EMOJI[tag]}
                      variant="green"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-green-main font-medium">
                  {food.synergies?.length || 0} synergie{(food.synergies?.length || 0) !== 1 ? 's' : ''} →
                </span>
                <span className="text-xs text-gray-400">Voir la fiche →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section synergies entre super aliments */}
      <section className="bg-green-bg border-t border-green-pale py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-green-dark mb-2 text-center">
            ✨ Combiner les super aliments
          </h2>
          <p className="text-gray-600 text-center text-sm mb-8">
            La synergie entre super aliments est plus puissante que chacun pris isolément.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                combo: ['Spiruline', 'Chlorelle', '🌊'],
                synergie: 'Spiruline + Chlorelle',
                benefice: 'Protéines complètes + Détox + Immunité',
                detail: 'La phycocyanine de la spiruline et le CGF de la chlorelle se complètent pour une action antioxydante, détoxifiante et immunostimulante inégalée dans le règne végétal.',
              },
              {
                combo: ['Graines de chia', 'Myrtilles', '🫐'],
                synergie: 'Graines de chia + Myrtilles',
                benefice: 'Oméga-3 protégés par les anthocyanes',
                detail: 'Les anthocyanes des myrtilles protègent les ALA oméga-3 des graines de chia de l\'oxydation lipidique, prolongeant leur action anti-inflammatoire.',
              },
              {
                combo: ['Curcuma', 'Gingembre', '🌿'],
                synergie: 'Curcuma + Gingembre + Poivre noir',
                benefice: 'Synergie anti-inflammatoire triple',
                detail: 'Curcumine (curcuma) + gingérols (gingembre) + pipérine (poivre) — trois composés anti-inflammatoires aux mécanismes complémentaires sur NF-κB et COX-2.',
              },
              {
                combo: ['Kale', 'Graines de lin', '🥬'],
                synergie: 'Kale + Graines de lin',
                benefice: 'Oméga-3 + Calcium + Vitamine K',
                detail: 'Le kale apporte calcium et vitamine K (fixation osseuse), les graines de lin apportent ALA oméga-3 et lignanes. Ensemble : une synergie osseuse et cardiovasculaire complète.',
              },
            ].map((item, i) => (
              <div key={i} className="card border-l-4 border-l-orange-main bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{item.combo[2]}</span>
                  <h3 className="font-semibold text-green-dark text-sm">{item.synergie}</h3>
                </div>
                <p className="text-xs font-medium text-orange-main mb-1">✨ {item.benefice}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 px-4 text-center">
        <h3 className="font-heading text-xl font-bold text-green-dark mb-3">
          Découvrir toute la base d'aliments
        </h3>
        <p className="text-gray-600 text-sm mb-5">
          {superFoods.length} super aliments parmi {allFoods.length} aliments végétaux documentés
        </p>
        <Link to="/aliments" className="btn-primary inline-block">
          🥦 Explorer tous les aliments →
        </Link>
      </section>
    </div>
  )
}
