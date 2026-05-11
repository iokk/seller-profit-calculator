<script setup lang="ts">
import { computed } from 'vue'
import { useCalculatorStore } from '../stores/calculator'
import { formatMoney, formatPercent } from '../utils/format'

const store = useCalculatorStore()

const costShares = computed(() => {
  const price = store.result.recommendedPrice || store.result.sellingPrice
  const total = price > 0 ? price : 0

  return [
    { label: '固定成本', className: 'cost', value: store.result.fixedCost },
    { label: '平台费', className: 'fee', value: store.result.platformFee },
    { label: '支付费', className: 'fee', value: store.result.paymentFee },
    { label: '广告费', className: 'fee', value: store.result.adFee },
    { label: '活动/达人', className: 'fee', value: store.result.activityFee + store.result.affiliateFee },
    { label: '其他比例', className: 'fee', value: store.result.otherVariableFee },
    { label: '目标利润', className: 'profit-card', value: store.result.profit }
  ].map((item) => ({
    ...item,
    percent: total > 0 ? Math.max(item.value / total, 0) : 0
  }))
})
</script>

<template>
  <aside class="sidebar-stack">
    <section class="card result-card">
      <div class="result-header">
        <div>
          <p class="eyebrow">Result</p>
          <h2>核心金额</h2>
        </div>
        <span class="result-pill">按当前输入实时计算</span>
      </div>

      <div class="result-main dual-result">
        <div>
          <p>当前售价能赚多少</p>
          <strong>{{ formatMoney(store.result.sellingPriceProfit, store.input.currency) }}</strong>
          <span>利润率 {{ formatPercent(store.result.sellingPriceProfitRate) }}</span>
        </div>
        <div>
          <p>想赚目标利润应卖</p>
          <strong>{{ formatMoney(store.result.recommendedPrice, store.input.currency) }}</strong>
          <span>目标利润率 {{ formatPercent(store.input.targetProfitRate) }}</span>
        </div>
      </div>

      <div v-if="store.result.pricingWarning" class="error-note">
        {{ store.result.pricingWarning }}
      </div>

      <div class="metric-grid">
        <div class="metric-card price">
          <span>当前售价</span>
          <strong>{{ formatMoney(store.result.sellingPrice, store.input.currency) }}</strong>
        </div>

        <div class="metric-card profit-card">
          <span>当前售价利润</span>
          <strong class="profit">{{ formatMoney(store.result.sellingPriceProfit, store.input.currency) }}</strong>
        </div>

        <div class="metric-card cost">
          <span>固定成本</span>
          <strong>{{ formatMoney(store.result.fixedCost, store.input.currency) }}</strong>
        </div>

        <div class="metric-card neutral">
          <span>保本售价</span>
          <strong>{{ formatMoney(store.result.breakEvenPrice, store.input.currency) }}</strong>
        </div>

        <div class="metric-card profit-card">
          <span>目标售价利润</span>
          <strong class="profit">{{ formatMoney(store.result.profit, store.input.currency) }}</strong>
        </div>

        <div class="metric-card profit-card">
          <span>目标售价利润率</span>
          <strong class="profit">{{ formatPercent(store.result.profitRate) }}</strong>
        </div>

        <div class="metric-card fee">
          <span>变动费率</span>
          <strong>{{ formatPercent(store.result.variableFeeRate) }}</strong>
        </div>

        <div class="metric-card price">
          <span>售价反推费率</span>
          <strong>{{ formatPercent(store.result.pricingRate) }}</strong>
        </div>
      </div>

      <div class="cost-share-card">
        <div class="cost-share-header">
          <strong>成本占比</strong>
          <span>按建议售价展示</span>
        </div>
        <div class="cost-share-bar">
          <span
            v-for="item in costShares"
            :key="item.label"
            :class="item.className"
            :style="{ width: `${item.percent * 100}%` }"
          />
        </div>
        <div class="cost-share-list">
          <div v-for="item in costShares" :key="item.label">
            <span :class="item.className">{{ item.label }}</span>
            <strong>{{ formatPercent(item.percent) }}</strong>
          </div>
        </div>
      </div>

      <div class="notice">页面同时回答“当前售价能赚多少”和“达到目标利润应卖多少”。比例扣款按售价计算，固定扣款直接计入成本。</div>
    </section>

    <section class="card formula-card mini-invoice">
      <h2>核算明细</h2>

      <div class="formula-list">
        <div>
          <span class="cost-text">固定成本</span>
          <strong>
            {{ formatMoney(store.input.productCost, store.input.currency) }} +
            {{ formatMoney(store.input.firstMileCost, store.input.currency) }} +
            {{ formatMoney(store.input.lastMileCost, store.input.currency) }} +
            {{ formatMoney(store.input.storageCost, store.input.currency) }} +
            {{ formatMoney(store.input.taxCost, store.input.currency) }} +
            {{ formatMoney(store.input.returnLossCost, store.input.currency) }} +
            {{ formatMoney(store.input.otherCost, store.input.currency) }} =
            {{ formatMoney(store.result.fixedCost, store.input.currency) }}
          </strong>
        </div>

        <div>
          <span class="fee-text">变动费率</span>
          <strong>
            {{ formatPercent(store.input.platformFeeRate) }} +
            {{ formatPercent(store.input.paymentFeeRate) }} +
            {{ formatPercent(store.input.adFeeRate) }} +
            {{ formatPercent(store.input.activityFeeRate) }} +
            {{ formatPercent(store.input.affiliateFeeRate) }} +
            {{ formatPercent(store.input.otherFeeRate) }} =
            {{ formatPercent(store.result.variableFeeRate) }}
          </strong>
        </div>

        <div>
          <span class="price-text">保本售价</span>
          <strong>
            {{ formatMoney(store.result.fixedCost, store.input.currency) }} ÷
            (1 - {{ formatPercent(store.result.variableFeeRate) }}) =
            {{ formatMoney(store.result.breakEvenPrice, store.input.currency) }}
          </strong>
        </div>

        <div>
          <span class="profit-text">当前售价利润</span>
          <strong>
            {{ formatMoney(store.result.sellingPrice, store.input.currency) }} -
            {{ formatMoney(store.result.fixedCost, store.input.currency) }} -
            {{ formatMoney(store.result.sellingPriceVariableFee, store.input.currency) }} =
            {{ formatMoney(store.result.sellingPriceProfit, store.input.currency) }}
          </strong>
        </div>

        <div>
          <span class="price-text">建议售价</span>
          <strong>
            {{ formatMoney(store.result.fixedCost, store.input.currency) }} ÷
            (1 - {{ formatPercent(store.result.variableFeeRate) }} -
            {{ formatPercent(store.input.targetProfitRate) }}) =
            {{ formatMoney(store.result.recommendedPrice, store.input.currency) }}
          </strong>
        </div>

        <div>
          <span class="fee-text">活动/达人</span>
          <strong>
            {{ formatMoney(store.result.activityFee, store.input.currency) }} +
            {{ formatMoney(store.result.affiliateFee, store.input.currency) }} +
            {{ formatMoney(store.result.otherVariableFee, store.input.currency) }} =
            {{ formatMoney(store.result.activityFee + store.result.affiliateFee + store.result.otherVariableFee, store.input.currency) }}
          </strong>
        </div>

        <div>
          <span class="fee-text">平台费</span>
          <strong>
            {{ formatMoney(store.result.recommendedPrice, store.input.currency) }} ×
            {{ formatPercent(store.input.platformFeeRate) }} =
            {{ formatMoney(store.result.platformFee, store.input.currency) }}
          </strong>
        </div>

        <div>
          <span class="fee-text">支付费</span>
          <strong>
            {{ formatMoney(store.result.recommendedPrice, store.input.currency) }} ×
            {{ formatPercent(store.input.paymentFeeRate) }} =
            {{ formatMoney(store.result.paymentFee, store.input.currency) }}
          </strong>
        </div>

        <div>
          <span class="fee-text">广告费</span>
          <strong>
            {{ formatMoney(store.result.recommendedPrice, store.input.currency) }} ×
            {{ formatPercent(store.input.adFeeRate) }} =
            {{ formatMoney(store.result.adFee, store.input.currency) }}
          </strong>
        </div>

        <div>
          <span class="profit-text">利润</span>
          <strong>
            {{ formatMoney(store.result.recommendedPrice, store.input.currency) }} -
            {{ formatMoney(store.result.fixedCost, store.input.currency) }} -
            {{ formatMoney(store.result.totalVariableFee, store.input.currency) }} =
            {{ formatMoney(store.result.profit, store.input.currency) }}
          </strong>
        </div>
      </div>
    </section>
  </aside>
</template>
