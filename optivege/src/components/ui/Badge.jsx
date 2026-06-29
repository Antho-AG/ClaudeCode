// Badge réutilisable pour bienfaits, catégories, synergies
const VARIANTS = {
  green: 'bg-green-pale text-green-dark',
  orange: 'bg-orange-100 text-orange-dark',
  blue: 'bg-blue-50 text-blue-700',
  gray: 'bg-gray-100 text-gray-600',
}

export default function Badge({ label, emoji, variant = 'green' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${VARIANTS[variant]}`}>
      {emoji && <span>{emoji}</span>}
      {label}
    </span>
  )
}
