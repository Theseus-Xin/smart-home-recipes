<template>
  <view class="page">
    <view class="header">
      <text class="title">今天吃什么？</text>
      <text class="subtitle">已收录{{ recipeStore.recipeCount }} 道家常菜</text>
    </view>

    <view class="actions">
      <button class="action-button" @click="goToAddRecipe">添加菜谱</button>
      <button class="action-button" @click="showComingSoon">开始点菜</button>
    </view>

    <view class="section-title"> 菜谱列表 </view>

    <view class="recipe-grid">
      <view v-for="recipe in recipes" :key="recipe.id" class="recipe-card">
        <image v-if="recipe.coverImage" class="recipe-cover" :src="recipe.coverImage" mode="aspectFill" />

        <view v-else class="recipe-cover recipe-cover-placeholder">
          <text>暂无封面</text>
        </view>

        <view class="recipe-info">
          <text class="recipe-name">{{ recipe.name }}</text>
          <text class="recipe-category">
            {{ recipe.category || '家常菜' }}
          </text>

          <view class="recipe-meta">
            <text>{{ recipe.cookMinutes || 0 }} 分钟</text>
            <text>制作 {{ recipe.cookCount || 0 }} 次</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRecipeStore } from '@/stores/recipe'

const recipeStore = useRecipeStore()

const recipes = computed(() => recipeStore.recipes)

function showComingSoon() {
  uni.showToast({
    title: '功能暂未开放',
    icon: 'none'
  })
}

function goToAddRecipe() {
  uni.navigateTo({
    url: '/pages/add-recipe/index',
  })
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
}

.recipe-card {
  overflow: hidden;
  width: calc(50% - 10rpx);
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 18rpx;
}

.recipe-cover {
  display: block;
  width: 100%;
  height: 220rpx;
}

.recipe-cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  background: #e9eee9;
  font-size: 24rpx;
}

.recipe-info {
  padding: 18rpx;
}

.recipe-name {
  display: block;
  overflow: hidden;
  color: #222;
  font-size: 28rpx;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recipe-category {
  display: inline-block;
  margin-top: 12rpx;
  padding: 5rpx 12rpx;
  color: #39966d;
  background: #eaf6ef;
  border-radius: 20rpx;
  font-size: 21rpx;
}

.recipe-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 16rpx;
  color: #999;
  font-size: 21rpx;
}
</style>
