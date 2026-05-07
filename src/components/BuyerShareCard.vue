<script setup lang="ts">
import { ref } from 'vue'
import { useScreenshot } from '../composables/useScreenshot'
import { useCalculatorStore } from '../stores/calculator'
import { formatMoney } from '../utils/format'

const store = useCalculatorStore()
const cardRef = ref<HTMLElement | null>(null)
const status = ref('')
const { downloadElementAsImage, copyElementAsImage } = useScreenshot()

async function downloadImage() {
  if (!cardRef.value) return
  status.value = ''
  await downloadElementAsImage(cardRef.value, 'buyer-price-explanation.png')
}

async function copyImage() {
  if (!cardRef.value) return
  status.value = ''

  try {
    await copyElementAsImage(cardRef.value)
    status.value = '图片已复制，可以直接粘贴给买家。'
  } catch (error) {
    status.value = error instanceof Error ? error.message : '复制失败，请使用下载截图。'
  }
}
</script>

<template>
  <section class="card">
    <div class="card-header">
      <div>
        <p class="eyebrow">Buyer Card</p>
        <h2>买家说明卡片</h2>
      </div>
      <div class="button-group">
        <button @click="downloadImage">一键截图</button>
        <button class="secondary" @click="copyImage">复制图片</button>
      </div>
    </div>

    <p v-if="status" class="status">{{ status }}</p>

    <div ref="cardRef" class="buyer-card">
      <p class="buyer-badge">Price Explanation</p>

      <h3>价格说明</h3>

      <div class="buyer-price">{{ formatMoney(store.result.recommendedPrice, store.input.currency) }}</div>

      <ul>
        <li>商品价格已综合产品成本、国际运输和本地配送费用。</li>
        <li>价格中包含平台服务费、支付手续费和基础履约成本。</li>
        <li>配送费用会因国家、地区、重量和物流服务不同而变化。</li>
        <li>实际售后政策以店铺页面说明为准。</li>
      </ul>

      <div class="buyer-footer">
        <span>清晰定价 · 合理成本 · 安心购买</span>
        <span>{{ new Date().toLocaleDateString() }}</span>
      </div>
    </div>
  </section>
</template>
