export function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Simple Levenshtein distance — capped early for performance
function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 3) return 99
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[a.length][b.length]
}

// Fuzzy match: query token appears in or is close to any word of the target
function fuzzyMatch(target, queryToken) {
  if (target.includes(queryToken)) return true
  // Only apply fuzzy for tokens long enough to avoid false positives
  if (queryToken.length < 4) return false
  const words = target.split(/\s+/)
  return words.some(w => levenshtein(queryToken, w) <= (queryToken.length <= 5 ? 1 : 2))
}

// All searchable text fields for a food, normalised
function foodTokens(food) {
  return [
    food.nom,
    food.categorie,
    ...(food.tags || []),
    ...(food.bienfaits?.map(b => b.label) || []),
    food.description || '',
  ].map(normalize)
}

export function matchesQuery(food, query) {
  const q = normalize(query.trim())
  if (!q) return true

  const tokens = foodTokens(food)
  const queryTokens = q.split(/\s+/).filter(Boolean)

  // Every query token must match at least one field (fuzzy)
  return queryTokens.every(qt =>
    tokens.some(field => fuzzyMatch(field, qt))
  )
}
