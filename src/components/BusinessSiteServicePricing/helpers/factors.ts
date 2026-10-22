import { hasNumber, money, percent } from './format'
import type { BusinessSiteServicePricingFactor } from './types'

export const hasAmount = (factor: BusinessSiteServicePricingFactor) => [factor.percent, factor.low, factor.high].some(hasNumber)

const factorValue = (factor: BusinessSiteServicePricingFactor) => [factor.percent, factor.low, factor.high].find(hasNumber) ?? 0

export const isNegativeFactor = (factor: BusinessSiteServicePricingFactor) => factorValue(factor) < 0

export function factorAmount(factor: BusinessSiteServicePricingFactor): string {
  const sign = isNegativeFactor(factor) ? '−' : '+'
  if (hasNumber(factor.percent)) return `${sign}${percent(Math.abs(factor.percent))}`
  const [low = 0, high = low] = [factor.low, factor.high].filter(hasNumber)
  return low === high ? `${sign}${money(low)}` : `${sign}${money(low)} to ${money(high)}`
}
