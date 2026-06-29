import foodsData from '../data/foods.json'
import benefitsData from '../data/benefits.json'
import recipesData from '../data/recipes.json'

export function useFood(id) {
  return foodsData.find(f => f.id === id) || null
}

export function useBenefit(id) {
  return benefitsData.find(b => b.id === id) || null
}

export function useRecipe(id) {
  return recipesData.find(r => r.id === id) || null
}

export function useFoodsByBenefit(benefitId) {
  const benefit = benefitsData.find(b => b.id === benefitId)
  if (!benefit) return []
  return benefit.aliments_top
    .map(id => foodsData.find(f => f.id === id))
    .filter(Boolean)
}

export function useAllFoods() {
  return foodsData
}

export function useAllRecipes() {
  return recipesData
}

export function useAllBenefits() {
  return benefitsData
}
