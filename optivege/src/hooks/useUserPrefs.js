// TODO: Connecter au système d'authentification — Phase 2

// Stub de hook pour les préférences utilisateur
// Ces fonctions seront connectées à un backend d'auth en Phase 2

export function useUserPrefs() {
  // TODO: Phase 2 — remplacer par un contexte Auth
  return {
    isAuthenticated: false,
    saveToFavorites: (_itemId, _type) => {
      // TODO: POST /api/favorites
    },
    getFavorites: () => {
      // TODO: GET /api/favorites
      return []
    },
    saveSearchHistory: (_query) => {
      // TODO: POST /api/search-history
    },
    getUserPreferences: () => {
      // TODO: GET /api/user/preferences
      return {}
    },
  }
}
