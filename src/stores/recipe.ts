import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { Recipe } from '@/types/recipe'

const initialRecipe: Recipe[] = [{
    id: 'recipe-001',
    groupId: 'demo-group',
    name: '番茄炒蛋',
    category: '主菜',
    servings: 2,
    prepMinutes: 5,
    cookMinutes: 10,
    ingredients: [
        {
            name: '番茄',
            amount: 2,
            unit: '个',
        },
        {
            name: '蛋',
            amount: 3,
            unit: '个',
        },
        {
            name: '油',
            amount: 2,
            unit: '克',
        },
    ],
    steps: [
        { order: 1, description: '番茄洗净切块，鸡蛋打散。' },
        { order: 2, description: '热锅后倒入鸡蛋，炒至凝固后盛出。' },
        { order: 3, description: '锅中加入番茄翻炒，炒软后加入鸡蛋和盐。' },
        { order: 4, description: '翻炒均匀后出锅。' },
    ],
    tags: ['番茄', '蛋', '快手菜', '家常菜'],
    sourceText: '',
    status: 'confirmed',
    createdBy: 'demo-user',
    createdAt: Date.now(),
}]

export const useRecipeStore = defineStore('recipe', () => {
    const recipes = ref<Recipe[]>(initialRecipe)

    const recipeCount = computed(() => recipes.value.length)

    function addRecipe(recipe: Recipe) {
        recipes.value.unshift(recipe)
    }

    function getRecipeById(id: string) {
        return recipes.value.find(recipe => recipe.id === id)
    }

    return {
        recipes,
        recipeCount,
        addRecipe,
        getRecipeById,
    }
})