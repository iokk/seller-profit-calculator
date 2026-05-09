<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useCalculatorStore } from '../stores/calculator'
import type { Currency } from '../types/calculator'
import { formatMoney } from '../utils/format'

const store = useCalculatorStore()
const referenceCurrency = ref<Currency>('USD')
const rate = ref<number | null>(null)
const customRate = ref('')
const rateDate = ref('')
const isLoading = ref(false)

const currencyOptions: { value: Currency; label: string }[] = [
  { value: 'CNY', label: 'CNY' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' }
]

const quoteCurrency = computed(() => store.input.currency)
const activeRate = computed(() => {
  const fallback = Number(customRate.value)
  return Number.isFinite(fallback) && fallback > 0 ? fallback : rate.value
})
const convertedPrice = computed(() =>
  activeRate.value ? store.result.recommendedPrice / activeRate.value : null
)
const rateLabel = computed(() => `1 ${referenceCurrency.value} = ? ${quoteCurrency.value}`)
const convertedLabel = computed(() => `建议售价折算为 ${referenceCurrency.value}`)

watch(
  quoteCurrency,
  (currency) => {
    if (referenceCurrency.value === currency) {
      referenceCurrency.value = currency === 'USD' ? 'CNY' : 'USD'
    }
  },
  { immediate: true }
)

watch(
  [quoteCurrency, referenceCurrency],
  () => {
    customRate.value = ''
    fetchRate()
  },
  { immediate: true }
)

watch(
  () => store.resetToken,
  () => {
    customRate.value = ''
  }
)

async function fetchRate() {
  if (referenceCurrency.value === quoteCurrency.value) return

  isLoading.value = true
  rate.value = null

  try {
    const response = await fetch(
      `https://api.frankfurter.dev/v2/rate/${referenceCurrency.value}/${quoteCurrency.value}`
    )

    if (!response.ok) throw new Error('rate unavailable')

    const data = (await response.json()) as { date?: string; rate?: number }
    if (!Number.isFinite(data.rate)) throw new Error('rate unavailable')

    rate.value = Number(data.rate)
    rateDate.value = data.date || ''
  } catch {
    rateDate.value = ''
  } finally {
    isLoading.value = false
  }
}

function updateCustomRate(value: string) {
  const normalized = value.replace(/[^\d.]/g, '')
  const [integer = '', decimal = ''] = normalized.split('.')
  const nextValue = `${integer.slice(0, 3)}${normalized.includes('.') ? `.${decimal.slice(0, 5)}` : ''}`
  const nextRate = Number(nextValue)

  customRate.value = Number.isFinite(nextRate) && nextRate > 999.99999 ? '999.99999' : nextValue
}

function formatRate(value: number) {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5
  })
}
</script>

<template>
  <section class="exchange-card">
    <div class="exchange-header">
      <div>
        <p class="eyebrow">Exchange Rate</p>
        <h2>汇率参考</h2>
      </div>
      <span class="result-pill">{{ isLoading ? '正在更新' : 'Frankfurter' }}</span>
    </div>

    <div class="exchange-row">
      <div class="exchange-pair">
        <span>1</span>
        <select v-model="referenceCurrency">
          <option
            v-for="option in currencyOptions"
            :key="option.value"
            :value="option.value"
            :disabled="option.value === quoteCurrency"
          >
            {{ option.label }}
          </option>
        </select>
        <strong>=</strong>
        <span class="quote-code">{{ quoteCurrency }}</span>
      </div>

      <div class="exchange-rate">
        <span>当前参考汇率</span>
        <strong v-if="activeRate">
          1 {{ referenceCurrency }} = {{ formatRate(activeRate) }} {{ quoteCurrency }}
        </strong>
        <strong v-else>等待汇率</strong>
      </div>
    </div>

    <div class="exchange-row compact">
      <label class="manual-rate">
        <span>自定义汇率</span>
        <input
          :value="customRate"
          type="text"
          inputmode="decimal"
          maxlength="9"
          :placeholder="rateLabel"
          @input="updateCustomRate(($event.target as HTMLInputElement).value)"
        />
        <small>最多 5 位小数，最高 999.99999</small>
      </label>
      <div class="converted-preview">
        <span>{{ convertedLabel }}</span>
        <strong v-if="convertedPrice">
          {{ formatMoney(convertedPrice, referenceCurrency) }}
        </strong>
        <strong v-else>--</strong>
      </div>
    </div>

    <div class="exchange-note">
      <strong>汇率仅作参考</strong>
      <span>
        自动汇率来自 Frankfurter，更新时间 {{ rateDate || '以接口返回为准' }}。实际收款、结汇、平台入账和支付服务商扣费可能使用不同汇率、手续费或结算时间，请以账单为准。
      </span>
    </div>
  </section>
</template>
