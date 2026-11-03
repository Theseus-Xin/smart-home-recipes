<template>
  <view class="page">
    <view class="header">
      <text class="title">今天吃什么？</text>
      <text class="subtitle">已收录{{ recipeStore.recipeCount }} 道家常菜</text>
    </view>

    <view class="actions">
      <button class="action-button" @click="goToAddRecipe">添加菜谱</button>
      <button class="action-button" @click="goToOrderMenu">开始点菜</button>
    </view>

    <view class="section-title"> 菜谱列表 </view>

    <view class="recipe-grid">
      <view v-for="recipe in recipes" :key="recipe.id" class="recipe-item">
        <RecipeCard :recipe="recipe" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { router } from '@/router'
import { useRecipeStore } from '@/stores/recipe'
import RecipeCard from '@/components/RecipeCard.vue'

const recipeStore = useRecipeStore()

const recipes = computed(() => recipeStore.recipes)

function goToAddRecipe() {
  router.push({ name: 'addRecipe' })
}

function goToOrderMenu() {
  router.push({ name: 'orderMenu' })
}
</script>

<style>
.page {
  min-height: 100vh;
  padding: 32rpx;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.header {
  padding: 28rpx 8rpx 36rpx;
}

.title {
  display: block;
  color: #222;
  font-size: 44rpx;
  font-weight: 700;
}

.subtitle {
  display: block;
  margin-top: 12rpx;
  color: #888;
  font-size: 26rpx;
}

.actions {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.action-button {
  flex: 1;
  margin: 0;
  color: #fff;
  background: #37a875;
  border-radius: 16rpx;
  font-size: 28rpx;
}

.action-button::after {
  border: none;
}

.action-button.secondary {
  color: #37a875;
  background: #e8f5ef;
}

.section-title {
  margin: 0 0 20rpx 8rpx;
  color: #333;
  font-size: 30rpx;
  font-weight: 600;
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
</style>
