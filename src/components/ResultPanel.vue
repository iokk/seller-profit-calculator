<script setup lang="ts">
import { useCalculatorStore } from '../stores/calculator'
import { formatMoney, formatPercent } from '../utils/format'

const store = useCalculatorStore()
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

      <div class="result-main">
        <p>建议售价</p>
        <strong>{{ formatMoney(store.result.recommendedPrice, store.input.currency) }}</strong>
      </div>

      <div class="metric-grid">
        <div class="metric-card cost">
          <span>固定成本</span>
          <strong>{{ formatMoney(store.result.fixedCost, store.input.currency) }}</strong>
        </div>

        <div class="metric-card neutral">
          <span>保本售价</span>
          <strong>{{ formatMoney(store.result.breakEvenPrice, store.input.currency) }}</strong>
        </div>

        <div class="metric-card profit-card">
          <span>单件利润</span>
          <strong class="profit">{{ formatMoney(store.result.profit, store.input.currency) }}</strong>
        </div>

        <div class="metric-card profit-card">
          <span>实际利润率</span>
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

      <div class="notice">建议售价已包含平台佣金、支付手续费、广告费和目标利润率。</div>
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
            {{ formatPercent(store.input.adFeeRate) }} =
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
          <span class="price-text">建议售价</span>
          <strong>
            {{ formatMoney(store.result.fixedCost, store.input.currency) }} ÷
            (1 - {{ formatPercent(store.result.variableFeeRate) }} -
            {{ formatPercent(store.input.targetProfitRate) }}) =
            {{ formatMoney(store.result.recommendedPrice, store.input.currency) }}
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
