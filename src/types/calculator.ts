export type Currency = 'CNY' | 'USD' | 'EUR' | 'GBP'

export interface CalculatorInput {
  sellingPrice: number
  productCost: number
  firstMileCost: number
  lastMileCost: number
  platformFeeRate: number
  paymentFeeRate: number
  adFeeRate: number
  activityFeeRate: number
  affiliateFeeRate: number
  otherFeeRate: number
  storageCost: number
  taxCost: number
  returnLossCost: number
  otherCost: number
  targetProfitRate: number
  currency: Currency
}

export interface CalculationResult {
  fixedCost: number
  variableFeeRate: number
  pricingRate: number
  canRecommendPrice: boolean
  pricingWarning: string
  breakEvenPrice: number
  recommendedPrice: number
  platformFee: number
  paymentFee: number
  adFee: number
  activityFee: number
  affiliateFee: number
  otherVariableFee: number
  totalVariableFee: number
  profit: number
  profitRate: number
  sellingPrice: number
  sellingPriceVariableFee: number
  sellingPriceProfit: number
  sellingPriceProfitRate: number
}

export interface Preset {
  id: string
  name: string
  description: string
  input: Partial<CalculatorInput>
}
