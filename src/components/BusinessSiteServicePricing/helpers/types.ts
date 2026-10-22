import type { BusinessSiteServicesAppearance } from '../../BusinessSiteServices/helpers/types'

export interface BusinessSiteServicePricingFactor {
  label: string
  /** Dollar amount. A point value (`low === high`) or a range. Omit when using `percent`. */
  low?: number
  high?: number
  /** Signed percentage factor, e.g. a membership discount. Omit when using `low`/`high`. */
  percent?: number
}

export interface BusinessSiteServicePricingTier {
  name: string
  /** Business price range, in dollars. Omit when this job type isn't priced online ("Priced on site"). */
  low?: number
  high?: number
  /** Typical/market price range, in dollars. Omit when there's no market comparison for this job type. */
  typicalLow?: number
  typicalHigh?: number
  included?: readonly string[]
  factors?: readonly BusinessSiteServicePricingFactor[]
}

export interface BusinessSiteServicePricingSentiment {
  key: 'great' | 'ok'
  label: string
  /** 0–100. */
  businessPercentage: number
  marketPercentage: number
}

export interface BusinessSiteServicePricingFairValue {
  businessPercentage: number
  marketPercentage: number
}

export interface BusinessSiteServicePricingProps {
  isLoading?: boolean
  businessName: string
  /** Shorter name for the comparison-bar row label. Defaults to `businessName`. */
  shortBusinessName?: string
  service: string
  phoneHref?: string
  /** Signed percent vs the local market average. Shown only when below market (negative). */
  vsMarketPercentage?: number | null
  /** Shown only when `businessPercentage >= marketPercentage` — otherwise it isn't a claim worth making. */
  fairValue?: BusinessSiteServicePricingFairValue | null
  sentiments?: readonly BusinessSiteServicePricingSentiment[]
  /** All job types render. Compact stacks them one per row; comfortable wraps them into rows of at most three cards. */
  tiers?: readonly BusinessSiteServicePricingTier[]
  /** 'always' shows the typical-price comparison whenever both ranges exist. 'lower-only' shows it only when the business range is at or below typical. Default 'always'. */
  typicalComparison?: 'always' | 'lower-only'
  /** Default: `Pricing · {service}`. */
  eyebrow?: string
  title?: string
  perceptionTitle?: string
  perceptionCaption?: string
  appearance?: BusinessSiteServicesAppearance
  sectionId?: string
  className?: string
}
