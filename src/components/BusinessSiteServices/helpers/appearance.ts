import type { CSSProperties } from 'react'
import { readableText, safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteServicesAppearance } from './types'

const RADII = ['2px', '8px', '16px', '32px'] as const

export function servicesStyle(appearance: BusinessSiteServicesAppearance): CSSProperties {
  const background = safeColor(appearance.backgroundColor, '#ffffff')
  const start = safeColor(appearance.gradientStartColor, '#12171c')
  const end = safeColor(appearance.gradientEndColor, start)
  const usesPalette = appearance.gradientStartColor !== undefined || appearance.gradientEndColor !== undefined
  const text = readableText(usesPalette ? start : safeColor(appearance.textColor, start), background)
  return {
    '--pz-business-services-background': background,
    '--pz-business-services-text': text,
    '--pz-business-services-accent': usesPalette ? text : safeColor(appearance.accentColor, text),
    '--pz-business-services-fill': `linear-gradient(135deg, ${start}, ${end})`,
    '--pz-business-services-on-gradient': readableText(background, start),
    '--pz-business-services-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-services-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-services-radius': RADII.find((radius) => radius === appearance.buttonRadius) ?? '8px',
  } as CSSProperties
}
