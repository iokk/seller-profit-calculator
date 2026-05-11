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
    clean(input.platformFeeRate) +
      clean(input.paymentFeeRate) +
      clean(input.adFeeRate) +
      clean(input.activityFeeRate) +
      clean(input.affiliateFeeRate) +
      clean(input.otherFeeRate)
  )

  const targetProfitRate = clampRate(clean(input.targetProfitRate))
  const pricingRate = variableFeeRate + targetProfitRate
  const canRecommendPrice = fixedCost > 0 && pricingRate < 1
  const pricingWarning =
    pricingRate >= 1
      ? '当前比例扣款与目标利润率合计已达到或超过 100%，无法反推合理建议售价。'
      : ''
  const recommendedPrice = canRecommendPrice ? fixedCost / (1 - pricingRate) : 0
  const breakEvenPrice = fixedCost > 0 ? fixedCost / (1 - variableFeeRate) : 0
  const totalVariableFee = recommendedPrice * variableFeeRate
  const platformFee = recommendedPrice * clean(input.platformFeeRate)
  const paymentFee = recommendedPrice * clean(input.paymentFeeRate)
  const adFee = recommendedPrice * clean(input.adFeeRate)
  const activityFee = recommendedPrice * clean(input.activityFeeRate)
  const affiliateFee = recommendedPrice * clean(input.affiliateFeeRate)
  const otherVariableFee = recommendedPrice * clean(input.otherFeeRate)
  const profit = recommendedPrice - fixedCost - totalVariableFee
  const profitRate = recommendedPrice > 0 ? profit / recommendedPrice : 0
  const sellingPrice = clean(input.sellingPrice)
  const sellingPriceVariableFee = sellingPrice * variableFeeRate
  const sellingPriceProfit = sellingPrice - fixedCost - sellingPriceVariableFee
  const sellingPriceProfitRate = sellingPrice > 0 ? sellingPriceProfit / sellingPrice : 0

  return {
    fixedCost,
    variableFeeRate,
    pricingRate,
    canRecommendPrice,
    pricingWarning,
    breakEvenPrice,
    recommendedPrice,
    platformFee,
    paymentFee,
    adFee,
    activityFee,
    affiliateFee,
    otherVariableFee,
    totalVariableFee,
    profit,
    profitRate,
    sellingPrice,
    sellingPriceVariableFee,
    sellingPriceProfit,
    sellingPriceProfitRate
  }
}

function clean(value: number) {
  return Number.isFinite(value) ? Math.max(value, 0) : 0
}

function clampRate(value: number) {
  return Math.min(Math.max(value, 0), 0.95)
}
