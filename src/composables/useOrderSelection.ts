// src/composables/useOrderSelection.ts
import { computed } from 'vue'
import { useOrderStore } from '@/stores/order'
import { useRecipeStore } from '@/stores/recipe'

export function useOrderSelection() {
    const orderStore = useOrderStore()
    const recipeStore = useRecipeStore()

    const selectedRecipes = computed(() =>
        orderStore.selectedRecipeIds
            .map((id) => recipeStore.getRecipeById(id))
            .filter((recipe) => recipe !== undefined),
    )

    function toggle(recipeId: string) {
        return orderStore.toggleRecipe(recipeId)
    }

    function submit() {
        if (selectedRecipes.value.length === 0) {
            return { ok: false as const, message: '请先选择菜品' }
        }

        selectedRecipes.value.forEach((recipe) => {
            recipeStore.incrementCookCount(recipe.id)
        })

        orderStore.clear()

        return { ok: true as const }
    }

    return {
        selectedRecipes,
        count: computed(() => orderStore.count),
        toggle,
        submit,
    }
}
