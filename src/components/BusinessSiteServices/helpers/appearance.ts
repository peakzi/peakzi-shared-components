import type { CSSProperties } from 'react'
import { safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteServicesAppearance } from './types'

const RADII = ['2px', '8px', '16px', '32px'] as const

export function servicesStyle(appearance: BusinessSiteServicesAppearance): CSSProperties {
  return {
    '--pz-business-services-background': safeColor(appearance.backgroundColor, '#ffffff'),
    '--pz-business-services-text': safeColor(appearance.textColor, '#12171c'),
    '--pz-business-services-accent': safeColor(appearance.accentColor, '#1d4f8c'),
    '--pz-business-services-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-services-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-services-radius': RADII.find((radius) => radius === appearance.buttonRadius) ?? '8px',
  } as CSSProperties
}
