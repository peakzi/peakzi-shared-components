import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export interface BusinessSiteOffer {
  id: string
  title: string
  badge?: string
  description?: string
  features?: readonly string[]
  terms?: string
  redemptionInstructions?: string
  code?: string
  /** ISO date or timestamp supplied by the API; availability belongs to the backend. */
  expiresOn?: string
  action?: { label: string; href: string; newTab?: boolean }
}

export interface BusinessSiteOffersAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  textColor?: string
  accentColor?: string
  /** Card surfaces are independent of the surrounding section. */
  cardBackgroundColor?: string
  cardGradientEndColor?: string
  cardTextColor?: string
  cardAccentColor?: string
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  density?: 'comfortable' | 'compact'
  motion?: BusinessSiteMotion
}

export interface BusinessSiteOffersProps {
  items: readonly BusinessSiteOffer[]
  layout?: 'carousel' | 'grid'
  /** Short cards with server-rendered full details; native disclosure is the fallback when viewAll is absent. */
  preview?: boolean
  title?: string
  eyebrow?: string
  description?: string
  viewAll?: { label: string; href: string; newTab?: boolean }
  appearance?: BusinessSiteOffersAppearance
  sectionId?: string
  className?: string
}
