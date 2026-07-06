import { Home, ListTodo, Brain, Trophy, Settings } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: Home, end: true },
  { to: '/todo', label: 'To Do', icon: ListTodo },
  { to: '/mindmaps', label: 'Mind Maps', icon: Brain },
  { to: '/sport', label: 'Sport', icon: Trophy },
  { to: '/settings', label: 'Réglages', icon: Settings },
]
