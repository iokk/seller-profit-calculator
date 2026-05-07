<script setup lang="ts">
import { useCalculatorStore } from '../stores/calculator'
import { formatMoney, formatPercent } from '../utils/format'

const store = useCalculatorStore()
</script>

<template>
  <section class="card result-card">
    <p class="eyebrow">Result</p>
    <h2>计算结果</h2>

    <div class="result-main">
      <p>建议售价</p>
      <strong>{{ formatMoney(store.result.recommendedPrice, store.input.currency) }}</strong>
    </div>

    <div class="result-list">
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
        <strong class="profit">{{ formatMoney(store.result.profit, store.input.currency) }}</strong>
      </div>

      <div>
        <span>实际利润率</span>
        <strong class="profit">{{ formatPercent(store.result.profitRate) }}</strong>
      </div>

      <div>
        <span>变动费率</span>
        <strong>{{ formatPercent(store.result.variableFeeRate) }}</strong>
      </div>
    </div>

    <div class="notice">建议售价已包含平台佣金、支付手续费、广告费和目标利润率。</div>
  </section>
</template>
