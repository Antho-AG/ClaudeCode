import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_WIDGET_ORDER = ['todo', 'nba', 'turf', 'journal', 'football', 'mindmaps', 'autresSports']

export const useSettingsStore = create(
  persist(
    (set) => ({
      nbaFavoriteTeam: null,
      footballFavoriteTeams: [],
      weatherLocation: 'Paris',
      widgetOrder: DEFAULT_WIDGET_ORDER,
      widgetVisibility: Object.fromEntries(DEFAULT_WIDGET_ORDER.map((id) => [id, true])),

      setNbaFavoriteTeam: (team) => set({ nbaFavoriteTeam: team }),
      setFootballFavoriteTeams: (teams) => set({ footballFavoriteTeams: teams }),
      setWeatherLocation: (location) => set({ weatherLocation: location }),
      setWidgetOrder: (order) => set({ widgetOrder: order }),
      toggleWidgetVisibility: (id) =>
        set((state) => ({
          widgetVisibility: { ...state.widgetVisibility, [id]: !state.widgetVisibility[id] },
        })),
    }),
    { name: 'dashboard-settings' },
  ),
)
