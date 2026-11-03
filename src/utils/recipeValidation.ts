// src/utils/recipeValidation.ts
import type { RecipeStep } from '@/types/recipe'

export interface RecipeFormData {
    name: string
    mealCategory: string
    steps: RecipeStep[]
}

export function validateRecipeForm(data: RecipeFormData): string | null {
    if (!data.name.trim()) return '请输入菜名'
    if (!data.mealCategory.trim()) return '请选择菜品分类'

    const hasValidStep = data.steps.some((step) => step.description.trim())
    if (!hasValidStep) return '请至少填写一个制作步骤'

    return null
}
