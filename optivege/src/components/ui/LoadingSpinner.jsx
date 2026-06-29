export default function LoadingSpinner({ label = 'Chargement...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-green-main">
      <div className="w-10 h-10 border-4 border-green-pale border-t-green-main rounded-full animate-spin" />
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  )
}
