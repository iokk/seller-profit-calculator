<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useCalculatorStore } from '../stores/calculator'
import type { Currency } from '../types/calculator'
import { formatMoney } from '../utils/format'

const store = useCalculatorStore()
const targetCurrency = ref<Currency>('USD')
const rate = ref<number | null>(null)
const manualRate = ref('')
const rateDate = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const currencyOptions: { value: Currency; label: string }[] = [
  { value: 'CNY', label: 'CNY 人民币' },
  { value: 'USD', label: 'USD 美元' },
  { value: 'EUR', label: 'EUR 欧元' },
  { value: 'GBP', label: 'GBP 英镑' }
]

const baseCurrency = computed(() => store.input.currency)
const activeRate = computed(() => {
  const fallback = Number(manualRate.value)
  return rate.value ?? (Number.isFinite(fallback) && fallback > 0 ? fallback : null)
})
const convertedPrice = computed(() =>
  activeRate.value ? store.result.recommendedPrice * activeRate.value : null
)

watch(
  baseCurrency,
  (currency) => {
    if (targetCurrency.value === currency) {
      targetCurrency.value = currency === 'USD' ? 'CNY' : 'USD'
    }
  },
  { immediate: true }
)

watch([baseCurrency, targetCurrency], fetchRate, { immediate: true })

async function fetchRate() {
  if (baseCurrency.value === targetCurrency.value) return

  isLoading.value = true
  errorMessage.value = ''
  rate.value = null

  try {
    const response = await fetch(
      `https://api.frankfurter.dev/v2/rate/${baseCurrency.value}/${targetCurrency.value}`
    )

    if (!response.ok) throw new Error('rate unavailable')

    const data = (await response.json()) as { date?: string; rate?: number }
    if (!Number.isFinite(data.rate)) throw new Error('rate unavailable')

    rate.value = Number(data.rate)
    rateDate.value = data.date || ''
  } catch {
    errorMessage.value = '自动汇率暂时不可用，可先填写手动参考汇率。'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="card exchange-card">
    <div class="exchange-header">
      <div>
        <p class="eyebrow">Exchange Rate</p>
        <h2>汇率参考</h2>
      </div>
      <span class="result-pill">{{ isLoading ? '正在更新' : 'Frankfurter' }}</span>
    </div>

    <div class="exchange-row">
      <div class="exchange-pair">
        <span>{{ baseCurrency }}</span>
        <strong>→</strong>
        <select v-model="targetCurrency">
          <option
            v-for="option in currencyOptions"
            :key="option.value"
            :value="option.value"
            :disabled="option.value === baseCurrency"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="exchange-rate">
        <span>当前参考汇率</span>
        <strong v-if="activeRate">1 {{ baseCurrency }} = {{ activeRate.toFixed(4) }} {{ targetCurrency }}</strong>
        <strong v-else>等待汇率</strong>
      </div>
    </div>

    <div class="exchange-row compact">
      <label class="manual-rate">
        <span>手动汇率</span>
        <input
          v-model="manualRate"
          type="text"
          inputmode="decimal"
          placeholder="接口失败时填写"
        />
      </label>
      <div class="converted-preview">
        <span>建议售价折算</span>
        <strong v-if="convertedPrice">
          {{ formatMoney(convertedPrice, targetCurrency) }}
        </strong>
        <strong v-else>--</strong>
      </div>
    </div>

    <p v-if="errorMessage" class="exchange-status">{{ errorMessage }}</p>

    <div class="exchange-note">
      <strong>汇率仅作参考</strong>
      <span>
        自动汇率来自 Frankfurter，更新时间 {{ rateDate || '以接口返回为准' }}。实际收款、结汇、平台入账和支付服务商扣费可能使用不同汇率、手续费或结算时间，请以账单为准。
      </span>
    </div>
  </section>
</template>
