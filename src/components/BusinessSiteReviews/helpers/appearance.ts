import type { CSSProperties } from 'react'
import { readableText, safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteReviewsAppearance } from './types'

export function reviewsStyle(appearance: BusinessSiteReviewsAppearance): CSSProperties {
  const accent = safeColor(appearance.accentColor, '#1d4f8c')
  return {
    '--pz-business-reviews-background': safeColor(appearance.backgroundColor, '#ffffff'),
    '--pz-business-reviews-text': safeColor(appearance.textColor, '#12171c'),
    '--pz-business-reviews-accent': accent,
    '--pz-business-reviews-avatar-text': readableText('#ffffff', accent),
    '--pz-business-reviews-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-reviews-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-reviews-radius': ['2px', '8px', '16px', '32px'].find((radius) => radius === appearance.buttonRadius) ?? '8px',
  } as CSSProperties
}
