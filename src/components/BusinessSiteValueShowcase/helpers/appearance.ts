import type { CSSProperties } from 'react'
import { readableText, safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteValueShowcaseAppearance } from './types'

const RADII = ['2px', '8px', '16px', '32px'] as const
const BACKGROUNDS = ['surface', 'tint', 'soft', 'gradient', 'ink'] as const
export type ValueShowcaseBackground = (typeof BACKGROUNDS)[number]

export function valueShowcaseBackground(value: unknown): ValueShowcaseBackground {
  return BACKGROUNDS.find((option) => option === value) ?? 'gradient'
}

export function valueShowcaseStyle(appearance: BusinessSiteValueShowcaseAppearance): CSSProperties {
  const background = safeColor(appearance.backgroundColor, '#ffffff')
  const start = safeColor(appearance.gradientStartColor, '#12171c')
  const end = safeColor(appearance.gradientEndColor, start)
  const accent = safeColor(appearance.accentColor, end)
  const band = valueShowcaseBackground(appearance.background)
  const dark = band === 'gradient' || band === 'ink'
  const text = readableText(start, background)
  const tint = `color-mix(in srgb, ${end} 12%, ${background})`
  const bandText = dark ? readableText(background, start) : text
  const bandBase = dark ? start : background
  const bandFill = {
    surface: background,
    tint,
    soft: `linear-gradient(180deg, ${tint}, ${background})`,
    gradient: `linear-gradient(135deg, ${start}, ${end})`,
    ink: start,
  }[band]

  return {
    '--pz-business-value-showcase-background': background,
    '--pz-business-value-showcase-text': text,
    '--pz-business-value-showcase-text-2': `color-mix(in srgb, ${text} 72%, ${background})`,
    '--pz-business-value-showcase-rank': readableText(end, background),
    '--pz-business-value-showcase-tint': tint,
    '--pz-business-value-showcase-border': `color-mix(in srgb, ${text} 14%, transparent)`,
    '--pz-business-value-showcase-band': bandFill,
    '--pz-business-value-showcase-band-text': bandText,
    '--pz-business-value-showcase-band-text-2': `color-mix(in srgb, ${bandText} 82%, ${bandBase})`,
    '--pz-business-value-showcase-chip-background': band === 'surface' ? tint : background,
    '--pz-business-value-showcase-chip-text': text,
    '--pz-business-value-showcase-accent': accent,
    '--pz-business-value-showcase-on-accent': readableText('#ffffff', accent),
    '--pz-business-value-showcase-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-value-showcase-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-value-showcase-radius': RADII.find((radius) => radius === appearance.buttonRadius) ?? '8px',
  } as CSSProperties
}
