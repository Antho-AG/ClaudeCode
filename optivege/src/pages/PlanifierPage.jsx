import { useState } from 'react'
import useMeta from '../hooks/useMeta'
import { usePlanner } from '../hooks/usePlanner'
import PlannerParams from '../components/planner/PlannerParams'
import AutoSelector from '../components/planner/AutoSelector'
import ManualSelector from '../components/planner/ManualSelector'
import ShoppingList from '../components/planner/ShoppingList'

export default function PlanifierPage() {
  const [showMobileList, setShowMobileList] = useState(false)

  useMeta({
    title: 'Planificateur de repas végétaux avec synergies | Optivege',
    description: 'Planifiez vos repas végétaux de la semaine avec synergies nutritionnelles documentées et générez votre liste de courses automatiquement.',
  })

  const {
    nbRepas, setNbRepas,
    nbPersonnes, setNbPersonnes,
    mode, setMode,
    selectedRecipes,
    generateAuto,
    replaceRecipe,
    addRecipe,
    removeRecipe,
    checkedItems,
    toggleItem,
    shoppingList,
    totalItems,
    reset,
  } = usePlanner()

  const shoppingPanel = (
    <div className="card sticky top-24" style={{ maxHeight: 'calc(100vh - 8rem)', overflowY: 'auto' }}>
      <ShoppingList
        groups={shoppingList}
        totalItems={totalItems}
        checkedItems={checkedItems}
        onToggle={toggleItem}
        nbRepas={nbRepas}
        nbPersonnes={nbPersonnes}
      />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl text-green-dark">🗓️ Planificateur de repas</h1>
          <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Composez votre semaine et générez votre liste de courses automatiquement.
          </p>
        </div>
        <button
          onClick={reset}
          className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1 mt-1"
          style={{ fontFamily: 'Inter, sans-serif' }}
          title="Réinitialiser le planificateur"
        >
          🗑️ Réinitialiser
        </button>
      </div>

      {/* Params — always visible */}
      <div className="mb-6">
        <PlannerParams
          nbRepas={nbRepas} setNbRepas={setNbRepas}
          nbPersonnes={nbPersonnes} setNbPersonnes={setNbPersonnes}
          mode={mode} setMode={setMode}
        />
      </div>

      {/* Two-column layout on desktop */}
      <div className="flex gap-6 items-start">
        {/* Left column: recipe selector */}
        <div className="flex-1 min-w-0">
          <div className="card">
            {mode === 'auto' ? (
              <AutoSelector
                nbRepas={nbRepas}
                selectedRecipes={selectedRecipes}
                onGenerate={generateAuto}
                onReplace={replaceRecipe}
                onRemove={removeRecipe}
              />
            ) : (
              <ManualSelector
                nbRepas={nbRepas}
                selectedRecipes={selectedRecipes}
                onAdd={addRecipe}
                onRemove={removeRecipe}
              />
            )}
          </div>
        </div>

        {/* Right column: shopping list (desktop only) */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          {shoppingPanel}
        </div>
      </div>

      {/* Mobile: shopping list in modal-like bottom sheet */}
      {showMobileList && (
        <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowMobileList(false)} />
          <div className="relative bg-white rounded-t-3xl px-4 pt-5 pb-8 max-h-[80vh] overflow-y-auto" style={{ zIndex: 50 }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-heading text-lg text-green-dark">🛒 Liste de courses</span>
              <button onClick={() => setShowMobileList(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <ShoppingList
              groups={shoppingList}
              totalItems={totalItems}
              checkedItems={checkedItems}
              onToggle={toggleItem}
              nbRepas={nbRepas}
              nbPersonnes={nbPersonnes}
            />
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      <div className="lg:hidden fixed bottom-6 right-4 z-30">
        <button
          onClick={() => setShowMobileList(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-lg"
          style={{ background: 'linear-gradient(135deg, #0F6E56 0%, #1D9E75 100%)', fontFamily: 'Inter, sans-serif' }}
        >
          🛒 Voir la liste
          {totalItems > 0 && (
            <span className="bg-white text-green-dark rounded-full px-2 py-0.5 text-xs font-bold">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
