import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/aliments', label: '🥦 Aliments' },
  { to: '/super-aliments', label: '⭐ Super Aliments' },
  { to: '/bienfaits', label: '💪 Bienfaits' },
  { to: '/recettes', label: '🍽️ Recettes' },
  { to: '/lexique', label: '📖 Lexique' },
  { to: '/planifier', label: '🗓️ Planifier' },
  { to: '/creer', label: '✨ Créer' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: 'linear-gradient(90deg, #0F6E56 0%, #1D9E75 100%)', boxShadow: '0 2px 16px rgba(15,110,86,0.2)' }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="font-heading text-xl font-bold text-white">Optivege</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-green-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://optivege.fr"
            target="_blank"
            rel="noopener"
            className="ml-2 px-4 py-2 rounded-xl text-sm font-medium bg-white text-green-dark hover:bg-green-50 transition-colors duration-150"
          >
            Blog →
          </a>
        </nav>

        <button
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className={`w-5 h-0.5 bg-current mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <div className={`w-5 h-0.5 bg-current mb-1 ${menuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <nav
          className="md:hidden px-4 pb-4 flex flex-col gap-1"
          style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/20 text-white' : 'text-green-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://optivege.fr"
            target="_blank"
            rel="noopener"
            className="px-4 py-3 rounded-xl text-sm font-medium bg-white text-green-dark text-center"
          >
            Blog Optivege.fr →
          </a>
        </nav>
      )}
    </header>
  )
}
