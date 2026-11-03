import { useEffect, useRef, useState } from 'react'
import { DEFAULT_DEBOUNCE_MS, localError } from './validation'
import type { BusinessSiteContactFormPhoneValidation } from './types'

/** Outcome of a completed backend check; `message` is empty when the number is valid. */
export interface PhoneCheck {
  phone: string
  message: string
}

/** Debounced backend phone check while typing; outdated checks are aborted and their results ignored. Returns true while a check is in flight. */
export function usePhoneValidation(value: string, enabled: boolean, validation: BusinessSiteContactFormPhoneValidation | undefined,
  onLocalError: (message: string) => void, onChecked: (check: PhoneCheck) => void) {
  const latest = useRef(validation)
  const runs = useRef(0)
  const [checking, setChecking] = useState<{ run: number; phone: string } | null>(null)
  const minLength = Number.isFinite(validation?.minLength) ? Math.max(1, validation!.minLength!) : 3
  const delay = Number.isFinite(validation?.debounceMs) ? Math.max(0, validation!.debounceMs!) : DEFAULT_DEBOUNCE_MS
  const phone = value.trim()
  const active = Boolean(enabled && validation?.validate && phone.length >= minLength)

  useEffect(() => { latest.current = validation })
  useEffect(() => {
    if (!active) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      // Obviously invalid numbers are reported locally instead of spending a backend call.
      const local = localError('phone', phone)
      if (local) {
        onLocalError(local)
        return
      }
      const run = ++runs.current
      setChecking({ run, phone })
      try {
        const message = await latest.current?.validate(phone, { signal: controller.signal })
        if (!controller.signal.aborted) onChecked({ phone, message: typeof message === 'string' ? message.trim() : '' })
      } catch {
        // Submission re-checks the number; a failed live check never blocks typing.
      } finally {
        setChecking((current) => current?.run === run ? null : current)
      }
    }, delay)
    return () => { clearTimeout(timer); controller.abort() }
  }, [active, phone, delay, onLocalError, onChecked])

  return active && checking?.phone === phone
}
