import { hasNumber, lowercaseWords, money, percent } from './format'
import type { TierView } from './tiers'
import type {
  BusinessSiteServicePricingFairValue, BusinessSiteServicePricingSentiment, BusinessSiteServicePricingTier,
} from './types'

export interface PricingStat {
  value: string
  label: string
  sub: string
}

/** Fair value is only a claim worth making when the business is at or above the market. */
export function resolveFairValue(fairValue: BusinessSiteServicePricingFairValue | null | undefined) {
  return fairValue && hasNumber(fairValue.businessPercentage) && hasNumber(fairValue.marketPercentage)
    && fairValue.businessPercentage >= fairValue.marketPercentage ? fairValue : null
}

export function pricingStats(
  vsMarketPercentage: number | null | undefined,
  fairValue: BusinessSiteServicePricingFairValue | null,
): PricingStat[] {
  return [
    ...(hasNumber(vsMarketPercentage) && vsMarketPercentage < 0
      ? [{ value: percent(Math.abs(vsMarketPercentage)), label: 'below the local market average', sub: 'Same job types, same area' }]
      : []),
    ...(fairValue
      ? [{ value: percent(fairValue.businessPercentage), label: 'rate the price fair or better', sub: `Market average ${percent(fairValue.marketPercentage)}` }]
      : []),
  ]
}

export const usableSentiments = (sentiments: readonly BusinessSiteServicePricingSentiment[]) =>
  sentiments.filter((sentiment) => hasNumber(sentiment?.businessPercentage) && hasNumber(sentiment?.marketPercentage))

/** One rating bucket alongside a fair-value stat would only repeat it. */
export const showPerception = (sentimentCount: number, fairValue: BusinessSiteServicePricingFairValue | null) =>
  sentimentCount > 1 || (sentimentCount === 1 && !fairValue)

export function pricingLede(service: string, tiers: readonly BusinessSiteServicePricingTier[], views: readonly TierView[]): string {
  const priced = views.filter((view) => view.hasPrice)
  if (priced.length === 0) {
    return `Every ${lowercaseWords(service)} job is priced after the technician sees it. You get the price in writing before work starts.`
  }
  if (priced.length === 1) return `${priced[0]!.name} usually costs ${priced[0]!.priceRange}.`

  const pricedTiers = tiers.filter((tier) => hasNumber(tier.low) && hasNumber(tier.high))
  const lows = pricedTiers.map((tier) => tier.low!)
  const highs = pricedTiers.map((tier) => tier.high!)
  return `${service} jobs cost ${money(Math.min(...lows))} to ${money(Math.max(...highs))}, depending on the work. Each job type is broken down below.`
}
