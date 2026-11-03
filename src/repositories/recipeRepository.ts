// src/repositories/recipeRepository.ts
import type { Recipe } from '@/types/recipe'

const STORAGE_KEY = 'recipes'

export function getRecipes(): Recipe[] {
    try {
        return uni.getStorageSync(STORAGE_KEY) || []
    } catch {
        return []
    }
}

export function saveRecipes(recipes: Recipe[]) {
    uni.setStorageSync(STORAGE_KEY, recipes)
}
