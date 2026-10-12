import type { CSSProperties } from 'react'
import { readableText, safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteOffersAppearance } from './types'

export function offersStyle(appearance: BusinessSiteOffersAppearance): CSSProperties {
  const background = safeColor(appearance.backgroundColor, '#ffffff')
  const text = safeColor(appearance.textColor, '#12171c')
  const accent = safeColor(appearance.accentColor, '#1d4f8c')
  const cardBackground = safeColor(appearance.cardBackgroundColor, background)
  const cardAccent = safeColor(appearance.cardAccentColor, accent)
  return {
    '--pz-business-offers-background': background,
    '--pz-business-offers-text': text,
    '--pz-business-offers-accent': accent,
    '--pz-business-offers-card-background': cardBackground,
    '--pz-business-offers-card-end': safeColor(appearance.cardGradientEndColor, cardBackground),
    '--pz-business-offers-card-text': safeColor(appearance.cardTextColor, text),
    '--pz-business-offers-card-accent': cardAccent,
    '--pz-business-offers-action-text': readableText('#ffffff', cardAccent),
    '--pz-business-offers-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-offers-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-offers-radius': ['2px', '8px', '16px', '32px'].find((radius) => radius === appearance.buttonRadius) ?? '8px',
  } as CSSProperties
}
