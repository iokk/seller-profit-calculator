<script setup lang="ts">
import { useCalculatorStore } from '../stores/calculator'

const store = useCalculatorStore()

function fromRate(value: number) {
  return Number((value * 100).toFixed(2))
}
</script>

<template>
  <section class="card">
    <div class="card-header">
      <div>
        <p class="eyebrow">Seller Input</p>
        <h2>卖家成本输入</h2>
      </div>
      <button class="text-button" @click="store.reset">重置</button>
    </div>

    <div class="form-grid">
      <label>
        产品成本
        <input v-model.number="store.input.productCost" type="number" min="0" inputmode="decimal" />
      </label>

      <label>
        头程费用
        <input v-model.number="store.input.firstMileCost" type="number" min="0" inputmode="decimal" />
        <small>工厂到海外仓、平台仓或目的国的成本</small>
      </label>

      <label>
        尾程费用
        <input v-model.number="store.input.lastMileCost" type="number" min="0" inputmode="decimal" />
        <small>仓库到买家的配送费用</small>
      </label>

      <label>
        平台佣金 %
        <input
          :value="fromRate(store.input.platformFeeRate)"
          type="number"
          min="0"
          max="90"
          inputmode="decimal"
          @input="store.updateRate('platformFeeRate', ($event.target as HTMLInputElement).value)"
        />
      </label>

      <label>
        支付手续费 %
        <input
          :value="fromRate(store.input.paymentFeeRate)"
          type="number"
          min="0"
          max="90"
          inputmode="decimal"
          @input="store.updateRate('paymentFeeRate', ($event.target as HTMLInputElement).value)"
        />
      </label>

      <label>
        广告费率 %
        <input
          :value="fromRate(store.input.adFeeRate)"
          type="number"
          min="0"
          max="90"
          inputmode="decimal"
          @input="store.updateRate('adFeeRate', ($event.target as HTMLInputElement).value)"
        />
      </label>

      <label>
        目标利润率 %
        <input
          :value="fromRate(store.input.targetProfitRate)"
          type="number"
          min="0"
          max="80"
          inputmode="decimal"
          @input="store.updateRate('targetProfitRate', ($event.target as HTMLInputElement).value)"
        />
      </label>

      <label>
        仓储费
        <input v-model.number="store.input.storageCost" type="number" min="0" inputmode="decimal" />
      </label>

      <label>
        税费
        <input v-model.number="store.input.taxCost" type="number" min="0" inputmode="decimal" />
      </label>

      <label>
        退货损耗
        <input v-model.number="store.input.returnLossCost" type="number" min="0" inputmode="decimal" />
      </label>

      <label>
        其他成本
        <input v-model.number="store.input.otherCost" type="number" min="0" inputmode="decimal" />
      </label>

      <label>
        币种
        <select v-model="store.input.currency">
          <option value="CNY">CNY 人民币</option>
          <option value="USD">USD 美元</option>
          <option value="EUR">EUR 欧元</option>
          <option value="GBP">GBP 英镑</option>
        </select>
      </label>
    </div>
  </section>
</template>
