<script setup lang="ts">
import type { Recipe } from '@/types/recipe'

withDefaults(
    defineProps<{
        recipe: Recipe
        selectable?: boolean
        selected?: boolean
    }>(),
    {
        selectable: false,
        selected: false,
    },
)

const emit = defineEmits<{
    action: []
    cardClick: []
}>()
</script>

<template>
    <view class="recipe-card" @click="emit('cardClick')">
        <image v-if="recipe.coverImage" class="recipe-cover" :src="recipe.coverImage" mode="aspectFill" />

        <view v-else class="recipe-cover recipe-cover-placeholder">
            <text>暂无封面</text>
        </view>

        <view class="recipe-info">
            <text class="recipe-name">{{ recipe.name }}</text>

            <view class="recipe-tags">
                <text class="recipe-tag">
                    {{ recipe.mealCategory || '正餐' }}
                </text>
                <text v-if="recipe.category" class="recipe-tag cuisine-tag">
                    {{ recipe.category }}
                </text>
            </view>

            <view class="recipe-meta">
                <text>{{ recipe.cookMinutes || 0 }} 分钟</text>
                <text>制作 {{ recipe.cookCount || 0 }} 次</text>
            </view>

            <button v-if="selectable" class="select-button" :class="{ selected }" @click.stop="emit('action')">
                <text>{{ selected ? '✓ 已点，点击取消' : '＋ 点这道菜' }}</text>
            </button>
        </view>
    </view>
</template>

<style scoped>
.recipe-card {
    overflow: hidden;
    width: 100%;
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

.recipe-tags {
    display: flex;
    gap: 10rpx;
    margin-top: 12rpx;
}

.recipe-tag {
    padding: 5rpx 12rpx;
    color: #39966d;
    background: #eaf6ef;
    border-radius: 20rpx;
    font-size: 21rpx;
}

.cuisine-tag {
    color: #888;
    background: #f3f3f3;
}

.recipe-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 16rpx;
    color: #999;
    font-size: 21rpx;
}

.select-button {
    height: 64rpx;
    margin: 18rpx 0 0;
    color: #fff;
    background: #38a878;
    border-radius: 12rpx;
    font-size: 24rpx;
    line-height: 64rpx;
}

.select-button.selected {
    color: #39966d;
    background: #e9f5ef;
}

.select-button::after {
    border: none;
}
</style>
