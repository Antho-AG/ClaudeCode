import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'

export default function Sidebar() {
  return (
    <nav className="hidden lg:flex flex-col w-56 shrink-0 bg-bg-secondary border-r border-white/5 p-3 gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              isActive ? 'bg-accent text-white' : 'text-text-secondary hover:bg-bg-card hover:text-text-primary'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
