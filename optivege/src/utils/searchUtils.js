// Normalise une chaîne pour la recherche insensible aux accents
export function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function matchesQuery(food, query) {
  const q = normalize(query)
  return (
    normalize(food.nom).includes(q) ||
    normalize(food.categorie).includes(q) ||
    food.tags?.some(t => normalize(t).includes(q)) ||
    food.bienfaits?.some(b => normalize(b.label).includes(q))
  )
}
