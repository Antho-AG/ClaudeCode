import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useMeta from '../hooks/useMeta'
import FoodCard from '../components/food/FoodCard'
import { useAllFoods, useAllBenefits } from '../hooks/useFoodData'
import foodsData from '../data/foods.json'

// Sélectionne une synergie au hasard parmi toutes les synergies de la base
function getRandomSynergie() {
  const allSynergies = []
  foodsData.forEach(food => {
    food.synergies?.forEach(syn => {
      allSynergies.push({ food, syn })
    })
  })
  if (!allSynergies.length) return null
  return allSynergies[Math.floor(Math.random() * allSynergies.length)]
}

const RANDOM_SYN = getRandomSynergie()

export default function Home() {
  useMeta({
    title: 'Optivege — La synergie alimentaire végétale, données scientifiques CIQUAL & PubMed',
    description: 'Découvrez les synergies alimentaires végétales basées sur les données CIQUAL et les études PubMed. Maximisez l\'absorption de vos nutriments grâce aux bonnes associations.',
  })
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const allFoods = useAllFoods()
  const benefits = useAllBenefits()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/aliments?q=${encodeURIComponent(query.trim())}`)
  }

  const featured = allFoods.slice(0, 4)
  const superFoods = allFoods.filter(f => f.super_aliment)
  const superFeatured = superFoods.slice(0, 4)
  const superCount = superFoods.length

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-dark to-green-mid text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-4">🌿</div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Optivege
          </h1>
          <p className="text-xl text-green-100 mb-2">
            La synergie alimentaire végétale, enfin expliquée.
          </p>
          <p className="text-green-200 text-sm mb-8">
            Toutes les données sont sourcées scientifiquement (CIQUAL 2020, USDA, PubMed).
          </p>

          {/* Barre de recherche centrale */}
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher un aliment (ex : épinard, lentille...)"
              className="w-full px-5 py-4 pr-14 rounded-2xl text-gray-800 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-green-light"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-4 bg-green-dark text-white rounded-xl hover:bg-green-mid transition-colors"
            >
              🔍
            </button>
          </form>
        </div>
      </section>

      {/* 3 boutons d'accès rapide */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/aliments"
            className="card flex flex-col items-center gap-3 hover:shadow-md hover:border-green-main transition-all text-center"
          >
            <span className="text-4xl">🥦</span>
            <div>
              <p className="font-semibold text-green-dark">Chercher un aliment</p>
              <p className="text-xs text-gray-500 mt-1">Synergies, teneurs, bienfaits</p>
            </div>
          </Link>
          <Link
            to="/bienfaits"
            className="card flex flex-col items-center gap-3 hover:shadow-md hover:border-green-main transition-all text-center"
          >
            <span className="text-4xl">💪</span>
            <div>
              <p className="font-semibold text-green-dark">Chercher un bienfait</p>
              <p className="text-xs text-gray-500 mt-1">Fer, protéines, calcium, oméga-3...</p>
            </div>
          </Link>
          <Link
            to="/recettes"
            className="card flex flex-col items-center gap-3 hover:shadow-md hover:border-green-main transition-all text-center"
          >
            <span className="text-4xl">🍽️</span>
            <div>
              <p className="font-semibold text-green-dark">Découvrir les recettes</p>
              <p className="text-xs text-gray-500 mt-1">Synergies culinaires documentées</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Synergie du jour */}
      {RANDOM_SYN && (
        <section className="max-w-3xl mx-auto px-4 pb-8">
          <h2 className="section-title">✨ Synergie du jour</h2>
          <div className="card border-l-4 border-l-orange-main bg-orange-50">
            <div className="flex items-start gap-4">
              <div className="text-3xl">{RANDOM_SYN.food.emoji}</div>
              <div className="flex-1">
                <p className="font-semibold text-green-dark">
                  {RANDOM_SYN.food.nom} + {RANDOM_SYN.syn.aliment_associe_nom} {RANDOM_SYN.syn.aliment_associe_emoji}
                </p>
                <p className="text-sm text-orange-main font-medium mt-1">
                  📈 {RANDOM_SYN.syn.gain_estime}
                </p>
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                  {RANDOM_SYN.syn.mecanisme}
                </p>
                <Link
                  to={`/aliments/${RANDOM_SYN.food.id}`}
                  className="inline-block mt-3 text-sm text-green-dark font-medium hover:text-green-mid"
                >
                  En savoir plus sur {RANDOM_SYN.food.nom} →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bienfaits */}
      <section className="max-w-3xl mx-auto px-4 pb-8">
        <h2 className="section-title">🎯 Explorer par bienfait</h2>
        <div className="flex flex-wrap gap-2">
          {benefits.map(b => (
            <Link
              key={b.id}
              to={`/bienfaits/${b.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-green-pale rounded-xl hover:border-green-main hover:bg-green-bg transition-all text-sm font-medium text-green-dark"
            >
              {b.emoji} {b.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Aliments à la une */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">🌟 Aliments à la une</h2>
          <Link to="/aliments" className="text-sm text-green-dark font-medium hover:text-green-mid">
            Voir tous →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featured.map(food => <FoodCard key={food.id} food={food} />)}
        </div>
      </section>


      {/* Super Aliments */}
      <section className="bg-gradient-to-br from-orange-50 to-cream border-y border-orange-100 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="section-title mb-0">⭐ Super Aliments</h2>
            <Link to="/super-aliments" className="text-sm text-green-dark font-medium hover:text-green-mid">
              Voir tous →
            </Link>
          </div>
          <p className="text-gray-600 text-sm mb-5">
            Les aliments végétaux à densité nutritionnelle exceptionnelle, sélectionnés sur critères scientifiques.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {superFeatured.map(food => <FoodCard key={food.id} food={food} />)}
          </div>
          <div className="text-center mt-5">
            <Link to="/super-aliments" className="btn-secondary inline-block">
              ⭐ Découvrir les {superCount} super aliments →
            </Link>
          </div>
        </div>
      </section>

      {/* Bannière blog */}
      <section className="bg-green-deep text-white py-10 px-4">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-green-300 text-sm mb-2">Le blog associé</p>
          <h3 className="font-heading text-2xl font-bold mb-3">Optivege.fr</h3>
          <p className="text-green-200 text-sm mb-4">
            Articles approfondis sur la nutrition végétale, les synergies alimentaires et la santé.
          </p>
          <a
            href="https://optivege.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 bg-green-main text-white font-semibold rounded-xl hover:bg-green-light transition-colors"
          >
            Visiter Optivege.fr →
          </a>
        </div>
      </section>
    </div>
  )
}
