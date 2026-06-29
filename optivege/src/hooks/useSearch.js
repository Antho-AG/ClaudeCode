import { useState, useMemo } from 'react'
import foodsData from '../data/foods.json'

// Hook de recherche floue sur les aliments par nom, catégorie ou bienfait
export function useFoodSearch(query) {
  return useMemo(() => {
    if (!query || query.trim().length < 2) return []
    const q = query.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    return foodsData.filter(food => {
      const name = food.nom.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      const cat = food.categorie.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      const tags = food.tags?.join(' ').toLowerCase() || ''
      return name.includes(q) || cat.includes(q) || tags.includes(q)
    })
  }, [query])
}

export function useSearchState() {
  const [query, setQuery] = useState('')
  return { query, setQuery }
}
