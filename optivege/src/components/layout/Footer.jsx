import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-green-deep text-white mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌿</span>
            <span className="font-heading text-lg font-bold">Optivege</span>
          </div>
          <p className="text-green-300 text-sm leading-relaxed">
            L'application de référence sur la synergie alimentaire végétale.
            Toutes les données sont sourcées scientifiquement.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-green-300 text-sm uppercase tracking-wide">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/aliments" className="text-gray-300 hover:text-white transition-colors">🥦 Recherche par aliment</Link></li>
            <li><Link to="/bienfaits" className="text-gray-300 hover:text-white transition-colors">💪 Recherche par bienfait</Link></li>
            <li><Link to="/recettes" className="text-gray-300 hover:text-white transition-colors">🍽️ Recettes</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-green-300 text-sm uppercase tracking-wide">Sources de données</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="https://ciqual.anses.fr" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                📊 CIQUAL 2020 — Anses
              </a>
            </li>
            <li>
              <a href="https://fdc.nal.usda.gov" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                📊 USDA FoodData Central
              </a>
            </li>
            <li>
              <a href="https://pubmed.ncbi.nlm.nih.gov" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                🔬 PubMed — Études cliniques
              </a>
            </li>
            <li>
              <a href="https://optivege.fr" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-green-300 transition-colors">
                🌿 Blog Optivege.fr →
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-green-800 py-4 text-center text-xs text-green-400">
        <p>Optivege — Toutes les informations nutritionnelles sont sourcées scientifiquement (CIQUAL 2020, USDA, PubMed).</p>
        <p className="mt-1">Cette application est informative et ne remplace pas l'avis d'un professionnel de santé.</p>
      </div>
    </footer>
  )
}
