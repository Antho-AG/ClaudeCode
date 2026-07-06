export default function Card({ title, icon: Icon, children, className = '' }) {
  return (
    <section className={`bg-bg-card rounded-2xl p-4 flex flex-col gap-3 ${className}`}>
      {title && (
        <header className="flex items-center gap-2">
          {Icon && <Icon size={18} className="text-accent shrink-0" />}
          <h2 className="text-sm font-semibold text-text-primary tracking-wide">{title}</h2>
        </header>
      )}
      <div className="flex-1 min-h-0">{children}</div>
    </section>
  )
}
