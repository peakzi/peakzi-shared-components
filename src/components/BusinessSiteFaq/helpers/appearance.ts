import type { CSSProperties } from 'react'
import { readableText, safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteFaqAppearance } from './types'

const RADII = ['2px', '8px', '16px', '32px'] as const

export function faqStyle(appearance: BusinessSiteFaqAppearance): CSSProperties {
  const contactBackground = safeColor(appearance.contactBackgroundColor, '#12171c')
  const contactEnd = safeColor(appearance.contactGradientEndColor, contactBackground)
  const contactText = safeColor(appearance.contactTextColor, '#ffffff')

  return {
    '--pz-business-faq-background': safeColor(appearance.backgroundColor, '#ffffff'),
    '--pz-business-faq-text': safeColor(appearance.textColor, '#12171c'),
    '--pz-business-faq-accent': safeColor(appearance.accentColor, '#1d4f8c'),
    '--pz-business-faq-contact-background': contactBackground,
    '--pz-business-faq-contact-end': contactEnd,
    '--pz-business-faq-contact-text': readableText(contactText, contactBackground),
    '--pz-business-faq-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-faq-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-faq-radius': RADII.find((radius) => radius === appearance.buttonRadius) ?? '8px',
  } as CSSProperties
}
