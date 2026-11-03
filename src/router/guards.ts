import { router } from './index'
import { useRecipeStore } from '@/stores/recipe'

export function installNavigationGuards() {
    router.beforeEach((to) => {
        if (to.name === 'orderMenu') {
            const recipeStore = useRecipeStore()

            if (recipeStore.recipes.length === 0) {
                uni.showToast({
                    title: '请先添加菜谱',
                    icon: 'none',
                })

                return false
            }
        }

        return true
    })
}
