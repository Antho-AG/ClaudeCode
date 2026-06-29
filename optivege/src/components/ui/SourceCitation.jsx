// Affiche une citation scientifique sourcée de façon uniforme
export default function SourceCitation({ source, compact = false }) {
  if (!source) return null

  const text = compact
    ? `${source.auteurs?.split(',')[0] || ''}, ${source.journal || ''}, ${source.annee || ''}`
    : `${source.auteurs || ''} « ${source.titre || ''} » — ${source.journal || ''}, ${source.annee || ''}`

  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
      <span>📚</span>
      {source.url ? (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-green-dark transition-colors"
          title={`${source.auteurs} — ${source.titre}`}
        >
          {text}
        </a>
      ) : (
        <span>{text}</span>
      )}
    </span>
  )
}
