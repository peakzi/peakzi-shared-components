import type { CSSProperties } from 'react'
import { readableText, safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteContentListAppearance } from './types'

const RADII = ['2px', '8px', '16px', '32px'] as const

export function contentListStyle(appearance: BusinessSiteContentListAppearance): CSSProperties {
  const background = safeColor(appearance.backgroundColor, '#ffffff')
  const accent = safeColor(appearance.accentColor, '#1d4f8c')
  return {
    '--pz-business-content-list-background': background,
    '--pz-business-content-list-text': safeColor(appearance.textColor, '#12171c'),
    '--pz-business-content-list-accent': accent,
    '--pz-business-content-list-link': readableText(accent, background),
    '--pz-business-content-list-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-content-list-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-content-list-radius': RADII.find((radius) => radius === appearance.buttonRadius) ?? '8px',
  } as CSSProperties
}
