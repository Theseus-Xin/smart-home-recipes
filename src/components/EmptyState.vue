<!-- src/components/EmptyState.vue -->
<script setup lang="ts">
defineProps<{
    title: string
    description?: string
}>()
</script>

<template>
    <view class="empty-state">
        <text class="title">{{ title }}</text>
        <text v-if="description" class="description">
            {{ description }}
        </text>
        <slot />
    </view>
</template>
