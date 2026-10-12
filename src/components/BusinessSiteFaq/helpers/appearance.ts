import type { CSSProperties } from 'react'
import { readableText, safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteFaqAppearance } from './types'

const RADII = ['2px', '8px', '16px', '32px'] as const

export function faqStyle(appearance: BusinessSiteFaqAppearance): CSSProperties {
  const background = safeColor(appearance.backgroundColor, '#ffffff')
  const usesPalette = appearance.gradientStartColor !== undefined || appearance.gradientEndColor !== undefined
  const contactBackground = safeColor(appearance.gradientStartColor, usesPalette ? '#12171c' : safeColor(appearance.contactBackgroundColor, '#12171c'))
  const contactEnd = safeColor(appearance.gradientEndColor, usesPalette ? contactBackground : safeColor(appearance.contactGradientEndColor, contactBackground))
  const text = readableText(usesPalette ? contactBackground : safeColor(appearance.textColor, '#12171c'), background)
  const contactText = readableText(usesPalette ? background : safeColor(appearance.contactTextColor, '#ffffff'), contactBackground)

  return {
    '--pz-business-faq-background': background,
    '--pz-business-faq-text': text,
    '--pz-business-faq-accent': usesPalette ? text : safeColor(appearance.accentColor, text),
    '--pz-business-faq-fill': `linear-gradient(135deg, ${contactBackground}, ${contactEnd})`,
    '--pz-business-faq-contact-background': contactBackground,
    '--pz-business-faq-contact-end': contactEnd,
    '--pz-business-faq-contact-text': contactText,
    '--pz-business-faq-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-faq-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-faq-radius': RADII.find((radius) => radius === appearance.buttonRadius) ?? '8px',
  } as CSSProperties
}
