<script setup lang="ts">
import { computed, ref } from 'vue'
import { router } from '@/router'
import RecipeCard from '@/components/RecipeCard.vue'
import { useOrderStore } from '@/stores/order'
import { useRecipeStore } from '@/stores/recipe'
import type { Recipe } from '@/types/recipe'

const recipeStore = useRecipeStore()
const orderStore = useOrderStore()

const categories = ['全部', '早餐', '正餐', '甜品', '小吃', '饮品']
const activeCategory = ref('全部')
const showSelectedPanel = ref(false)

const filteredRecipes = computed(() => {
    if (activeCategory.value === '全部') {
        return recipeStore.recipes
    }

    return recipeStore.recipes.filter(
        (recipe) => (recipe.mealCategory || '正餐') === activeCategory.value,
    )
})

const selectedRecipes = computed(() => {
    return orderStore.selectedRecipeIds
        .map((id) => recipeStore.getRecipeById(id))
        .filter((recipe): recipe is Recipe => Boolean(recipe))
})

function toggleRecipe(recipe: Recipe) {
    const added = orderStore.toggleRecipe(recipe.id)

    uni.showToast({
        title: added ? `已添加${recipe.name}` : `已取消${recipe.name}`,
        icon: 'none',
    })
}

function removeSelected(recipe: Recipe) {
    orderStore.removeRecipe(recipe.id)
}

function submitOrder() {
    if (selectedRecipes.value.length === 0) {
        uni.showToast({
            title: '请先选择菜品',
            icon: 'none',
        })
        return
    }

    const submittedRecipes = [...selectedRecipes.value]

    submittedRecipes.forEach((recipe) => {
        recipeStore.incrementCookCount(recipe.id)
    })

    orderStore.clear()
    showSelectedPanel.value = false

    uni.showToast({
        title: '点菜已提交',
        icon: 'success',
    })

    setTimeout(() => {
        router.back()
    }, 300)
}
</script>

<template>
    <view class="page">
        <view class="page-intro">
            <text class="page-title">今天想吃什么？</text>
            <text class="page-desc">选择喜欢的菜品，提交后会记录制作次数</text>
        </view>

        <scroll-view class="category-scroll" scroll-x>
            <view class="category-list">
                <view v-for="category in categories" :key="category" class="category-item"
                    :class="{ active: activeCategory === category }" @click="activeCategory = category">
                    {{ category }}
                </view>
            </view>
        </scroll-view>

        <view v-if="filteredRecipes.length" class="recipe-grid">
            <view v-for="recipe in filteredRecipes" :key="recipe.id" class="recipe-item">
                <RecipeCard :recipe="recipe" selectable :selected="orderStore.isSelected(recipe.id)"
                    @action="toggleRecipe(recipe)" />
            </view>
        </view>

        <view v-else class="empty-state">
            <text class="empty-title">这个分类还没有菜品</text>
            <text class="empty-desc">可以先返回菜谱列表添加菜品</text>
        </view>

        <view class="bottom-bar">
            <view class="selected-trigger" @click="showSelectedPanel = true">
                <view class="selected-icon">☷</view>
                <view class="selected-texts">
                    <text class="selected-title">已点菜品</text>
                    <text class="selected-count">{{ orderStore.count }} 道</text>
                </view>
                <text class="selected-arrow">›</text>
            </view>

            <button class="submit-button" :disabled="orderStore.count === 0" @click="submitOrder">
                提交点菜
            </button>
        </view>

        <view v-if="showSelectedPanel" class="modal-mask" @click="showSelectedPanel = false">
            <view class="selected-panel" @click.stop>
                <view class="panel-header">
                    <text class="panel-title">已点菜品（{{ orderStore.count }}）</text>
                    <text class="panel-close" @click="showSelectedPanel = false">
                        关闭
                    </text>
                </view>

                <scroll-view v-if="selectedRecipes.length" class="selected-list" scroll-y>
                    <view v-for="recipe in selectedRecipes" :key="recipe.id" class="selected-row">
                        <view class="selected-recipe-info">
                            <text class="selected-recipe-name">{{ recipe.name }}</text>
                            <text class="selected-recipe-meta">
                                {{ recipe.mealCategory || '正餐' }}
                                · {{ recipe.cookMinutes || 0 }} 分钟
                            </text>
                        </view>

                        <text class="remove-button" @click="removeSelected(recipe)">
                            取消
                        </text>
                    </view>
                </scroll-view>

                <view v-else class="panel-empty">
                    还没有选择菜品
                </view>

                <button class="panel-submit" :disabled="orderStore.count === 0" @click="submitOrder">
                    提交 {{ orderStore.count }} 道菜
                </button>
            </view>
        </view>
    </view>
</template>

<style scoped>
.page {
    min-height: 100vh;
    padding: 28rpx 28rpx 150rpx;
    box-sizing: border-box;
    background: #f7f7f7;
}

.page-intro {
    padding: 12rpx 4rpx 26rpx;
}

.page-title {
    display: block;
    color: #222;
    font-size: 38rpx;
    font-weight: 700;
}

.page-desc {
    display: block;
    margin-top: 10rpx;
    color: #888;
    font-size: 24rpx;
}

.category-scroll {
    width: 100%;
    margin-bottom: 22rpx;
    white-space: nowrap;
}

.category-list {
    display: inline-flex;
    gap: 14rpx;
}

.category-item {
    padding: 14rpx 24rpx;
    color: #777;
    background: #fff;
    border-radius: 30rpx;
    font-size: 25rpx;
}

.category-item.active {
    color: #fff;
    background: #38a878;
}

.recipe-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20rpx 0;
}

.recipe-item {
    width: calc(50% - 10rpx);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 150rpx 20rpx;
    color: #999;
}

.empty-title {
    color: #666;
    font-size: 28rpx;
}

.empty-desc {
    margin-top: 14rpx;
    font-size: 23rpx;
}

.bottom-bar {
    position: fixed;
    z-index: 5;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    gap: 20rpx;
    padding: 18rpx 28rpx calc(18rpx + env(safe-area-inset-bottom));
    background: #fff;
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.selected-trigger {
    display: flex;
    flex: 1;
    align-items: center;
    min-width: 0;
}

.selected-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64rpx;
    height: 64rpx;
    color: #38a878;
    background: #e9f5ef;
    border-radius: 50%;
    font-size: 34rpx;
}

.selected-texts {
    display: flex;
    flex-direction: column;
    margin-left: 14rpx;
}

.selected-title {
    color: #333;
    font-size: 25rpx;
}

.selected-count {
    margin-top: 4rpx;
    color: #888;
    font-size: 21rpx;
}

.selected-arrow {
    margin-left: 10rpx;
    color: #aaa;
    font-size: 38rpx;
}

.submit-button,
.panel-submit {
    width: 240rpx;
    height: 76rpx;
    margin: 0;
    color: #fff;
    background: #38a878;
    border-radius: 40rpx;
    font-size: 27rpx;
    line-height: 76rpx;
}

.submit-button[disabled],
.panel-submit[disabled] {
    background: #b8d4c5;
}

.submit-button::after,
.panel-submit::after {
    border: none;
}

.modal-mask {
    position: fixed;
    z-index: 10;
    inset: 0;
    display: flex;
    align-items: flex-end;
    background: rgba(0, 0, 0, 0.42);
}

.selected-panel {
    width: 100%;
    max-height: 75vh;
    padding: 28rpx;
    box-sizing: border-box;
    background: #fff;
    border-radius: 26rpx 26rpx 0 0;
    padding-bottom: calc(28rpx + env(safe-area-inset-bottom));
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #eee;
}

.panel-title {
    color: #222;
    font-size: 30rpx;
    font-weight: 600;
}

.panel-close {
    color: #888;
    font-size: 24rpx;
}

.selected-list {
    max-height: 48vh;
}

.selected-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 4rpx;
    border-bottom: 1rpx solid #f2f2f2;
}

.selected-recipe-info {
    display: flex;
    flex-direction: column;
}

.selected-recipe-name {
    color: #333;
    font-size: 27rpx;
}

.selected-recipe-meta {
    margin-top: 8rpx;
    color: #999;
    font-size: 22rpx;
}

.remove-button {
    padding: 10rpx 18rpx;
    color: #dc705e;
    background: #fff2ef;
    border-radius: 24rpx;
    font-size: 23rpx;
}

.panel-empty {
    padding: 50rpx 0;
    color: #999;
    text-align: center;
    font-size: 25rpx;
}

.panel-submit {
    width: 100%;
    margin-top: 22rpx;
}
</style>
