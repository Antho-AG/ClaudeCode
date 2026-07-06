import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import BottomNav from './components/layout/BottomNav'
import Dashboard from './pages/Dashboard'
import TodoPage from './pages/TodoPage'
import MindMapPage from './pages/MindMapPage'
import SportPage from './pages/SportPage'
import SettingsPage from './pages/SettingsPage'

function handleRefreshAll() {
  window.dispatchEvent(new Event('dashboard:refresh-all'))
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-full min-h-screen bg-bg-primary">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Header onRefreshAll={handleRefreshAll} />
          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/todo" element={<TodoPage />} />
              <Route path="/mindmaps" element={<MindMapPage />} />
              <Route path="/sport" element={<SportPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
