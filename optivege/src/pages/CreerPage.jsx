import useMeta from '../hooks/useMeta'
import { useSynergyBuilder, proteinSources } from '../hooks/useSynergyBuilder'
import SynergyScoreBar from '../components/builder/SynergyScoreBar'
import FoodPickerGrid from '../components/builder/FoodPickerGrid'
import SuggestionList from '../components/builder/SuggestionList'
import CreationCard from '../components/builder/CreationCard'

// Breadcrumb showing chosen foods
function Breadcrumb({ chosenFoods }) {
  if (chosenFoods.length === 0) return null
  return (
    <div className="flex items-center flex-wrap gap-2 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      {chosenFoods.map((f, i) => (
        <span key={f.id} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-300 text-sm">→</span>}
          <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: '#E8F7F2', color: '#0F6E56' }}>
            {f.emoji} {f.nom}
          </span>
        </span>
      ))}
    </div>
  )
}

export default function CreerPage() {
  useMeta({
    title: 'Constructeur de synergie alimentaire | Optivege',
    description: 'Construisez votre assiette synergie étape par étape. Chaque ajout débloque de nouvelles associations nutritionnelles documentées.',
  })

  const {
    chosenFoods, step, showResult,
    activeSynergies, score, suggestions,
    canFinish, maxReached,
    pickFood, finalize, reset,
    addToPlanner, copyCreation,
  } = useSynergyBuilder()

  const chosenIds = new Set(chosenFoods.map(f => f.id))

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-heading text-3xl text-green-dark">✨ Constructeur de synergie</h1>
        <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          Composez une assiette où chaque aliment amplifie les autres.
        </p>
      </div>

      {/* Score bar — always visible once started */}
      <SynergyScoreBar
        score={score}
        activeSynergies={activeSynergies}
        chosenFoods={chosenFoods}
      />

      {/* Breadcrumb */}
      <Breadcrumb chosenFoods={chosenFoods} />

      {/* ── Result ── */}
      {showResult ? (
        <CreationCard
          chosenFoods={chosenFoods}
          activeSynergies={activeSynergies}
          score={score}
          onReset={reset}
          onAddToPlanner={addToPlanner}
          onCopy={copyCreation}
        />
      ) : step === 0 ? (
        /* ── Step 1: pick protein ── */
        <div>
          <div className="mb-5">
            <h2 className="font-heading text-2xl text-green-dark">Par quoi tu commences ?</h2>
            <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Choisis ta source de protéines
            </p>
          </div>
          <FoodPickerGrid
            foods={proteinSources}
            onPick={pickFood}
            chosenIds={chosenIds}
          />
        </div>
      ) : (
        /* ── Steps 2–6: enrichment suggestions ── */
        <SuggestionList
          suggestions={suggestions}
          onPick={pickFood}
          stepNumber={step}
          canFinish={canFinish}
          onFinalize={finalize}
          maxReached={maxReached}
        />
      )}

      {/* Reset link when in progress */}
      {step > 0 && !showResult && (
        <button
          onClick={reset}
          className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          ↩ Tout recommencer
        </button>
      )}
    </div>
  )
}
