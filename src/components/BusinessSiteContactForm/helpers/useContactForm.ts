import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { CONTACT_FIELDS, contactValues, fieldErrors, localError, localErrors, trimmedValues, type TextField } from './validation'
import { usePhoneValidation, type PhoneCheck } from './usePhoneValidation'
import type { BusinessSiteContactFormErrors, BusinessSiteContactFormField, BusinessSiteContactFormProps, BusinessSiteContactFormValues } from './types'

interface FormState {
  phase: 'idle' | 'validating' | 'submitting' | 'success'
  errors: BusinessSiteContactFormErrors
  message: string
}
const idleState: FormState = { phase: 'idle', errors: {}, message: '' }

export function useContactForm({ onSubmit, phoneValidation, initialValues, disabled, successMessage, consentText, appearance }: BusinessSiteContactFormProps) {
  const [values, setValues] = useState(() => contactValues(initialValues))
  const [acceptedDisclosure, setAcceptedDisclosure] = useState('')
  const [state, setState] = useState<FormState>(idleState)
  const [phoneEdited, setPhoneEdited] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const active = useRef<AbortController | null>(null)
  const lastPhoneCheck = useRef<PhoneCheck | null>(null)
  const focusError = useRef(false)
  const compact = appearance?.density === 'compact'

  const showError = useCallback((field: BusinessSiteContactFormField, message: string) => {
    setState((previous) => previous.phase === 'idle' ? { ...previous, errors: { ...previous.errors, [field]: message } } : previous)
  }, [])
  const phoneLocalError = useCallback((message: string) => showError('phone', message), [showError])
  const phoneChecked = useCallback((check: PhoneCheck) => {
    lastPhoneCheck.current = check
    if (check.message) showError('phone', check.message)
  }, [showError])
  const checkingPhone = usePhoneValidation(values.phone, state.phase === 'idle' && !disabled && phoneEdited, phoneValidation, phoneLocalError, phoneChecked)

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
    setState({ phase: 'idle', errors, message: Object.keys(errors).length ? hidden : [message, hidden].filter(Boolean).join(' ') })
  }

  function change<K extends BusinessSiteContactFormField>(field: K, value: BusinessSiteContactFormValues[K]) {
    if (active.current || disabled) return
    if (field === 'consent') setAcceptedDisclosure(value === true ? consentText.trim() : '')
    if (field === 'phone') setPhoneEdited(true)
    setValues((previous) => ({ ...previous, [field]: value }))
    setState((previous) => {
      const errors = { ...previous.errors }
      delete errors[field]
      return { ...previous, errors, message: '' }
    })
  }

  /** Applies the built-in rules when leaving a filled field; empty required fields are only flagged on submit. */
  function blur(field: TextField) {
    if (active.current || disabled) return
    const message = localError(field, values[field].trim())
    if (message) showError(field, message)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (active.current || disabled) return
    const submitted = trimmedValues({ ...values, email: compact ? '' : values.email,
      consent: values.consent && acceptedDisclosure === consentText.trim() })
    const local = localErrors(submitted)
    if (Object.keys(local).length) {
      fail(local, '')
      return
    }
    // Reuse a completed live check of the same number instead of calling the phone API again.
    const known = lastPhoneCheck.current?.phone === submitted.phone ? lastPhoneCheck.current : null
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
    setPhoneEdited(false)
    setState(idleState)
  }

  return { values: { ...values, consent: values.consent && acceptedDisclosure === consentText.trim() },
    state, checkingPhone, formRef, change, blur, submit, reset, busy: state.phase === 'validating' || state.phase === 'submitting' }
}
