<script setup lang="ts">
import { useCalculatorStore } from '../stores/calculator'

const store = useCalculatorStore()

function fromRate(value: number) {
  return Number((value * 100).toFixed(2))
}

function fromAmount(value: number) {
  return Number.isFinite(value) ? String(value) : '0'
}
</script>

<template>
  <section class="card">
    <div class="card-header">
      <div>
        <p class="eyebrow">Seller Input</p>
        <h2>参数录入</h2>
      </div>
      <button class="text-button" @click="store.reset">重置</button>
    </div>

    <div class="form-grid">
      <label class="field">
        <span class="field-title">产品成本</span>
        <input
          :value="fromAmount(store.input.productCost)"
          type="text"
          inputmode="decimal"
          maxlength="11"
          @input="store.updateAmount('productCost', ($event.target as HTMLInputElement).value)"
        />
        <small>单件商品采购成本，最高 99,999,999</small>
      </label>

      <label class="field">
        <span class="field-title">头程费用</span>
        <input
          :value="fromAmount(store.input.firstMileCost)"
          type="text"
          inputmode="decimal"
          maxlength="11"
          @input="store.updateAmount('firstMileCost', ($event.target as HTMLInputElement).value)"
        />
        <small>工厂到海外仓、平台仓或目的国的成本</small>
      </label>

      <label class="field">
        <span class="field-title">尾程费用</span>
        <input
          :value="fromAmount(store.input.lastMileCost)"
          type="text"
          inputmode="decimal"
          maxlength="11"
          @input="store.updateAmount('lastMileCost', ($event.target as HTMLInputElement).value)"
        />
        <small>仓库到买家的配送费用</small>
      </label>

      <label class="field rate-field">
        <span class="field-title">平台佣金 %</span>
        <input
          :value="fromRate(store.input.platformFeeRate)"
          type="text"
          inputmode="decimal"
          maxlength="6"
          @input="store.updateRate('platformFeeRate', ($event.target as HTMLInputElement).value)"
        />
        <small>常见参考：独立站 2%-5%，TikTok Shop 2%-8%，Amazon 8%-15%</small>
      </label>

      <label class="field rate-field">
        <span class="field-title">支付手续费 %</span>
        <input
          :value="fromRate(store.input.paymentFeeRate)"
          type="text"
          inputmode="decimal"
          maxlength="6"
          @input="store.updateRate('paymentFeeRate', ($event.target as HTMLInputElement).value)"
        />
        <small>常见参考：Stripe/PayPal/信用卡约 2.9%-4.5%</small>
      </label>

      <label class="field rate-field">
        <span class="field-title">广告费率 %</span>
        <input
          :value="fromRate(store.input.adFeeRate)"
          type="text"
          inputmode="decimal"
          maxlength="6"
          @input="store.updateRate('adFeeRate', ($event.target as HTMLInputElement).value)"
        />
        <small>常见参考：成熟品 8%-15%，新品测试 15%-30%</small>
      </label>

      <label class="field rate-field">
        <span class="field-title">目标利润率 %</span>
        <input
          :value="fromRate(store.input.targetProfitRate)"
          type="text"
          inputmode="decimal"
          maxlength="6"
          @input="store.updateRate('targetProfitRate', ($event.target as HTMLInputElement).value)"
        />
        <small>常见参考：低价走量 10%-20%，常规利润 20%-35%</small>
      </label>

      <label class="field">
        <span class="field-title">仓储费</span>
        <input
          :value="fromAmount(store.input.storageCost)"
          type="text"
          inputmode="decimal"
          maxlength="11"
          @input="store.updateAmount('storageCost', ($event.target as HTMLInputElement).value)"
        />
        <small>单件仓储或履约分摊成本</small>
      </label>

      <label class="field">
        <span class="field-title">税费</span>
        <input
          :value="fromAmount(store.input.taxCost)"
          type="text"
          inputmode="decimal"
          maxlength="11"
          @input="store.updateAmount('taxCost', ($event.target as HTMLInputElement).value)"
        />
        <small>关税、VAT 或其他税费分摊</small>
      </label>

      <label class="field">
        <span class="field-title">退货损耗</span>
        <input
          :value="fromAmount(store.input.returnLossCost)"
          type="text"
          inputmode="decimal"
          maxlength="11"
          @input="store.updateAmount('returnLossCost', ($event.target as HTMLInputElement).value)"
        />
        <small>退货、破损或售后损耗分摊</small>
      </label>

      <label class="field">
        <span class="field-title">其他成本</span>
        <input
          :value="fromAmount(store.input.otherCost)"
          type="text"
          inputmode="decimal"
          maxlength="11"
          @input="store.updateAmount('otherCost', ($event.target as HTMLInputElement).value)"
        />
        <small>包装、人工、赠品等其他分摊成本</small>
      </label>

      <label class="field">
        <span class="field-title">币种</span>
        <select v-model="store.input.currency">
          <option value="CNY">CNY 人民币</option>
          <option value="USD">USD 美元</option>
          <option value="EUR">EUR 欧元</option>
          <option value="GBP">GBP 英镑</option>
        </select>
        <small>当前版本按单一币种本地计算</small>
      </label>
    </div>

    <div class="rate-reference">
      <strong>费率按售价百分比计算</strong>
      <span>例如售价 ¥100、平台佣金 8%，平台费就是 ¥8。</span>
    </div>
  </section>
</template>
