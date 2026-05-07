<script setup lang="ts">
import { ref } from 'vue'
import { useScreenshot } from '../composables/useScreenshot'
import { useCalculatorStore } from '../stores/calculator'
import { formatMoney, formatPercent } from '../utils/format'

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

      <div class="share-headline">
        <div>
          <h3>价格与利润测算清单</h3>
          <p>含产品成本、头程、尾程、平台费、支付费、广告费和目标利润。</p>
        </div>
        <div class="share-price">
          <span>建议售价</span>
          <strong>{{ formatMoney(store.result.recommendedPrice, store.input.currency) }}</strong>
        </div>
      </div>

      <div class="share-metrics">
        <div>
          <span>固定成本</span>
          <strong>{{ formatMoney(store.result.fixedCost, store.input.currency) }}</strong>
        </div>
        <div>
          <span>保本售价</span>
          <strong>{{ formatMoney(store.result.breakEvenPrice, store.input.currency) }}</strong>
        </div>
        <div>
          <span>单件利润</span>
          <strong>{{ formatMoney(store.result.profit, store.input.currency) }}</strong>
        </div>
        <div>
          <span>利润率</span>
          <strong>{{ formatPercent(store.result.profitRate) }}</strong>
        </div>
      </div>

      <div class="share-section">
        <h4>成本明细</h4>
        <div class="share-table">
          <div><span>产品成本</span><strong>{{ formatMoney(store.input.productCost, store.input.currency) }}</strong></div>
          <div><span>头程费用</span><strong>{{ formatMoney(store.input.firstMileCost, store.input.currency) }}</strong></div>
          <div><span>尾程费用</span><strong>{{ formatMoney(store.input.lastMileCost, store.input.currency) }}</strong></div>
          <div><span>仓储费</span><strong>{{ formatMoney(store.input.storageCost, store.input.currency) }}</strong></div>
          <div><span>税费</span><strong>{{ formatMoney(store.input.taxCost, store.input.currency) }}</strong></div>
          <div><span>退货损耗</span><strong>{{ formatMoney(store.input.returnLossCost, store.input.currency) }}</strong></div>
          <div><span>其他成本</span><strong>{{ formatMoney(store.input.otherCost, store.input.currency) }}</strong></div>
        </div>
      </div>

      <div class="share-section">
        <h4>按建议售价计算的费用</h4>
        <div class="share-table">
          <div>
            <span>平台费</span>
            <strong>{{ formatMoney(store.result.recommendedPrice, store.input.currency) }} × {{ formatPercent(store.input.platformFeeRate) }} = {{ formatMoney(store.result.platformFee, store.input.currency) }}</strong>
          </div>
          <div>
            <span>支付费</span>
            <strong>{{ formatMoney(store.result.recommendedPrice, store.input.currency) }} × {{ formatPercent(store.input.paymentFeeRate) }} = {{ formatMoney(store.result.paymentFee, store.input.currency) }}</strong>
          </div>
          <div>
            <span>广告费</span>
            <strong>{{ formatMoney(store.result.recommendedPrice, store.input.currency) }} × {{ formatPercent(store.input.adFeeRate) }} = {{ formatMoney(store.result.adFee, store.input.currency) }}</strong>
          </div>
          <div>
            <span>变动费用合计</span>
            <strong>{{ formatMoney(store.result.totalVariableFee, store.input.currency) }}</strong>
          </div>
        </div>
      </div>

      <div class="share-section formula-share-section">
        <h4>计算逻辑</h4>
        <ol>
          <li>
            固定成本 = 产品 + 头程 + 尾程 + 仓储 + 税费 + 退货损耗 + 其他 =
            {{ formatMoney(store.result.fixedCost, store.input.currency) }}
          </li>
          <li>
            变动费率 = 平台佣金 {{ formatPercent(store.input.platformFeeRate) }} + 支付手续费
            {{ formatPercent(store.input.paymentFeeRate) }} + 广告费率
            {{ formatPercent(store.input.adFeeRate) }} = {{ formatPercent(store.result.variableFeeRate) }}
          </li>
          <li>
            建议售价 = 固定成本 ÷ (1 - 变动费率 - 目标利润率) =
            {{ formatMoney(store.result.fixedCost, store.input.currency) }} ÷ (1 -
            {{ formatPercent(store.result.variableFeeRate) }} -
            {{ formatPercent(store.input.targetProfitRate) }}) =
            {{ formatMoney(store.result.recommendedPrice, store.input.currency) }}
          </li>
          <li>
            利润 = 建议售价 - 固定成本 - 变动费用 =
            {{ formatMoney(store.result.profit, store.input.currency) }}
          </li>
        </ol>
      </div>

      <p class="buyer-note">此清单为估算参考，实际费用会因平台、物流、地区和活动政策变化。</p>

      <div class="buyer-footer">
        <span>清晰定价 · 合理成本 · 安心购买</span>
        <span>{{ new Date().toLocaleDateString() }}</span>
      </div>
    </div>
  </section>
</template>
