import { ListTodo, NotebookPen, Brain } from 'lucide-react'
import Card from '../ui/Card'
import './DashboardGrid.css'

const PLACEHOLDER_WIDGETS = [
  { area: 'todo', title: 'To Do du jour', icon: ListTodo, phase: 'Phase 2' },
  { area: 'nba', title: '🏀 NBA', phase: 'Phase 4' },
  { area: 'turf', title: '🐎 Turf', phase: 'Phase 6' },
  { area: 'journal', title: 'Journal', icon: NotebookPen, phase: 'Phase 2' },
  { area: 'football', title: '⚽ Football', phase: 'Phase 5' },
  { area: 'mindmaps', title: 'Mes Mind Maps', icon: Brain, phase: 'Phase 3' },
  { area: 'autres', title: '🏆 Autres sports', phase: 'Phase 7' },
]

export default function DashboardGrid() {
  return (
    <div className="dashboard-grid p-4">
      {PLACEHOLDER_WIDGETS.map(({ area, title, icon, phase }) => (
        <Card key={area} title={title} icon={icon} className={`area-${area} min-h-32`}>
          <p className="text-text-secondary text-sm">Arrive en {phase}.</p>
        </Card>
      ))}
    </div>
  )
}
