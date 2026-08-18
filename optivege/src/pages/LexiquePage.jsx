import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import lexiqueData from '../data/lexique.json'
import useMeta from '../hooks/useMeta'

const CATEGORIES = [...new Set(lexiqueData.map(t => t.categorie))].sort()

const sorted = [...lexiqueData].sort((a, b) => a.terme.localeCompare(b.terme, 'fr'))

function groupByLetter(terms) {
  const groups = {}
  for (const t of terms) {
    const letter = t.terme[0].toUpperCase()
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(t)
  }
  return groups
}

export default function LexiquePage() {
  useMeta({
    title: 'Lexique de nutrition végétale — Définitions scientifiques | Optivege',
    description: 'Glossaire complet des termes de nutrition végétale : définitions scientifiques, mécanismes biochimiques et références PubMed.',
  })
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [categorie, setCategorie] = useState('')
  const termRefs = useRef({})

  // Scroll vers l'ancre (#terme-id) à l'arrivée ou au changement de hash
  useEffect(() => {
    const id = location.hash.replace('#', '')
    if (id && termRefs.current[id]) {
      setTimeout(() => {
        termRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'center' })
        termRefs.current[id].classList.add('ring-2', 'ring-orange-main', 'ring-offset-2')
        setTimeout(() => {
          termRefs.current[id]?.classList.remove('ring-2', 'ring-orange-main', 'ring-offset-2')
        }, 2500)
      }, 100)
    }
  }, [location.hash])

  const filtered = sorted.filter(t => {
    const matchSearch = !search || t.terme.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase())
    const matchCat = !categorie || t.categorie === categorie
    return matchSearch && matchCat
  })

  const grouped = groupByLetter(filtered)
  const letters = Object.keys(grouped).sort()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-deep via-green-dark to-green-mid text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-3">📖</div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-3">
            Lexique scientifique
          </h1>
          <p className="text-green-100 text-lg">
            {lexiqueData.length} termes techniques expliqués simplement
          </p>
          <p className="text-green-200 text-sm mt-1">
            Cliquez sur n'importe quel terme souligné sur le site pour accéder directement à sa définition.
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            placeholder="Rechercher un terme..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-main"
          />
          <select
            value={categorie}
            onChange={e => setCategorie(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-main bg-white"
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Navigation par lettre */}
        {!search && !categorie && (
          <div className="max-w-4xl mx-auto px-4 pb-2 flex flex-wrap gap-1">
            {letters.map(l => (
              <a
                key={l}
                href={`#letter-${l}`}
                className="text-xs font-bold text-green-main hover:text-green-dark px-2 py-0.5 rounded hover:bg-green-bg transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Contenu */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Aucun terme trouvé pour "{search}"</p>
        ) : (
          <div className="space-y-8">
            {letters.map(letter => (
              <div key={letter} id={`letter-${letter}`}>
                <h2 className="text-2xl font-heading font-bold text-green-dark mb-4 pb-2 border-b border-green-pale">
                  {letter}
                </h2>
                <div className="space-y-4">
                  {grouped[letter].map(terme => (
                    <div
                      key={terme.id}
                      id={terme.id}
                      ref={el => { termRefs.current[terme.id] = el }}
                      className="card transition-all duration-300 scroll-mt-32"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-heading font-bold text-green-dark text-lg">
                            {terme.terme}
                          </h3>
                          <span className="text-xs bg-green-bg text-green-dark px-2 py-0.5 rounded-full">
                            {terme.categorie}
                          </span>
                        </div>
                      </div>
                      {terme.enBref && (
                        <div className="flex items-start gap-2 mb-3 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                          <span className="text-xs font-bold text-orange-500 shrink-0 mt-0.5">🎯 En bref</span>
                          <p className="text-xs text-orange-700 leading-relaxed">{terme.enBref}</p>
                        </div>
                      )}
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {terme.definition}
                      </p>
                      {terme.termes_associes?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          <span className="text-xs text-gray-400">Voir aussi :</span>
                          {terme.termes_associes.map(t => {
                            const entry = lexiqueData.find(
                              e => e.terme.toLowerCase() === t.toLowerCase() ||
                                   e.termes_variants.some(v => v.toLowerCase() === t.toLowerCase())
                            )
                            return entry ? (
                              <a
                                key={t}
                                href={`#${entry.id}`}
                                className="text-xs text-green-main hover:text-green-dark font-medium underline underline-offset-2"
                              >
                                {t}
                              </a>
                            ) : (
                              <span key={t} className="text-xs text-gray-500">{t}</span>
                            )
                          })}
                        </div>
                      )}
                      {terme.termes_variants?.length > 1 && (
                        <p className="text-xs text-gray-400 mt-2">
                          Aussi écrit : {terme.termes_variants.slice(1).join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
