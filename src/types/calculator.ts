export type Currency = 'CNY' | 'USD' | 'EUR' | 'GBP'

export interface CalculatorInput {
  productCost: number
  firstMileCost: number
  lastMileCost: number
  platformFeeRate: number
  paymentFeeRate: number
  adFeeRate: number
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
  breakEvenPrice: number
  recommendedPrice: number
  profit: number
  profitRate: number
}

export interface Preset {
  id: string
  name: string
  description: string
  input: Partial<CalculatorInput>
}
