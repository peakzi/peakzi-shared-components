import type { CSSProperties } from 'react'
import { safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteFooterAppearance } from './types'

export function footerStyle(appearance: BusinessSiteFooterAppearance): CSSProperties {
  const background = safeColor(appearance.backgroundColor, '#12171c')
  const text = safeColor(appearance.textColor, '#f7f9fb')
  const accent = safeColor(appearance.accentColor, '#a5c9ee')

  return {
    '--pz-business-footer-background': background,
    '--pz-business-footer-text': text,
    '--pz-business-footer-accent': accent,
    '--pz-business-footer-font': safeFont(appearance.font ?? 'plex-sans'),
  } as CSSProperties
}
