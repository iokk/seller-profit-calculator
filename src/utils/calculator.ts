import type { CalculatorInput, CalculationResult } from '../types/calculator'

export function calculateProfit(input: CalculatorInput): CalculationResult {
  const fixedCost =
    clean(input.productCost) +
    clean(input.firstMileCost) +
    clean(input.lastMileCost) +
    clean(input.storageCost) +
    clean(input.taxCost) +
    clean(input.returnLossCost) +
    clean(input.otherCost)

  const variableFeeRate = clampRate(
    clean(input.platformFeeRate) + clean(input.paymentFeeRate) + clean(input.adFeeRate)
  )

  const targetProfitRate = clampRate(clean(input.targetProfitRate))
  const pricingRate = Math.min(variableFeeRate + targetProfitRate, 0.95)
  const recommendedPrice = fixedCost > 0 ? fixedCost / (1 - pricingRate) : 0
  const breakEvenPrice = fixedCost > 0 ? fixedCost / (1 - variableFeeRate) : 0
  const totalVariableFee = recommendedPrice * variableFeeRate
  const profit = recommendedPrice - fixedCost - totalVariableFee
  const profitRate = recommendedPrice > 0 ? profit / recommendedPrice : 0

  return {
    fixedCost,
    variableFeeRate,
    breakEvenPrice,
    recommendedPrice,
    profit,
    profitRate
  }
}

function clean(value: number) {
  return Number.isFinite(value) ? Math.max(value, 0) : 0
}

function clampRate(value: number) {
  return Math.min(Math.max(value, 0), 0.95)
}
