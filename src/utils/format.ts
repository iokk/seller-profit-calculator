import type { Currency } from '../types/calculator'

export function formatMoney(value: number, currency: Currency = 'CNY') {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(Number.isFinite(value) ? value : 0)
}

export function formatPercent(value: number) {
  return `${((Number.isFinite(value) ? value : 0) * 100).toFixed(2)}%`
}
