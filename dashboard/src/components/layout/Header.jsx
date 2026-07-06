import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { formatDateFR, formatTimeFR, getGreeting } from '../../utils/dateUtils'

export default function Header({ onRefreshAll }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="flex items-center justify-between gap-4 px-4 py-3 bg-bg-secondary border-b border-white/5">
      <div className="flex flex-col">
        <span className="text-2xl font-bold tabular-nums leading-tight">{formatTimeFR(now)}</span>
        <span className="text-sm text-text-secondary capitalize">{formatDateFR(now)}</span>
      </div>

      <div className="hidden sm:block text-text-secondary text-sm">{getGreeting(now)}</div>

      <button
        type="button"
        onClick={onRefreshAll}
        aria-label="Tout actualiser"
        className="flex items-center gap-2 rounded-full bg-bg-card px-3 py-2 text-sm text-text-primary hover:bg-accent/20 transition-colors"
      >
        <RefreshCw size={16} />
        <span className="hidden sm:inline">Actualiser</span>
      </button>
    </header>
  )
}
