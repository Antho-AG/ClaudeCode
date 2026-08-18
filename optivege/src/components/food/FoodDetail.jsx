import { Link } from 'react-router-dom'
import FoodIcon from './FoodIcon'
import NutritionTable from './NutritionTable'
import SynergyCard from './SynergyCard'
import SourceCitation from '../ui/SourceCitation'
import DebateWarning from '../ui/DebateWarning'
import Badge from '../ui/Badge'
import TermeLink from '../ui/TermeLink'
import { AFFILIATE_LINKS } from '../../data/affiliateLinks'
import recipesData from '../../data/recipes.json'

const ARTICLES_BLOG = [
  {
    url: 'https://optivege.fr/fer-vitamine-c',
    ancre: 'Comprendre la synergie fer + vitamine C',
    aliments: ['epinard', 'lentille', 'graine_de_sesame', 'graines_de_courge', 'graines_de_chia', 'avoine', 'tofu', 'pois_chiche', 'quinoa'],
  },
  {
    url: 'https://optivege.fr/proteines-vegetales-completes',
    ancre: 'Guide des protéines végétales complètes',
    aliments: ['quinoa', 'lentille', 'pois_chiche', 'tofu', 'graines_de_chia', 'levure_nutritionnelle'],
  },
  {
    url: 'https://optivege.fr/omega3-vegetaux',
    ancre: 'Sources d\'oméga-3 végétaux',
    aliments: ['graines_de_chia', 'graines_de_lin', 'noix'],
  },
  {
    url: 'https://optivege.fr/calcium-vitamine-d3-k2',
    ancre: 'Calcium, D3 et K2 : la synergie osseuse',
    aliments: ['brocoli', 'kale', 'amande', 'graine_de_sesame'],
  },
]

function getArticles(foodId) {
  return ARTICLES_BLOG.filter(a => a.aliments.includes(foodId))
}

const BENEFIT_EMOJI = {
  fer: '⚙️', proteines: '💪', calcium: '🦴', omega3: '🐟',
  antioxydants: '🛡️', fibres: '🌿', vitamine_c: '🍋', folates: '🧬',
  magnesium: '⚡', proteines_completes: '💪', vitamine_k: '🦴',
  isoflavones: '🌱', omega9: '🫒', potassium: '❤️', anti_inflammatoire: '🔥',
}

// Fiche complète d'un aliment avec toutes ses sections
export default function FoodDetail({ food }) {
  if (!food) return null

  const recette = food.recette_idee_id
    ? recipesData.find(r => r.id === food.recette_idee_id)
    : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      {/* Section A — Présentation */}
      <section>
        <div className="flex items-center gap-4 mb-4">
          <FoodIcon food={food} size={64} />
          <div>
            <h1 className="text-3xl font-heading font-bold text-green-dark">{food.nom}</h1>
            <span className="text-sm text-gray-500 capitalize bg-green-bg px-3 py-1 rounded-full">
              {food.categorie}
            </span>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed text-base"><TermeLink>{food.description}</TermeLink></p>
        {food.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {food.tags.map(tag => (
              <Badge
                key={tag}
                label={tag.replace(/_/g, ' ')}
                emoji={BENEFIT_EMOJI[tag]}
                variant="green"
              />
            ))}
          </div>
        )}
      </section>

      {/* Section B — Teneurs nutritionnelles */}
      {food.teneurs && (
        <section>
          <h2 className="section-title">📊 Teneurs nutritionnelles</h2>
          <NutritionTable teneurs={food.teneurs} portionUsuelle={food.portionUsuelle} />
        </section>
      )}

      {/* Lien affilié */}
      {AFFILIATE_LINKS[food.id] && (
        <a
          href={AFFILIATE_LINKS[food.id].url}
          target="_blank"
          rel="noopener sponsored"
          className="flex items-center gap-2 text-sm rounded-xl px-4 py-2.5 border-l-4 hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#E8F7F2', borderLeftColor: '#1D9E75', color: '#0F6E56' }}
        >
          <span>🛒</span>
          <span>Acheter en bio · <span className="font-medium">{AFFILIATE_LINKS[food.id].label}</span></span>
          <span className="ml-auto text-xs opacity-60">via optivege.fr →</span>
        </a>
      )}

      {/* Section C — Bienfaits détaillés */}
      {food.bienfaits?.length > 0 && (
        <section>
          <h2 className="section-title">✅ Bienfaits documentés</h2>
          <div className="space-y-4">
            {food.bienfaits.map(bienfait => (
              <div key={bienfait.id} className="card">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">{BENEFIT_EMOJI[bienfait.id] || '✨'}</span>
                  <h3 className="font-semibold text-green-dark">{bienfait.label}</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3"><TermeLink>{bienfait.detail}</TermeLink></p>
                <div className="flex flex-col gap-1">
                  {bienfait.sources?.map((s, i) => <SourceCitation key={i} source={s} />)}
                </div>
                {bienfait.sujet_a_debat && (
                  <DebateWarning detail={bienfait.debat_detail} sources={bienfait.sources} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section D — Synergies */}
      {food.synergies?.length > 0 && (
        <section>
          <h2 className="section-title">✨ Synergies alimentaires</h2>
          <p className="text-gray-600 mb-4">Avec quoi l'associer pour maximiser ses bienfaits ?</p>
          <div className="space-y-4">
            {food.synergies.map((syn, i) => (
              <SynergyCard key={i} synergie={syn} />
            ))}
          </div>
        </section>
      )}

      {/* Section E — Idée recette */}
      {recette && (
        <section>
          <h2 className="section-title">🍽️ Idée recette</h2>
          <Link
            to={`/recettes/${recette.id}`}
            className="card block hover:shadow-md hover:border-green-main transition-all"
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">{recette.emoji}</span>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-green-dark text-lg">{recette.nom}</h3>
                <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                  <span>⏱️ {recette.temps}</span>
                  <span>👤 {recette.portions} portions</span>
                  <span className="font-medium text-green-main">{recette.difficulte}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {recette.synergies_utilisees?.slice(0, 2).map((s, i) => (
                    <span key={i} className="text-xs bg-orange-100 text-orange-dark px-2 py-0.5 rounded-full font-medium">
                      ✨ {s.benefice}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-green-main font-medium mt-3">Voir la recette complète →</p>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Section Aller plus loin */}
      {getArticles(food.id).length > 0 && (
        <section>
          <h2 className="section-title">📖 Aller plus loin</h2>
          <div className="flex flex-col gap-3">
            {getArticles(food.id).map(article => (
              <a
                key={article.url}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#1D9E75' }}
              >
                <span className="text-xl">📖</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-snug">{article.ancre}</p>
                  <p className="text-xs opacity-80 mt-0.5">optivege.fr</p>
                </div>
                <span className="text-sm font-medium whitespace-nowrap">Lire l'article complet →</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Favoris — à venir */}
      <div className="flex justify-center">
        <span className="text-xs text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
          🔖 Favoris — fonctionnalité à venir
        </span>
      </div>
    </div>
  )
}
