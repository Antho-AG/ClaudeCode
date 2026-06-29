import Badge from '../ui/Badge'
import SourceCitation from '../ui/SourceCitation'

const BENEFIT_EMOJI = {
  fer: '⚙️', proteines: '💪', calcium: '🦴', omega3: '🐟',
  antioxydants: '🛡️', fibres: '🌿', vitamine_c: '🍋', folates: '🧬',
  magnesium: '⚡', proteines_completes: '💪', vitamine_k: '🦴', anti_inflammatoire: '🔥',
}

// Fiche recette complète avec synergies documentées
export default function RecipeDetail({ recipe }) {
  if (!recipe) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* En-tête */}
      <section>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-6xl">{recipe.emoji}</span>
          <div>
            <h1 className="text-3xl font-heading font-bold text-green-dark">{recipe.nom}</h1>
            <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
              <span>⏱️ {recipe.temps}</span>
              <span>👤 {recipe.portions} portions</span>
              <span className="font-medium text-green-main">{recipe.difficulte}</span>
            </div>
          </div>
        </div>
        {recipe.bienfaits_cles?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {recipe.bienfaits_cles.map(tag => (
              <Badge
                key={tag}
                label={tag.replace(/_/g, ' ')}
                emoji={BENEFIT_EMOJI[tag]}
                variant="green"
              />
            ))}
            <span className="badge badge-orange">Optimisé : {recipe.categorie_synergie}</span>
          </div>
        )}
      </section>

      {/* Ingrédients */}
      <section>
        <h2 className="section-title">🛒 Ingrédients</h2>
        <ul className="card space-y-2">
          {recipe.ingredients?.map((ing, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="text-green-main font-semibold min-w-[60px]">{ing.quantite}</span>
              <span className="text-gray-700">
                {ing.nom}
                {ing.note && <span className="text-gray-400 ml-1 italic">({ing.note})</span>}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Étapes */}
      <section>
        <h2 className="section-title">👨‍🍳 Préparation</h2>
        <ol className="space-y-3">
          {recipe.etapes?.map((etape, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 bg-green-dark text-white rounded-full flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              <p className="text-gray-700 text-sm leading-relaxed pt-0.5">{etape}</p>
            </li>
          ))}
        </ol>
        {recipe.conseil_cuisson && (
          <div className="mt-4 p-3 bg-green-bg border border-green-pale rounded-xl text-sm text-green-dark">
            💡 <strong>Conseil :</strong> {recipe.conseil_cuisson}
          </div>
        )}
      </section>

      {/* Synergies */}
      {recipe.synergies_utilisees?.length > 0 && (
        <section>
          <h2 className="section-title">🔬 Synergies de cette recette</h2>
          <div className="space-y-4">
            {recipe.synergies_utilisees.map((syn, i) => (
              <div key={i} className="card border-l-4 border-l-green-main">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">✨</span>
                  <div>
                    <h4 className="font-semibold text-green-dark">
                      {syn.aliment_1} + {syn.aliment_2}
                    </h4>
                    <p className="text-sm font-medium text-orange-main">{syn.benefice}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{syn.mecanisme}</p>
                <p className="text-xs text-gray-400">📚 {syn.source}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Note nutritionnelle */}
      {recipe.note_nutritionnelle && (
        <section className="card bg-green-bg border-green-pale">
          <h2 className="text-base font-semibold text-green-dark mb-2">📊 Note nutritionnelle</h2>
          <p className="text-sm text-gray-700">{recipe.note_nutritionnelle}</p>
          {recipe.sources_nutritionnelles?.length > 0 && (
            <div className="mt-2 flex flex-col gap-1">
              {recipe.sources_nutritionnelles.map((s, i) => <SourceCitation key={i} source={s} />)}
            </div>
          )}
        </section>
      )}

      {/* Variantes */}
      {recipe.variantes && (
        <section>
          <h2 className="section-title">🔄 Variantes</h2>
          <p className="text-gray-700 text-sm">{recipe.variantes}</p>
        </section>
      )}

      {/* Bouton favoris — désactivé Phase 1 */}
      <div className="flex justify-center">
        <button
          disabled
          title="Créez un compte pour sauvegarder vos recettes"
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-400 cursor-not-allowed text-sm"
        >
          ❤️ Sauvegarder cette recette
          <span className="text-xs">(Compte requis)</span>
        </button>
      </div>
    </div>
  )
}
