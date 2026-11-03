import type { BusinessSiteContactFormErrors, BusinessSiteContactFormValues } from './types'

const TEXT_FIELDS = ['fullName', 'phone', 'email', 'address', 'description'] as const
export const CONTACT_FIELDS = [...TEXT_FIELDS, 'consent'] as const

export function contactValues(initial: Partial<Omit<BusinessSiteContactFormValues, 'consent'>> = {}): BusinessSiteContactFormValues {
  const values = { fullName: '', phone: '', email: '', address: '', description: '', consent: false }
  for (const field of TEXT_FIELDS) {
    const value = initial?.[field]
    if (typeof value === 'string') values[field] = value
  }
  return values
}

export function trimmedValues(values: BusinessSiteContactFormValues): BusinessSiteContactFormValues {
  return { ...values, ...Object.fromEntries(TEXT_FIELDS.map((field) => [field, values[field].trim()])) }
}

/** Required values and explicit consent are checked locally; contact/address validity belongs to the backend. */
export function requiredErrors(values: BusinessSiteContactFormValues): BusinessSiteContactFormErrors {
  return {
    ...(!values.fullName ? { fullName: 'Please enter your full name.' } : {}),
    ...(!values.phone ? { phone: 'Please enter your phone number.' } : {}),
    ...(values.consent !== true ? { consent: 'Please agree to the contact terms before sending your request.' } : {}),
  }
}

export function fieldErrors(errors: void | BusinessSiteContactFormErrors): BusinessSiteContactFormErrors {
  return Object.fromEntries(CONTACT_FIELDS.flatMap((field) => {
    const message = errors?.[field]
    return typeof message === 'string' && message.trim() ? [[field, message.trim()]] : []
  }))
}
