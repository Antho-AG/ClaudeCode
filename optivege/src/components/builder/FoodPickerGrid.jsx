import { useState } from 'react'

function FoodPickCard({ food, onClick, selected }) {
  const [imgErr, setImgErr] = useState(false)
  const protVal = food.teneurs?.proteines?.valeur

  return (
    <button
      onClick={() => onClick(food)}
      disabled={selected}
      className="card text-left transition-all duration-200 flex flex-col items-center gap-2 p-4"
      style={{
        cursor: selected ? 'default' : 'pointer',
        border: selected ? '2px solid #1D9E75' : '2px solid transparent',
        opacity: selected ? 0.5 : 1,
        transform: 'scale(1)',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.transform = 'scale(1.03)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center">
        {!imgErr ? (
          <img
            src={`/icons/${food.id}.svg`}
            alt={food.nom}
            width={48} height={48}
            style={{ objectFit: 'contain' }}
            onError={() => setImgErr(true)}
          />
        ) : (
          <span className="text-3xl">{food.emoji}</span>
        )}
      </div>

      {/* Name */}
      <p className="text-center text-sm font-semibold text-green-dark leading-tight"
        style={{ fontFamily: 'Inter, sans-serif' }}>
        {food.nom}
      </p>

      {/* Protein content */}
      {protVal && (
        <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
          {protVal}g prot.
        </p>
      )}
    </button>
  )
}

export default function FoodPickerGrid({ foods, onPick, chosenIds = new Set() }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {foods.map(food => (
        <FoodPickCard
          key={food.id}
          food={food}
          onClick={onPick}
          selected={chosenIds.has(food.id)}
        />
      ))}
    </div>
  )
}
