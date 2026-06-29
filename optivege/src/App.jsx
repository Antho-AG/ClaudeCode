import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import FoodSearchPage from './pages/FoodSearchPage'
import FoodDetailPage from './pages/FoodDetailPage'
import BenefitSearchPage from './pages/BenefitSearchPage'
import RecipesPage from './pages/RecipesPage'
import SuperAlimentsPage from './pages/SuperAlimentsPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-cream">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aliments" element={<FoodSearchPage />} />
            <Route path="/aliments/:id" element={<FoodDetailPage />} />
            <Route path="/bienfaits" element={<BenefitSearchPage />} />
            <Route path="/bienfaits/:id" element={<BenefitSearchPage />} />
            <Route path="/recettes" element={<RecipesPage />} />
            <Route path="/recettes/:id" element={<RecipesPage />} />
            <Route path="/super-aliments" element={<SuperAlimentsPage />} />
            <Route path="*" element={
              <div className="max-w-xl mx-auto px-4 py-20 text-center">
                <div className="text-5xl mb-4">🌿</div>
                <h2 className="font-heading text-2xl font-bold text-green-dark mb-2">Page introuvable</h2>
                <a href="/" className="btn-primary inline-block">Retour à l'accueil</a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
