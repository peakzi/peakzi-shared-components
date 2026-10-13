import type { CSSProperties } from 'react'
import { readableText, safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteReviewsAppearance } from './types'

export function reviewsStyle(appearance: BusinessSiteReviewsAppearance): CSSProperties {
  const background = safeColor(appearance.backgroundColor, '#ffffff')
  const start = safeColor(appearance.gradientStartColor, '#12171c')
  const end = safeColor(appearance.gradientEndColor, start)
  const gradient = `linear-gradient(135deg, ${start}, ${end})`
  const text = readableText(start, background)
  const summaryText = readableText(background, start)
  return {
    '--pz-business-reviews-background': background,
    '--pz-business-reviews-text': text,
    '--pz-business-reviews-accent': text,
    '--pz-business-reviews-gradient-start': start,
    '--pz-business-reviews-gradient-end': end,
    '--pz-business-reviews-fill': gradient,
    '--pz-business-reviews-summary-background': start,
    '--pz-business-reviews-summary-fill': gradient,
    '--pz-business-reviews-summary-text': summaryText,
    '--pz-business-reviews-summary-accent': summaryText,
    '--pz-business-reviews-summary-chip-background': `color-mix(in srgb, ${background} 8%, ${start})`,
    '--pz-business-reviews-button-background': background,
    '--pz-business-reviews-avatar-text': summaryText,
    '--pz-business-reviews-button-text': text,
    '--pz-business-reviews-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-reviews-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-reviews-radius': ['2px', '8px', '16px', '32px'].find((radius) => radius === appearance.buttonRadius) ?? '8px',
  } as CSSProperties
}
