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
  <section class="card buyer-section">
    <div class="card-header">
      <div>
        <p class="eyebrow">Buyer Card</p>
        <h2>报价核对工具</h2>
      </div>
      <div class="button-group">
        <button @click="downloadImage">一键截图</button>
        <button class="secondary" @click="copyImage">复制图片</button>
      </div>
    </div>

    <p v-if="status" class="status">{{ status }}</p>

    <div ref="cardRef" class="buyer-card">
      <p class="buyer-badge">Price Check</p>

      <div class="share-headline">
        <div>
          <h3>报价核对清单</h3>
          <p>含固定成本、比例扣款、当前售价利润和目标利润建议售价。</p>
        </div>
        <div class="share-price">
          <span>建议售价</span>
          <strong>{{ formatMoney(store.result.recommendedPrice, store.input.currency) }}</strong>
        </div>
      </div>

      <div class="share-metrics">
        <div class="cost">
          <span>固定成本</span>
          <strong>{{ formatMoney(store.result.fixedCost, store.input.currency) }}</strong>
        </div>
        <div class="price">
          <span>保本售价</span>
          <strong>{{ formatMoney(store.result.breakEvenPrice, store.input.currency) }}</strong>
        </div>
        <div class="profit-card">
          <span>当前售价利润</span>
          <strong>{{ formatMoney(store.result.sellingPriceProfit, store.input.currency) }}</strong>
        </div>
        <div class="profit-card">
          <span>目标售价利润</span>
          <strong>{{ formatMoney(store.result.profit, store.input.currency) }}</strong>
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
          <div><span>其他固定扣款</span><strong>{{ formatMoney(store.input.otherCost, store.input.currency) }}</strong></div>
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
            <span>活动扣点</span>
            <strong>{{ formatMoney(store.result.recommendedPrice, store.input.currency) }} × {{ formatPercent(store.input.activityFeeRate) }} = {{ formatMoney(store.result.activityFee, store.input.currency) }}</strong>
          </div>
          <div>
            <span>达人佣金</span>
            <strong>{{ formatMoney(store.result.recommendedPrice, store.input.currency) }} × {{ formatPercent(store.input.affiliateFeeRate) }} = {{ formatMoney(store.result.affiliateFee, store.input.currency) }}</strong>
          </div>
          <div>
            <span>其他比例扣款</span>
            <strong>{{ formatMoney(store.result.recommendedPrice, store.input.currency) }} × {{ formatPercent(store.input.otherFeeRate) }} = {{ formatMoney(store.result.otherVariableFee, store.input.currency) }}</strong>
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
            {{ formatPercent(store.input.adFeeRate) }} + 活动扣点
            {{ formatPercent(store.input.activityFeeRate) }} + 达人佣金
            {{ formatPercent(store.input.affiliateFeeRate) }} + 其他比例扣款
            {{ formatPercent(store.input.otherFeeRate) }} = {{ formatPercent(store.result.variableFeeRate) }}
          </li>
          <li>
            当前售价利润 = 当前售价 - 固定成本 - 当前售价下的比例扣款 =
            {{ formatMoney(store.result.sellingPriceProfit, store.input.currency) }}
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

      <p class="buyer-note">此清单为估算参考，实际费用会因平台、物流、地区和活动政策变化；页面本地计算，不需要登录，不上传或保存你的业务数据。</p>

      <div class="buyer-footer">
        <span>开源工具 · 本地计算 · 隐私友好</span>
        <span>{{ new Date().toLocaleDateString() }}</span>
      </div>
    </div>
  </section>
</template>
