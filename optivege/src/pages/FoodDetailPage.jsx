import { useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import FoodDetail from '../components/food/FoodDetail'
import AlimentShareCard from '../components/food/AlimentShareCard'
import { useFood } from '../hooks/useFoodData'
import useMeta from '../hooks/useMeta'

export default function FoodDetailPage() {
  const { id } = useParams()
  const food = useFood(id)
  const cardRef = useRef(null)
  const [generating, setGenerating] = useState(false)

  useMeta({
    title: food ? `${food.nom} : teneurs, synergies et associations | Optivege` : 'Optivege',
    description: food ? `Découvrez les bienfaits nutritionnels de ${food.nom}, ses synergies alimentaires documentées et les meilleures associations pour maximiser ses apports.` : undefined,
  })

  async function handleGenerateImage() {
    if (!cardRef.current || generating) return
    setGenerating(true)
    try {
      // Rendre visible pour la capture (opacity:0 génère du noir avec html2canvas)
      cardRef.current.style.left = '0'
      cardRef.current.style.position = 'fixed'
      cardRef.current.style.top = '0'
      cardRef.current.style.zIndex = '9999'

      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        width: 1080,
        height: 1350,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      })

      // Remettre hors écran
      cardRef.current.style.left = '-9999px'
      cardRef.current.style.position = 'absolute'
      cardRef.current.style.zIndex = ''

      const slug = food.nom.toLowerCase().replace(/\s+/g, '-')
      const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent)
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      const file = new File([blob], `optivege-${slug}.png`, { type: 'image/png' })
      const canShareFiles = navigator.canShare?.({ files: [file] })

      if (isMobile && canShareFiles) {
        try {
          await navigator.share({
            files: [file],
            title: `${food.nom} — OptiVégé`,
            url: window.location.href,
          })
        } catch {
          // L'utilisateur a annulé le panneau natif — rien à faire
        }
      } else {
        const link = document.createElement('a')
        link.download = `${slug}-optivege.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
    } catch (e) {
      console.error('Erreur génération image:', e)
    } finally {
      setGenerating(false)
    }
  }

  if (!food) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🌿</div>
        <h2 className="font-heading text-2xl font-bold text-green-dark mb-2">Aliment introuvable</h2>
        <p className="text-gray-600 mb-6">L'aliment "{id}" n'existe pas dans notre base de données.</p>
        <Link to="/aliments" className="btn-primary">← Retour à la recherche</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-green-bg border-b border-green-pale py-3 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/aliments" className="text-sm text-green-dark hover:text-green-mid font-medium">
            ← Retour aux aliments
          </Link>
          <button
            onClick={handleGenerateImage}
            disabled={generating}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors"
            style={{ borderColor: '#1D9E75', color: generating ? '#999' : '#1D9E75' }}
          >
            {generating ? '⏳ Génération…' : '📤 Partager cet aliment'}
          </button>
        </div>
      </div>

      <FoodDetail food={food} />

      {/* Carte cachée pour la capture */}
      <AlimentShareCard ref={cardRef} food={food} />
    </div>
  )
}
