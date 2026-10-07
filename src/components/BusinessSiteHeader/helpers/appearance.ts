import type { CSSProperties } from 'react'
import { readableText, safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteHeaderAppearance, BusinessSiteHeaderButtonRadius } from './types'

const BUTTON_RADII: readonly BusinessSiteHeaderButtonRadius[] = ['2px', '8px', '16px', '32px']

export function headerStyle(appearance: BusinessSiteHeaderAppearance): CSSProperties {
  const background = safeColor(appearance.backgroundColor, '#ffffff')
  const text = safeColor(appearance.textColor, '#12171c')
  const accent = safeColor(appearance.accentColor, '#1d4f8c')
  const font = safeFont(appearance.font ?? 'plex-sans')
  const buttonRadius = BUTTON_RADII.find((radius) => radius === appearance.buttonRadius) ?? '8px'

  return {
    '--pz-business-header-background': background,
    '--pz-business-header-text': text,
    '--pz-business-header-accent': accent,
    '--pz-business-header-on-accent': readableText('#ffffff', accent),
    '--pz-business-header-link-accent': accent,
    '--pz-business-header-font': font,
    '--pz-business-header-radius': buttonRadius,
  } as CSSProperties
}
