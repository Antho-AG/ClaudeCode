const TIMEZONE = 'Europe/Paris'

export function formatDateFR(date = new Date()) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TIMEZONE,
  }).format(date)
}

export function formatTimeFR(date = new Date()) {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: TIMEZONE,
  }).format(date)
}

export function getGreeting(date = new Date()) {
  const parts = new Intl.DateTimeFormat('fr-FR', { hour: 'numeric', hour12: false, timeZone: TIMEZONE }).formatToParts(
    date,
  )
  const hour = Number(parts.find((p) => p.type === 'hour').value)

  if (hour >= 6 && hour < 12) return 'Bonjour 🌅'
  if (hour >= 12 && hour < 18) return 'Bon après-midi ☀️'
  if (hour >= 18 && hour < 22) return 'Bonne soirée 🌙'
  return 'Bonne nuit 🌟'
}

export function todayISO(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE }).formatToParts(date)
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]))
  return `${map.year}-${map.month}-${map.day}`
}
