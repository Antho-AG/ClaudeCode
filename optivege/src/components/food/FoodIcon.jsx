import { useState } from 'react'

export default function FoodIcon({ food, size = 48, className = '' }) {
  const [useSvg, setUseSvg] = useState(true)

  const px = typeof size === 'number' ? `${size}px` : size
  const emojiSize = size >= 64 ? 'text-6xl' : size >= 48 ? 'text-4xl' : 'text-3xl'

  if (!useSvg) {
    return <span className={`${emojiSize} ${className}`}>{food.emoji}</span>
  }

  return (
    <span className={`inline-flex items-center justify-center ${className}`} style={{ width: px, height: px }}>
      <img
        src={`/icons/${food.id}.svg`}
        alt={food.nom}
        width={size}
        height={size}
        style={{ width: px, height: px, objectFit: 'contain' }}
        onError={() => setUseSvg(false)}
      />
    </span>
  )
}
