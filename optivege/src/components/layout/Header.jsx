import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/aliments', label: '🥦 Aliments' },
  { to: '/bienfaits', label: '💪 Bienfaits' },
  { to: '/recettes', label: '🍽️ Recettes' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-green-pale sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="font-heading text-xl font-bold text-green-dark">Optivege</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-pale text-green-dark'
                    : 'text-gray-600 hover:bg-green-bg hover:text-green-dark'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://optivege.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-4 py-2 rounded-xl text-sm font-medium bg-green-dark text-white hover:bg-green-mid transition-colors"
          >
            Blog →
          </a>
        </nav>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-green-bg"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className={`w-5 h-0.5 bg-current mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <div className={`w-5 h-0.5 bg-current mb-1 ${menuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-green-pale bg-white px-4 pb-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-green-pale text-green-dark' : 'text-gray-700 hover:bg-green-bg'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://optivege.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl text-sm font-medium bg-green-dark text-white text-center"
          >
            Blog Optivege.fr →
          </a>
        </nav>
      )}
    </header>
  )
}
