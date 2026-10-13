import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export interface BusinessSiteReview {
  id: string
  text: string
  reviewerName?: string
  /** Missing or invalid ratings are omitted, never replaced with five stars. */
  rating?: number | null
  /** ISO date or timestamp supplied by the API. */
  reviewDate?: string | null
  /** Backend-supplied topics. Each topic counts once per displayed review. */
  tags?: readonly string[]
  /** Literal phrases to highlight; review wording is never replaced. */
  highlightedPhrases?: readonly string[]
}

export interface BusinessSiteReviewsSummary {
  rating?: number | null
  reviewCount?: number | null
  /** Use a source-specific label only when that source is known. */
  label?: string
}

export interface BusinessSiteReviewsAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  /** Shared dark gradient used by the summary and review-card stars. */
  gradientStartColor?: string
  gradientEndColor?: string
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  density?: 'comfortable' | 'compact'
  motion?: BusinessSiteMotion
}

export interface BusinessSiteReviewsProps {
  items: readonly BusinessSiteReview[]
  title?: string
  eyebrow?: string
  summary?: BusinessSiteReviewsSummary
  viewAll?: { label: string; href: string; newTab?: boolean }
  appearance?: BusinessSiteReviewsAppearance
  sectionId?: string
  className?: string
}
