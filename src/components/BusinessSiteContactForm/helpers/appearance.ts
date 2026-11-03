import type { CSSProperties } from 'react'
import { readableText, safeColor, safeFont } from '../../../utils/siteAppearance'
import type { BusinessSiteContactFormAppearance } from './types'

export function contactFormStyle(appearance: BusinessSiteContactFormAppearance): CSSProperties {
  const background = safeColor(appearance.backgroundColor, '#ffffff')
  const inputBackground = safeColor(appearance.inputBackgroundColor, background)
  const text = readableText(safeColor(appearance.textColor, '#12171c'), background)
  const accent = safeColor(appearance.accentColor, '#1d4f8c')
  const defaultError = readableText('#b42318', background) === '#b42318' ? '#b42318' : '#ffb4ab'
  const error = safeColor(appearance.errorColor, defaultError)
  return {
    '--pz-contact-form-background': background,
    '--pz-contact-form-text': text,
    '--pz-contact-form-input-background': inputBackground,
    '--pz-contact-form-input-text': readableText(safeColor(appearance.inputTextColor, text), inputBackground),
    '--pz-contact-form-accent': accent,
    '--pz-contact-form-on-accent': readableText('#ffffff', accent),
    '--pz-contact-form-button-border': readableText(accent, background),
    '--pz-contact-form-focus': readableText(accent, background),
    '--pz-contact-form-error': readableText(error, background),
    '--pz-contact-form-error-border': readableText(error, inputBackground),
    '--pz-contact-form-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-contact-form-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-contact-form-radius': ['2px', '8px', '16px', '32px'].find((value) => value === appearance.buttonRadius) ?? '8px',
  } as CSSProperties
}
