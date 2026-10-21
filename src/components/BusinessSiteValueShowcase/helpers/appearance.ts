import type { CSSProperties } from 'react'
import { readableText, safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteValueShowcaseAppearance } from './types'

const RADII = ['2px', '8px', '16px', '32px'] as const

/** sRGB mix of two #rrggbb colours; same result as color-mix(in srgb, a weight, b). */
export function mixHex(a: string, b: string, weight: number): string {
  const channel = (hex: string, index: number) => Number.parseInt(hex.slice(index, index + 2), 16)
  return `#${[1, 3, 5].map((index) => Math.round(channel(a, index) * weight + channel(b, index) * (1 - weight)).toString(16).padStart(2, '0')).join('')}`
}

export function valueShowcaseStyle(appearance: BusinessSiteValueShowcaseAppearance): CSSProperties {
  const background = safeColor(appearance.backgroundColor, '#ffffff')
  const start = safeColor(appearance.gradientStartColor, '#12171c')
  const end = safeColor(appearance.gradientEndColor, start)
  const text = readableText(start, background)
  const accent = readableText(safeColor(appearance.accentColor, end), background)
  // Deepen the light end of the fill so white text and icons stay readable on it.
  const fillEnd = mixHex(end, start, 0.7)
  const onFill = readableText('#ffffff', fillEnd)
  const radius = RADII.find((option) => option === appearance.buttonRadius) ?? '8px'

  return {
    '--pz-business-value-showcase-background': background,
    '--pz-business-value-showcase-text': text,
    '--pz-business-value-showcase-text-2': `color-mix(in srgb, ${text} 72%, ${background})`,
    '--pz-business-value-showcase-muted': `color-mix(in srgb, ${text} 64%, ${background})`,
    '--pz-business-value-showcase-accent': accent,
    '--pz-business-value-showcase-tint': `color-mix(in srgb, ${end} 12%, ${background})`,
    '--pz-business-value-showcase-border': `color-mix(in srgb, ${text} 14%, transparent)`,
    '--pz-business-value-showcase-fill': `linear-gradient(135deg, ${start}, ${fillEnd})`,
    '--pz-business-value-showcase-on-fill': onFill,
    '--pz-business-value-showcase-ring': `color-mix(in srgb, ${end} 35%, #ffffff)`,
    '--pz-business-value-showcase-ring-shade': `color-mix(in srgb, ${start} 30%, transparent)`,
    '--pz-business-value-showcase-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-value-showcase-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-value-showcase-radius': radius,
    '--pz-business-value-showcase-radius-sm': `min(${radius}, 8px)`,
  } as CSSProperties
}
