import type { CSSProperties } from 'react'
import { readableText, safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteContentListAppearance } from './types'

const RADII = ['2px', '8px', '16px', '32px'] as const

export function contentListStyle(appearance: BusinessSiteContentListAppearance): CSSProperties {
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
    '--pz-business-content-list-background': background,
    '--pz-business-content-list-text': text,
    '--pz-business-content-list-accent': accent,
    '--pz-business-content-list-fill': fill,
    '--pz-business-content-list-on-accent': readableText(background, usesPalette ? start : accent),
    '--pz-business-content-list-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-content-list-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-content-list-radius': RADII.find((radius) => radius === appearance.buttonRadius) ?? '8px',
  } as CSSProperties
}
