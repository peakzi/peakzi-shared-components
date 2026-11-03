import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export interface BusinessSiteContactFormValues {
  fullName: string
  phone: string
  email: string
  address: string
  description: string
  consent: boolean
}

export type BusinessSiteContactFormField = keyof BusinessSiteContactFormValues
export type BusinessSiteContactFormErrors = Partial<Record<BusinessSiteContactFormField, string>>

export interface BusinessSiteContactFormAddressSuggestion {
  /** Consumer/backend identifier, for example a Google place ID. */
  id: string
  /** Complete address text written into the form when selected. */
  label: string
  description?: string
}

export interface BusinessSiteContactFormAddressSearch {
  search: (query: string, context: { signal: AbortSignal }) =>
    readonly BusinessSiteContactFormAddressSuggestion[] | Promise<readonly BusinessSiteContactFormAddressSuggestion[]>
  /** Optional notification for consumer-owned place metadata. */
  onSelect?: (suggestion: BusinessSiteContactFormAddressSuggestion) => void
  /** Defaults to 3 characters and 250ms. */
  minLength?: number
  debounceMs?: number
}

export interface BusinessSiteContactFormContext {
  /** Aborted when the form unmounts. Forward this to the consumer's backend requests. */
  signal: AbortSignal
  /** Exact disclosure displayed for this request, for consumer-owned consent recording. */
  consentText: string
}

export type BusinessSiteContactFormResult =
  | { success: true; message?: string }
  | { success: false; message?: string; fieldErrors?: BusinessSiteContactFormErrors }

export interface BusinessSiteContactFormAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  textColor?: string
  accentColor?: string
  inputBackgroundColor?: string
  inputTextColor?: string
  errorColor?: string
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  /** Compact omits email and pairs name/phone when space permits; comfortable adds a side introduction. */
  density?: 'compact' | 'comfortable'
  motion?: BusinessSiteMotion
}

export interface BusinessSiteContactFormProps {
  /** Required. The consumer submits to its own backend; resolving without a result means success. */
  onSubmit: (values: Readonly<BusinessSiteContactFormValues>, context: BusinessSiteContactFormContext) =>
    void | BusinessSiteContactFormResult | Promise<void | BusinessSiteContactFormResult>
  /** Optional separate backend validation, e.g. Twilio phone/email and Google address checks. Runs before submission. */
  onValidate?: (values: Readonly<BusinessSiteContactFormValues>, context: BusinessSiteContactFormContext) =>
    void | BusinessSiteContactFormErrors | Promise<void | BusinessSiteContactFormErrors>
  /** Used on mount and when choosing to send another request; prop updates do not overwrite a draft. */
  initialValues?: Partial<Omit<BusinessSiteContactFormValues, 'consent'>>
  /** Required business-specific TCPA disclosure. The checkbox is always initially unchecked. */
  consentText: string
  privacyPolicy?: { href: string; label?: string; newTab?: boolean }
  /** Debounced address suggestions from the consumer's backend. Without this provider, manual entry remains available. */
  addressSearch?: BusinessSiteContactFormAddressSearch
  title?: string
  description?: string
  labels?: Partial<Record<BusinessSiteContactFormField, string>>
  hints?: Partial<Record<BusinessSiteContactFormField, string>>
  submitLabel?: string
  validatingLabel?: string
  submittingLabel?: string
  successMessage?: string
  resetLabel?: string
  disabled?: boolean
  appearance?: BusinessSiteContactFormAppearance
  /** Consumer-owned placement identifier for analytics. */
  placement?: string
  id?: string
  className?: string
}
