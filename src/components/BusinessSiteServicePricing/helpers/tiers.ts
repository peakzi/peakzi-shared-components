import { hasAmount, isNegativeFactor } from './factors'
import { hasNumber, range } from './format'
import type { BusinessSiteServicePricingFactor, BusinessSiteServicePricingTier } from './types'

export interface TierView {
  name: string
  hasPrice: boolean
  priceRange: string
  showTypical: boolean
  typicalRange: string
  typicalNote: string
  isBelowTypical: boolean
  ourBarStyle?: { left: string; width: string } | undefined
  typicalBarStyle?: { left: string; width: string } | undefined
  included: readonly string[]
  lowers: readonly BusinessSiteServicePricingFactor[]
  raisers: readonly BusinessSiteServicePricingFactor[]
  isBare: boolean
}

export function buildTierView(tier: BusinessSiteServicePricingTier, typicalComparison: 'always' | 'lower-only'): TierView {
  const hasPrice = hasNumber(tier.low) && hasNumber(tier.high)
  const hasTypical = hasPrice && hasNumber(tier.typicalLow) && hasNumber(tier.typicalHigh)
  const lower = hasTypical && tier.high! <= tier.typicalHigh!
  const showTypical = hasTypical && (typicalComparison === 'always' || lower)

  const max = Math.max(tier.high ?? 0, tier.typicalHigh ?? 0) * 1.08 || 1
  const percentOf = (value: number) => `${((value / max) * 100).toFixed(2)}%`
  const barStyle = (low: number, high: number) => ({ left: percentOf(low), width: `calc(${percentOf(high)} - ${percentOf(low)})` })

  const factors = (tier.factors ?? []).filter(hasAmount)
  const included = tier.included ?? []

  return {
    name: tier.name,
    hasPrice,
    priceRange: hasPrice ? range(tier.low!, tier.high!) : '',
    showTypical,
    typicalRange: hasTypical ? range(tier.typicalLow!, tier.typicalHigh!) : '',
    typicalNote: !hasTypical ? '' : lower ? 'Below typical' : tier.low! >= tier.typicalHigh! ? 'Above typical' : 'Within typical',
    isBelowTypical: lower,
    ourBarStyle: showTypical ? barStyle(tier.low!, tier.high!) : undefined,
    typicalBarStyle: showTypical ? barStyle(tier.typicalLow!, tier.typicalHigh!) : undefined,
    included,
    lowers: factors.filter(isNegativeFactor),
    raisers: factors.filter((factor) => !isNegativeFactor(factor)),
    isBare: factors.length === 0 && included.length === 0,
  }
}
