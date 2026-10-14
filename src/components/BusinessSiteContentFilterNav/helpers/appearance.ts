import type { CSSProperties } from 'react'
import { readableText, safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteContentFilterNavAppearance } from './types'

const RADII = ['2px', '8px', '16px', '32px'] as const

export function contentFilterNavStyle(appearance: BusinessSiteContentFilterNavAppearance): CSSProperties {
  const background = safeColor(appearance.backgroundColor, '#ffffff')
  const start = safeColor(appearance.gradientStartColor, '#12171c')
  const end = safeColor(appearance.gradientEndColor, start)
  const usesPalette = appearance.gradientStartColor !== undefined || appearance.gradientEndColor !== undefined
  const text = readableText(usesPalette ? start : safeColor(appearance.textColor, start), background)
  const accent = usesPalette ? text : safeColor(appearance.accentColor, text)
  const fill = !usesPalette && appearance.accentColor
    ? `linear-gradient(135deg, ${accent}, ${accent})`
    : `linear-gradient(135deg, ${start}, ${end})`
  return {
    '--pz-business-content-filter-nav-background': background,
    '--pz-business-content-filter-nav-text': text,
    '--pz-business-content-filter-nav-accent': accent,
    '--pz-business-content-filter-nav-fill': fill,
    '--pz-business-content-filter-nav-on-accent': readableText(background, usesPalette ? start : accent),
    '--pz-business-content-filter-nav-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-content-filter-nav-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-content-filter-nav-radius': RADII.find((radius) => radius === appearance.buttonRadius) ?? '8px',
  } as CSSProperties
}
