<template>
    <view class="page">
        <view class="intro">
            <text class="page-title">把你的家常做法记下来</text>
            <text class="page-desc">先输入菜名、食材或做法，生成后可以继续修改</text>
        </view>

        <view class="card">
            <view class="section-heading">
                <text class="section-title">菜谱内容</text>
                <text class="required-label">必填</text>
            </view>

            <textarea v-model="sourceText" class="source-input" maxlength="3000"
                placeholder="例如：番茄炒蛋。番茄切块，鸡蛋打散，先炒鸡蛋，再炒番茄，最后放回鸡蛋并加盐调味。" placeholder-class="placeholder">
            </textarea>

            <view class="media-placeholder" @click="showComingSoon">
                <text class="media-icon">＋</text>
                <text class="media-title">添加图片或视频</text>
                <text class="media-desc">后续支持用图片、视频辅助整理菜谱</text>
            </view>

        </view>

        <button class="generate-button" :disabled="!canGenerate" @click="generateRecipe">
            生成菜谱
        </button>

        <view v-if="generated" class="result-section">
            <view class="result-heading">
                <text class="section-title">生成结果</text>
                <text class="result-tip">请检查并修改后保存</text>
            </view>

            <view class="card">
                <view class="field">
                    <text class="field-label">封面图</text>
                    <view class="cover-picker" @click="chooseCover">
                        <image v-if="coverImage" class="cover-image" :src="coverImage" mode="aspectFill" />
                        <view v-else class="cover-empty">
                            <text class="cover-plus">＋</text>
                            <text>添加封面图</text>
                        </view>
                    </view>
                </view>

                <view class="field">
                    <text class="field-label">菜名</text>
                    <input v-model="recipeName" class="text-input" maxlength="30" placeholder="请输入菜名" />
                </view>

                <view class="field">
                    <text class="field-label">菜系</text>
                    <input v-model="cuisine" class="text-input" maxlength="20" placeholder="例如：川菜、家常菜" />
                    <text class="field-hint">识别结果可能不准确，可以直接修改</text>
                </view>

                <view class="field">
                    <text class="field-label">菜品分类</text>

                    <picker mode="selector" :range="mealCategories" :value="mealCategoryIndex"
                        @change="onMealCategoryChange">
                        <view class="picker-input">
                            <text>{{ mealCategory }}</text>
                            <text class="picker-arrow">›</text>
                        </view>
                    </picker>

                    <text class="field-hint">
                        已根据内容初步识别，可点击修改
                    </text>
                </view>

                <view class="field">
                    <text class="field-label">烹饪时间</text>
                    <view class="minutes-input">
                        <input v-model="cookMinutes" class="text-input" type="number" placeholder="30" />
                        <text class="minutes-unit">分钟</text>
                    </view>
                </view>
            </view>

            <view class="steps-heading">
                <text class="section-title">制作步骤</text>
                <text class="result-tip">每一步都可以编辑</text>
            </view>

            <view v-for="(step, index) in steps" :key="index" class="step-card">
                <view class="step-top">
                    <text class="step-number">步骤 {{ index + 1 }}</text>
                    <text class="delete-step" @click="removeStep(index)">删除</text>
                </view>

                <textarea v-model="step.description" class="step-input" maxlength="500" placeholder="请输入这一步的制作方法"
                    placeholder-class="placeholder" />
            </view>

            <button class="add-step-button" @click="addStep">
                ＋ 添加一步
            </button>

            <button class="save-button" @click="saveRecipe">
                确认无误，保存菜谱
            </button>
        </view>

    </view>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRecipeStore } from '@/stores/recipe'
import type { Recipe, RecipeStep, MealCategory } from '@/types/recipe'

const recipeStore = useRecipeStore()

const sourceText = ref('')
const generated = ref(false)

const recipeName = ref('')
const cuisine = ref('')
const mealCategories: MealCategory[] = [
    '早餐',
    '正餐',
    '甜品',
    '小吃',
    '饮品',
]

const mealCategory = ref<MealCategory>('正餐')
const mealCategoryIndex = computed(() =>
    mealCategories.indexOf(mealCategory.value),
)

const cookMinutes = ref(30)
const coverImage = ref('')
const steps = ref<RecipeStep[]>([])

const canGenerate = computed(() => sourceText.value.trim().length > 0)


function onMealCategoryChange(event: {
    detail: { value: string | number }
}) {
    const index = Number(event.detail.value)
    mealCategory.value = mealCategories[index] || '正餐'
}

function detectCuisine(text: string): string {
    if (/川菜|川味|麻辣|花椒|豆瓣酱/.test(text)) return '川菜'
    if (/粤菜|广式|蒸鱼|蚝油|白灼/.test(text)) return '粤菜'
    if (/湘菜|湖南|剁椒|小炒肉/.test(text)) return '湘菜'
    if (/东北|锅包肉|地三鲜|酸菜/.test(text)) return '东北菜'
    if (/日式|寿司|味噌|照烧/.test(text)) return '日式'
    if (/韩式|韩国|泡菜|韩式辣酱/.test(text)) return '韩式'
    return '家常菜'
}

function detectMealCategory(text: string): MealCategory {
    if (/甜品|蛋糕|布丁|冰淇淋|糖水|甜汤/.test(text)) return '甜品'
    if (/早餐|早饭|粥|豆浆|包子|馒头|煎饼|三明治/.test(text)) return '早餐'
    if (/饮品|果汁|奶茶|咖啡|饮料/.test(text)) return '饮品'
    if (/小吃|炸串|烧麦|春卷|薯条/.test(text)) return '小吃'

    return '正餐'
}

function extractRecipeName(text: string): string {
    const matched = text.match(/菜名\s*[:：]\s*([^\n。；]+)/)
    if (matched?.[1]) return matched[1].trim()

    const firstLine = text
        .split(/\n/)
        .map((line) => line.trim())
        .find(Boolean)

    if (firstLine && firstLine.length <= 20) {
        return firstLine.replace(/^(菜名|菜谱)\s*[:：]\s*/, '')
    }

    return '我的家常菜'
}

function extractSteps(text: string): string[] {
    const lines = text
        .split(/\n|。|；|;/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.replace(/^(步骤\s*)?\d+[\s、.．:：)）-]*/, '').trim())
        .filter(Boolean)

    const name = extractRecipeName(text)

    // 如果第一行只是菜名，不把菜名当成制作步骤
    const filtered = lines.filter((line) => line !== name)

    if (filtered.length > 0) {
        return filtered
    }

    return [
        '准备食材，并清洗、切配。',
        '根据输入内容进行烹饪。',
        '调味后检查熟度，装盘即可。',
    ]
}

function generateRecipe() {
    const text = sourceText.value.trim()

    if (!text) {
        uni.showToast({
            title: '请先输入菜谱内容',
            icon: 'none',
        })
        return
    }

    recipeName.value = extractRecipeName(text)
    cuisine.value = detectCuisine(text)
    mealCategory.value = detectMealCategory(text)
    steps.value = extractSteps(text).map((description, index) => ({
        order: index + 1,
        description,
    }))

    generated.value = true
    uni.pageScrollTo({
        scrollTop: 9999,
        duration: 300,
    })
}
function addStep() {
    steps.value.push({
        order: steps.value.length + 1,
        description: '',
    })
}

function removeStep(index: number) {
    steps.value.splice(index, 1)
    steps.value.forEach((step, stepIndex) => {
        step.order = stepIndex + 1
    })
}

function chooseCover() {
    uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (result) => {
            coverImage.value = result.tempFilePaths[0] || ''
        },
        fail: () => {
            // 用户取消选择图片时不需要额外提示
        },
    })
}

function saveRecipe() {
    const name = recipeName.value.trim()
    const validSteps = steps.value
        .map((step) => step.description.trim())
        .filter(Boolean)

    if (!name) {
        uni.showToast({
            title: '请输入菜名',
            icon: 'none',
        })
        return
    }

    if (validSteps.length === 0) {
        uni.showToast({
            title: '请至少保留一个制作步骤',
            icon: 'none',
        })
        return
    }

    const recipe: Recipe = {
        id: `recipe-${Date.now()}`,
        groupId: 'demo-group',
        name,
        category: cuisine.value.trim() || '家常菜',
        mealCategory: mealCategory.value,
        cookMinutes: Math.max(1, Number(cookMinutes.value) || 30),
        cookCount: 0,
        coverImage: coverImage.value,
        ingredients: [],
        steps: validSteps.map((description, index) => ({
            order: index + 1,
            description,
        })),
        tags: [],
        sourceText: sourceText.value.trim(),
        status: 'confirmed',
        createdBy: 'demo-user',
        createdAt: Date.now(),
    }

    recipeStore.addRecipe(recipe)

    uni.showToast({
        title: '菜谱已保存',
        icon: 'success',
    })

    setTimeout(() => {
        uni.navigateBack()
    }, 300)
}

function showComingSoon() {
    uni.showToast({
        title: '功能暂未开放',
        icon: 'none'
    })
}
</script>
<style scoped>
.page {
    min-height: 100vh;
    padding: 32rpx;
    padding-bottom: 60rpx;
    box-sizing: border-box;
    background: #f7f7f7;
}

.intro {
    margin: 8rpx 0 28rpx;
}

.page-title {
    display: block;
    color: #222;
    font-size: 38rpx;
    font-weight: 700;
}

.page-desc {
    display: block;
    margin-top: 12rpx;
    color: #888;
    font-size: 25rpx;
    line-height: 1.6;
}

.card,
.step-card {
    margin-bottom: 22rpx;
    padding: 28rpx;
    background: #fff;
    border-radius: 20rpx;
}

.section-heading,
.result-heading,
.steps-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
}

.section-title {
    color: #252525;
    font-size: 30rpx;
    font-weight: 600;
}

.required-label {
    color: #e26b52;
    font-size: 23rpx;
}

.source-input {
    width: 100%;
    height: 260rpx;
    padding: 20rpx;
    box-sizing: border-box;
    color: #333;
    background: #f8f8f8;
    border-radius: 12rpx;
    font-size: 27rpx;
    line-height: 1.6;
}

.placeholder {
    color: #aaa;
    font-size: 25rpx;
}

.media-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20rpx;
    padding: 28rpx 10rpx;
    border: 2rpx dashed #ddd;
    border-radius: 12rpx;
}

.media-icon,
.cover-plus {
    color: #39a779;
    font-size: 42rpx;
    line-height: 1.2;
}

.media-title {
    margin-top: 8rpx;
    color: #555;
    font-size: 25rpx;
}

.media-desc {
    margin-top: 8rpx;
    color: #aaa;
    font-size: 22rpx;
}

.generate-button,
.save-button {
    height: 88rpx;
    margin: 24rpx 0 36rpx;
    color: #fff;
    background: #38a878;
    border-radius: 16rpx;
    font-size: 30rpx;
    line-height: 88rpx;
}

.generate-button[disabled] {
    color: #fff;
    background: #a9cdbb;
}

.generate-button::after,
.save-button::after,
.add-step-button::after {
    border: none;
}

.result-section {
    margin-top: 8rpx;
}

.result-heading {
    margin: 8rpx 4rpx 20rpx;
}

.result-tip,
.field-hint {
    color: #999;
    font-size: 22rpx;
}

.field {
    margin-bottom: 28rpx;
}

.field:last-child {
    margin-bottom: 0;
}

.field-label {
    display: block;
    margin-bottom: 14rpx;
    color: #555;
    font-size: 25rpx;
}

.text-input {
    width: 100%;
    height: 78rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
    color: #333;
    background: #f8f8f8;
    border-radius: 12rpx;
    font-size: 27rpx;
}

.field-hint {
    display: block;
    margin-top: 10rpx;
}

.cover-picker {
    overflow: hidden;
    width: 100%;
    height: 300rpx;
    background: #f8f8f8;
    border-radius: 14rpx;
}

.cover-image {
    width: 100%;
    height: 100%;
}

.cover-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #999;
    font-size: 24rpx;
}

.cover-plus {
    margin-bottom: 10rpx;
}

.picker-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 78rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
    color: #333;
    background: #f8f8f8;
    border-radius: 12rpx;
    font-size: 27rpx;
}

.picker-arrow {
    color: #999;
    font-size: 36rpx;
}

.minutes-input {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.minutes-input .text-input {
    flex: 1;
}

.minutes-unit {
    color: #777;
    font-size: 25rpx;
}

.steps-heading {
    margin: 30rpx 4rpx 20rpx;
}

.step-card {
    padding: 24rpx;
}

.step-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
}

.step-number {
    color: #333;
    font-size: 27rpx;
    font-weight: 600;
}

.delete-step {
    color: #d66b5a;
    font-size: 24rpx;
}

.step-input {
    width: 100%;
    min-height: 120rpx;
    padding: 18rpx;
    box-sizing: border-box;
    color: #333;
    background: #f8f8f8;
    border-radius: 12rpx;
    font-size: 26rpx;
    line-height: 1.6;
}

.add-step-button {
    height: 76rpx;
    margin: 8rpx 0 20rpx;
    color: #38a878;
    background: #e9f5ef;
    border-radius: 14rpx;
    font-size: 27rpx;
    line-height: 76rpx;
}

.save-button {
    margin-top: 12rpx;
}
</style>