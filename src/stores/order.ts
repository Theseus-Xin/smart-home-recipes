import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', () => {
    // 当前暂存的点菜菜品 ID，同一道菜只选一次
    const selectedRecipeIds = ref<string[]>([])

    const count = computed(() => selectedRecipeIds.value.length)

    function isSelected(recipeId: string) {
        return selectedRecipeIds.value.includes(recipeId)
    }

    function toggleRecipe(recipeId: string) {
        if (isSelected(recipeId)) {
            selectedRecipeIds.value = selectedRecipeIds.value.filter(
                (id) => id !== recipeId,
            )
            return false
        }

        selectedRecipeIds.value.push(recipeId)
        return true
    }

    function removeRecipe(recipeId: string) {
        selectedRecipeIds.value = selectedRecipeIds.value.filter(
            (id) => id !== recipeId,
        )
    }

    function clear() {
        selectedRecipeIds.value = []
    }

    return {
        selectedRecipeIds,
        count,
        isSelected,
        toggleRecipe,
        removeRecipe,
        clear,
    }
})
