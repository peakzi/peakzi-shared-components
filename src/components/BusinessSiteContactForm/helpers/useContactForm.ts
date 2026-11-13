import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { addressMinLength, CONTACT_FIELDS, contactValues, fieldErrors, localError, localErrors, trimmedValues } from './validation'
import { usePhoneValidation, type PhoneCheck } from './usePhoneValidation'
import type { BusinessSiteContactFormErrors, BusinessSiteContactFormField, BusinessSiteContactFormProps, BusinessSiteContactFormValues } from './types'

interface FormState {
  phase: 'idle' | 'validating' | 'submitting' | 'success'
  errors: BusinessSiteContactFormErrors
  message: string
}
const idleState: FormState = { phase: 'idle', errors: {}, message: '' }

export function useContactForm({ onSubmit, phoneValidation, addressSearch, initialValues, disabled, successMessage, consentText, appearance }: BusinessSiteContactFormProps) {
  const [values, setValues] = useState(() => contactValues(initialValues))
  const [acceptedDisclosure, setAcceptedDisclosure] = useState('')
  const [state, setState] = useState<FormState>(idleState)
  const [phoneEdited, setPhoneEdited] = useState(Boolean(initialValues?.phone?.trim()))
  const [phoneCheck, setPhoneCheck] = useState<PhoneCheck | null>(null)
  const touched = useRef<Partial<Record<BusinessSiteContactFormField, boolean>>>({})
  const formRef = useRef<HTMLFormElement>(null)
  const active = useRef<AbortController | null>(null)
  const lastPhoneCheck = useRef<PhoneCheck | null>(null)
  const focusError = useRef(false)
  const compact = appearance?.density === 'compact'
  const minimumAddressLength = addressMinLength(addressSearch)
  const currentValues = { ...values, email: compact ? '' : values.email, consent: values.consent && acceptedDisclosure === consentText.trim() }

  const showError = useCallback((field: BusinessSiteContactFormField, message: string) => {
    setState((previous) => {
      if (previous.phase !== 'idle') return previous
      const errors = { ...previous.errors }
      if (message) errors[field] = message
      else delete errors[field]
      return { ...previous, errors }
    })
  }, [])
  const phoneLocalError = useCallback((message: string) => showError('phone', message), [showError])
  const phoneChecked = useCallback((check: PhoneCheck) => {
    lastPhoneCheck.current = check
    setPhoneCheck(check)
    showError('phone', check.message)
  }, [showError])
  const { checking: checkingPhone, retry: retryPhoneCheck } = usePhoneValidation(values.phone, state.phase === 'idle' && !disabled && phoneEdited, phoneValidation, phoneLocalError, phoneChecked)

  useEffect(() => () => { active.current?.abort(); active.current = null }, [])
  useEffect(() => {
    if (!focusError.current || state.phase !== 'idle') return
    focusError.current = false
    const first = CONTACT_FIELDS.find((field) => state.errors[field])
    const element = first && formRef.current?.elements.namedItem(first)
    if (element instanceof HTMLElement) element.focus()
  }, [state])

  // Field errors replace the form-level message; only errors without a visible field fall back to it.
  function fail(errors: BusinessSiteContactFormErrors, message: string) {
    let hidden = ''
    if (compact && errors.email) {
      hidden = errors.email
      errors = { ...errors }
      delete errors.email
    }
    focusError.current = true
    for (const field of CONTACT_FIELDS) if (errors[field]) touched.current[field] = true
    setState({ phase: 'idle', errors, message: Object.keys(errors).length ? hidden : [message, hidden].filter(Boolean).join(' ') })
  }

  function change<K extends BusinessSiteContactFormField>(field: K, value: BusinessSiteContactFormValues[K]) {
    if (active.current || disabled) return
    if (field === 'consent') setAcceptedDisclosure(value === true ? consentText.trim() : '')
    if (field === 'phone') {
      setPhoneEdited(true)
      if (value.toString().trim() !== lastPhoneCheck.current?.phone) {
        lastPhoneCheck.current = null
        setPhoneCheck(null)
      }
    }
    setValues((previous) => ({ ...previous, [field]: value }))
    setState((previous) => {
      const errors = { ...previous.errors }
      const next = trimmedValues({ ...currentValues, [field]: value, email: compact ? '' : field === 'email' ? String(value) : values.email })
      const message = localErrors(next, minimumAddressLength)[field] || (field === 'phone' && lastPhoneCheck.current?.phone === next.phone ? lastPhoneCheck.current.message : '')
      if ((touched.current[field] || errors[field]) && message) errors[field] = message
      else delete errors[field]
      return { ...previous, errors, message: '' }
    })
  }

  /** Required, local and backend errors remain visible after leaving a field. */
  function blur(field: BusinessSiteContactFormField) {
    if (active.current || disabled) return
    touched.current[field] = true
    const next = trimmedValues(currentValues)
    const message = localErrors(next, minimumAddressLength)[field] || (field === 'phone' && phoneCheck?.phone === next.phone ? phoneCheck.message : '')
    if (message) showError(field, message)
    if (field === 'phone' && phoneValidation && !localError('phone', next.phone) && next.phone &&
      (!phoneEdited || phoneCheck?.unavailable)) {
      setPhoneEdited(true)
      retryPhoneCheck()
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (active.current || disabled) return
    const submitted = trimmedValues({ ...values, email: compact ? '' : values.email,
      consent: values.consent && acceptedDisclosure === consentText.trim() })
    const local = localErrors(submitted, minimumAddressLength)
    if (Object.keys(local).length) {
      fail(local, '')
      return
    }
    // Reuse a completed live check of the same number instead of calling the phone API again.
    const known = lastPhoneCheck.current?.phone === submitted.phone && !lastPhoneCheck.current.unavailable ? lastPhoneCheck.current : null
    if (known?.message) {
      fail({ phone: known.message }, '')
      return
    }
    const controller = new AbortController()
    active.current = controller
    setPhoneEdited(false)
    const context = { signal: controller.signal, consentText: consentText.trim() }
    let validating = Boolean(phoneValidation && !known)
    setState({ phase: validating ? 'validating' : 'submitting', errors: {}, message: '' })
    try {
      if (validating) {
        const result = await phoneValidation!.validate(submitted.phone, { signal: controller.signal })
        if (controller.signal.aborted) return
        const message = typeof result === 'string' ? result.trim() : ''
        lastPhoneCheck.current = { phone: submitted.phone, message }
        setPhoneCheck(lastPhoneCheck.current)
        if (message) {
          fail({ phone: message }, '')
          return
        }
        validating = false
        setState({ phase: 'submitting', errors: {}, message: '' })
      }
      const result = await onSubmit(submitted, context)
      if (controller.signal.aborted) return
      if (result?.success === false) {
        fail(fieldErrors(result.fieldErrors), result.message?.trim() || 'We couldn’t send your request. Please check your details and try again.')
      } else {
        setState({ phase: 'success', errors: {}, message: result?.message?.trim() || successMessage?.trim() ||
          'Your request has been sent. Our team will be in touch.' })
      }
    } catch {
      if (!controller.signal.aborted) fail({}, validating
        ? 'We couldn’t check your details. Please try again.'
        : 'We couldn’t send your request. Please try again.')
    } finally {
      if (active.current === controller) active.current = null
    }
  }

  function reset() {
    setValues(contactValues(initialValues))
    setAcceptedDisclosure('')
    setPhoneEdited(Boolean(initialValues?.phone?.trim()))
    setPhoneCheck(null)
    lastPhoneCheck.current = null
    touched.current = {}
    setState(idleState)
  }

  const validPhone = !phoneValidation || (phoneCheck?.phone === values.phone.trim() && !phoneCheck.message && !phoneCheck.unavailable)
  const canSubmit = !disabled && state.phase === 'idle' && !checkingPhone && validPhone &&
    !Object.keys(localErrors(trimmedValues(currentValues), minimumAddressLength)).length && !Object.values(state.errors).some(Boolean)

  return { values: currentValues,
    state, canSubmit, checkingPhone, formRef, change, blur, submit, reset, busy: state.phase === 'validating' || state.phase === 'submitting' }
}
