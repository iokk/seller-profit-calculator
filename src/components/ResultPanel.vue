<script setup lang="ts">
import { computed } from 'vue'
import { useCalculatorStore } from '../stores/calculator'
import { formatMoney, formatPercent } from '../utils/format'

const store = useCalculatorStore()

const costShares = computed(() => {
  const price = store.result.recommendedPrice || store.result.sellingPrice
  const total = price > 0 ? price : 0

  return [
    { label: '固定成本', className: 'share-cost', value: store.result.fixedCost },
    { label: '平台费', className: 'share-platform', value: store.result.platformFee },
    { label: '支付费', className: 'share-payment', value: store.result.paymentFee },
    { label: '广告费', className: 'share-ad', value: store.result.adFee },
    { label: '活动/达人', className: 'share-promo', value: store.result.activityFee + store.result.affiliateFee },
    { label: '其他比例', className: 'share-other', value: store.result.otherVariableFee },
    { label: '目标利润', className: 'share-profit', value: store.result.profit }
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

      <div class="result-section-title">
        <span>核心答案</span>
        <small>先看结论，再看拆分</small>
      </div>

      <div class="result-main dual-result">
        <div class="answer-card answer-profit">
          <span class="metric-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 19V5m0 0 5 5m-5-5-5 5" /><path d="M5 19h14" /></svg>
          </span>
          <p>当前售价能赚多少</p>
          <strong>{{ formatMoney(store.result.sellingPriceProfit, store.input.currency) }}</strong>
          <span>利润率 {{ formatPercent(store.result.sellingPriceProfitRate) }}</span>
        </div>
        <div class="answer-card answer-target">
          <span class="metric-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 3v18" /><path d="M17 7.5c-.7-1-2-1.5-3.7-1.5H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H9.5c-1.6 0-2.9-.6-3.7-1.6" /></svg>
          </span>
          <p>想赚目标利润应卖</p>
          <strong>{{ formatMoney(store.result.recommendedPrice, store.input.currency) }}</strong>
          <span>目标利润率 {{ formatPercent(store.input.targetProfitRate) }}</span>
        </div>
      </div>

      <div v-if="store.result.pricingWarning" class="error-note">
        {{ store.result.pricingWarning }}
      </div>

      <div class="result-section-title compact-title">
        <span>关键指标</span>
        <small>颜色按类型区分</small>
      </div>

      <div class="metric-grid">
        <div class="metric-card price-card">
          <div class="metric-label">
            <span class="metric-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M4 7h16" /><path d="M4 12h16" /><path d="M6 17h12" /></svg>
            </span>
            <span>当前售价</span>
          </div>
          <strong>{{ formatMoney(store.result.sellingPrice, store.input.currency) }}</strong>
        </div>

        <div class="metric-card profit-card">
          <div class="metric-label">
            <span class="metric-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M5 17 10 12l4 4 5-8" /><path d="M15 8h4v4" /></svg>
            </span>
            <span>当前售价利润</span>
          </div>
          <strong class="profit">{{ formatMoney(store.result.sellingPriceProfit, store.input.currency) }}</strong>
        </div>

        <div class="metric-card cost-card">
          <div class="metric-label">
            <span class="metric-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M4 7h16v12H4z" /><path d="M8 7V5h8v2" /><path d="M8 12h8" /></svg>
            </span>
            <span>固定成本</span>
          </div>
          <strong>{{ formatMoney(store.result.fixedCost, store.input.currency) }}</strong>
        </div>

        <div class="metric-card breakeven-card">
          <div class="metric-label">
            <span class="metric-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M4 12h16" /><path d="M12 4v16" /></svg>
            </span>
            <span>保本售价</span>
          </div>
          <strong>{{ formatMoney(store.result.breakEvenPrice, store.input.currency) }}</strong>
        </div>

        <div class="metric-card profit-card">
          <div class="metric-label">
            <span class="metric-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M7 19V9" /><path d="M12 19V5" /><path d="M17 19v-7" /></svg>
            </span>
            <span>目标售价利润</span>
          </div>
          <strong class="profit">{{ formatMoney(store.result.profit, store.input.currency) }}</strong>
        </div>

        <div class="metric-card margin-card">
          <div class="metric-label">
            <span class="metric-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M19 5 5 19" /><circle cx="7.5" cy="7.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" /></svg>
            </span>
            <span>目标售价利润率</span>
          </div>
          <strong class="profit">{{ formatPercent(store.result.profitRate) }}</strong>
        </div>

        <div class="metric-card fee-card">
          <div class="metric-label">
            <span class="metric-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M6 5h12" /><path d="M8 5v14" /><path d="M16 5v14" /><path d="M5 19h14" /></svg>
            </span>
            <span>变动费率</span>
          </div>
          <strong>{{ formatPercent(store.result.variableFeeRate) }}</strong>
        </div>

        <div class="metric-card target-card">
          <div class="metric-label">
            <span class="metric-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 21a9 9 0 1 0-9-9" /><path d="M12 7v5l3 2" /><path d="M3 12h4" /></svg>
            </span>
            <span>售价反推费率</span>
          </div>
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
