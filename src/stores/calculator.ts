import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { CalculatorInput, Preset } from '../types/calculator'
import { calculateProfit } from '../utils/calculator'

const STORAGE_KEY = 'seller-profit-calculator-input'

const defaultInput: CalculatorInput = {
  productCost: 50,
  firstMileCost: 8,
  lastMileCost: 15,
  platformFeeRate: 0.08,
  paymentFeeRate: 0.035,
  adFeeRate: 0.1,
  storageCost: 2,
  taxCost: 0,
  returnLossCost: 3,
  otherCost: 0,
  targetProfitRate: 0.2,
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
      adFeeRate: 0.12
    }
  },
  {
    id: 'amazon-fba',
    name: 'Amazon FBA',
    description: '适合亚马逊 FBA 初步估算',
    input: {
      platformFeeRate: 0.15,
      paymentFeeRate: 0.02,
      adFeeRate: 0.1
    }
  },
  {
    id: 'tiktok-shop',
    name: 'TikTok Shop',
    description: '适合 TikTok Shop 卖家快速测算',
    input: {
      platformFeeRate: 0.06,
      paymentFeeRate: 0.03,
      adFeeRate: 0.15
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
  const result = computed(() => calculateProfit(input.value))

  function applyPreset(preset: Preset) {
    input.value = {
      ...input.value,
      ...preset.input
    }
  }

  function reset() {
    input.value = { ...defaultInput }
  }

  function updateRate(key: 'platformFeeRate' | 'paymentFeeRate' | 'adFeeRate' | 'targetProfitRate', value: string) {
    const rate = Number(value) / 100
    input.value[key] = Number.isFinite(rate) ? rate : 0
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
    result,
    applyPreset,
    reset,
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
