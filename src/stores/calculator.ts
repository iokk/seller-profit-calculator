import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { CalculatorInput, Preset } from '../types/calculator'
import { calculateProfit } from '../utils/calculator'

const STORAGE_KEY = 'seller-profit-calculator-input-v2'
const MAX_AMOUNT = 99999999

type AmountKey =
  | 'sellingPrice'
  | 'productCost'
  | 'firstMileCost'
  | 'lastMileCost'
  | 'storageCost'
  | 'taxCost'
  | 'returnLossCost'
  | 'otherCost'

type RateKey =
  | 'platformFeeRate'
  | 'paymentFeeRate'
  | 'adFeeRate'
  | 'activityFeeRate'
  | 'affiliateFeeRate'
  | 'otherFeeRate'
  | 'targetProfitRate'

const defaultInput: CalculatorInput = {
  sellingPrice: 0,
  productCost: 0,
  firstMileCost: 0,
  lastMileCost: 0,
  platformFeeRate: 0,
  paymentFeeRate: 0,
  adFeeRate: 0,
  activityFeeRate: 0,
  affiliateFeeRate: 0,
  otherFeeRate: 0,
  storageCost: 0,
  taxCost: 0,
  returnLossCost: 0,
  otherCost: 0,
  targetProfitRate: 0,
  currency: 'CNY'
}

const defaultPresets: Preset[] = [
  {
    id: 'independent-site',
    name: '独立站',
    description: '适合 Shopify、WooCommerce 等独立站卖家',
    input: {
      platformFeeRate: 0.02,
      paymentFeeRate: 0.035,
      adFeeRate: 0.12,
      otherFeeRate: 0.01
    }
  },
  {
    id: 'amazon-fba',
    name: 'Amazon FBA',
    description: '适合亚马逊 FBA 初步估算',
    input: {
      platformFeeRate: 0.15,
      paymentFeeRate: 0.02,
      adFeeRate: 0.1,
      activityFeeRate: 0.02
    }
  },
  {
    id: 'tiktok-shop',
    name: 'TikTok Shop',
    description: '适合 TikTok Shop 卖家快速测算',
    input: {
      platformFeeRate: 0.06,
      paymentFeeRate: 0.03,
      adFeeRate: 0.15,
      affiliateFeeRate: 0.03
    }
  },
  {
    id: 'oversea-warehouse',
    name: '海外仓',
    description: '适合海外仓发货模式',
    input: {
      firstMileCost: 10,
      lastMileCost: 12,
      storageCost: 3,
      platformFeeRate: 0.05
    }
  }
]

export const useCalculatorStore = defineStore('calculator', () => {
  const input = ref<CalculatorInput>(loadInput())
  const presets = ref<Preset[]>(defaultPresets)
  const resetToken = ref(0)
  const result = computed(() => calculateProfit(input.value))

  function applyPreset(preset: Preset) {
    input.value = {
      ...input.value,
      ...preset.input
    }
  }

  function reset() {
    input.value = { ...defaultInput }
    resetToken.value += 1
  }

  function updateAmount(key: AmountKey, value: string) {
    input.value[key] = sanitizeNumber(value, MAX_AMOUNT)
  }

  function updateRate(key: RateKey, value: string) {
    const maxPercent = key === 'targetProfitRate' ? 80 : 90
    input.value[key] = sanitizeNumber(value, maxPercent) / 100
  }

  watch(
    input,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true }
  )

  return {
    input,
    presets,
    resetToken,
    result,
    applyPreset,
    reset,
    updateAmount,
    updateRate
  }
})

function loadInput(): CalculatorInput {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultInput, ...JSON.parse(saved) } : { ...defaultInput }
  } catch {
    return { ...defaultInput }
  }
}

function sanitizeNumber(value: string, max: number) {
  const cleaned = value
    .replace(/[^\d.]/g, '')
    .replace(/(\..*)\./g, '$1')

  const [integerPart, decimalPart = ''] = cleaned.split('.')
  const normalized = decimalPart
    ? `${integerPart || '0'}.${decimalPart.slice(0, 2)}`
    : integerPart

  const number = Number(normalized)

  if (!Number.isFinite(number)) return 0

  return Math.min(Math.max(number, 0), max)
}
