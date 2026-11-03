import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CONTACT_FIELDS, contactValues, fieldErrors, requiredErrors, trimmedValues } from './validation'
import type { BusinessSiteContactFormErrors, BusinessSiteContactFormField, BusinessSiteContactFormProps, BusinessSiteContactFormValues } from './types'

interface FormState {
  phase: 'idle' | 'validating' | 'submitting' | 'success'
  errors: BusinessSiteContactFormErrors
  message: string
}
const idleState: FormState = { phase: 'idle', errors: {}, message: '' }

export function useContactForm({ onSubmit, onValidate, initialValues, disabled, successMessage, consentText, appearance }: BusinessSiteContactFormProps) {
  const [values, setValues] = useState(() => contactValues(initialValues))
  const [acceptedDisclosure, setAcceptedDisclosure] = useState('')
  const [state, setState] = useState<FormState>(idleState)
  const formRef = useRef<HTMLFormElement>(null)
  const active = useRef<AbortController | null>(null)
  const focusError = useRef(false)

  useEffect(() => () => { active.current?.abort(); active.current = null }, [])
  useEffect(() => {
    if (!focusError.current || state.phase !== 'idle') return
    focusError.current = false
    const first = CONTACT_FIELDS.find((field) => state.errors[field])
    const element = first && formRef.current?.elements.namedItem(first)
    if (element instanceof HTMLElement) element.focus()
  }, [state])

  function fail(errors: BusinessSiteContactFormErrors, message: string) {
    if (appearance?.density === 'compact' && errors.email) {
      message = `${message} ${errors.email}`
      errors = { ...errors }
      delete errors.email
    }
    focusError.current = true
    setState({ phase: 'idle', errors, message })
  }

  function change<K extends BusinessSiteContactFormField>(field: K, value: BusinessSiteContactFormValues[K]) {
    if (active.current || disabled) return
    if (field === 'consent') setAcceptedDisclosure(value === true ? consentText.trim() : '')
    setValues((previous) => ({ ...previous, [field]: value }))
    setState((previous) => {
      const errors = { ...previous.errors }
      delete errors[field]
      return { ...previous, errors, message: '' }
    })
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (active.current || disabled) return
    const submitted = trimmedValues({ ...values, email: appearance?.density === 'compact' ? '' : values.email,
      consent: values.consent && acceptedDisclosure === consentText.trim() })
    const required = requiredErrors(submitted)
    if (Object.keys(required).length) {
      fail(required, 'Please complete the required fields.')
      return
    }
    const controller = new AbortController()
    active.current = controller
    const context = { signal: controller.signal, consentText: consentText.trim() }
    let validating = Boolean(onValidate)
    setState({ phase: validating ? 'validating' : 'submitting', errors: {}, message: '' })
    try {
      if (onValidate) {
        const errors = fieldErrors(await onValidate(submitted, context))
        if (controller.signal.aborted) return
        if (Object.keys(errors).length) {
          fail(errors, 'Please check the highlighted details and try again.')
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
    setState(idleState)
  }

  return { values: { ...values, consent: values.consent && acceptedDisclosure === consentText.trim() },
    state, formRef, change, submit, reset, busy: state.phase === 'validating' || state.phase === 'submitting' }
}
