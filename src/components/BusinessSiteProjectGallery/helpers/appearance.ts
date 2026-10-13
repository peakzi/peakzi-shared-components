import type { CSSProperties } from 'react'
import { safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteProjectGalleryAppearance } from './types'

export function galleryStyle(appearance: BusinessSiteProjectGalleryAppearance): CSSProperties {
  return {
    '--pz-business-gallery-background': safeColor(appearance.backgroundColor, '#ffffff'),
    '--pz-business-gallery-text': safeColor(appearance.textColor, '#12171c'),
    '--pz-business-gallery-accent': safeColor(appearance.accentColor, '#1d4f8c'),
    '--pz-business-gallery-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-gallery-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-gallery-radius': ['2px', '8px', '16px', '32px'].find((radius) => radius === appearance.buttonRadius) ?? '8px',
  } as CSSProperties
}
