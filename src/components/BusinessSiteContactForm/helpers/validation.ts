import isEmail from 'validator/es/lib/isEmail'
import type { BusinessSiteContactFormErrors, BusinessSiteContactFormValues } from './types'

/** Shared default wait before address search and live field checks call the backend. */
export const DEFAULT_DEBOUNCE_MS = 300

const TEXT_FIELDS = ['fullName', 'phone', 'email', 'address', 'description'] as const
export const CONTACT_FIELDS = [...TEXT_FIELDS, 'consent'] as const
export type TextField = typeof TEXT_FIELDS[number]

/** Character limits, also applied as `maxLength` on the inputs. Email follows the RFC 5321 address limit. */
export const FIELD_LIMITS: Record<TextField, number> = { fullName: 100, phone: 20, email: 254, address: 200, description: 1000 }

const PHONE_CHARACTERS = /^\+?[\d\s().-]+$/

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

/** In-component rules for one trimmed value. Email is validated here only; phone/address validity belongs to the backend. */
export function localError(field: TextField, value: string): string | undefined {
  if (value.length > FIELD_LIMITS[field]) return `Please keep this under ${FIELD_LIMITS[field]} characters.`
  if (field === 'fullName' && value && !/\p{L}/u.test(value)) return 'Please enter your full name.'
  if (field === 'phone' && value) {
    const digits = value.replace(/\D/g, '').length
    if (!PHONE_CHARACTERS.test(value) || digits < 7 || digits > 15) return 'Please enter a valid phone number.'
  }
  if (field === 'email' && value && !isEmail(value)) return 'Please check this email address.'
  return undefined
}

/** Required values, basic field rules and explicit consent, checked before any backend call. */
export function localErrors(values: BusinessSiteContactFormValues): BusinessSiteContactFormErrors {
  const errors: BusinessSiteContactFormErrors = {
    ...(!values.fullName ? { fullName: 'Please enter your full name.' } : {}),
    ...(!values.phone ? { phone: 'Please enter your phone number.' } : {}),
    ...(!values.address ? { address: 'Please enter your service address.' } : {}),
  }
  for (const field of TEXT_FIELDS) {
    const message = errors[field] ? undefined : localError(field, values[field])
    if (message) errors[field] = message
  }
  if (values.consent !== true) errors.consent = 'Please agree to the contact terms before sending your request.'
  return errors
}

export function fieldErrors(errors: void | BusinessSiteContactFormErrors): BusinessSiteContactFormErrors {
  return Object.fromEntries(CONTACT_FIELDS.flatMap((field) => {
    const message = errors?.[field]
    return typeof message === 'string' && message.trim() ? [[field, message.trim()]] : []
  }))
}
