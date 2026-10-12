import type { CSSProperties } from 'react'
import { readableText, safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteBlogsAppearance } from './types'

export function blogsStyle(appearance: BusinessSiteBlogsAppearance): CSSProperties {
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
    '--pz-business-blogs-background': background,
    '--pz-business-blogs-text': text,
    '--pz-business-blogs-accent': accent,
    '--pz-business-blogs-gradient-start': start,
    '--pz-business-blogs-gradient-end': end,
    '--pz-business-blogs-fill': fill,
    '--pz-business-blogs-on-accent': readableText(background, usesPalette ? start : accent),
    '--pz-business-blogs-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-blogs-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-blogs-radius': ['2px', '8px', '16px', '32px'].find((radius) => radius === appearance.buttonRadius) ?? '8px',
  } as CSSProperties
}
