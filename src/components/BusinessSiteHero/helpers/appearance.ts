import type { CSSProperties } from 'react'
import { readableText, safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteHeroAppearance, BusinessSiteHeroProps } from './types'

const RADII = ['2px', '8px', '16px', '32px'] as const

export function heroStyle(
  appearance: BusinessSiteHeroAppearance,
  layout: BusinessSiteHeroProps['layout'],
  background: BusinessSiteHeroProps['background'],
  overlay: number | undefined,
): CSSProperties {
  const dark = layout === 'background' || background === 'gradient' || background === 'ink'
  const accent = safeColor(appearance.accentColor, '#1d4f8c')
  const radius = RADII.find((value) => value === appearance.buttonRadius) ?? '8px'
  const overlayValue = Number.isFinite(overlay) ? Math.min(0.85, Math.max(0.55, overlay!)) : 0.62

  return {
    '--pz-business-hero-background': safeColor(appearance.backgroundColor, dark ? '#12171c' : '#ffffff'),
    '--pz-business-hero-text': safeColor(appearance.textColor, dark ? '#ffffff' : '#12171c'),
    '--pz-business-hero-accent': accent,
    '--pz-business-hero-on-accent': readableText('#ffffff', accent),
    '--pz-business-hero-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-hero-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-hero-radius': radius,
    '--pz-business-hero-overlay': String(overlayValue),
  } as CSSProperties
}
