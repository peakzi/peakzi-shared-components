import { useCallback, useEffect, useRef, useState } from 'react'

export type ClipboardStatus = 'idle' | 'success' | 'error'

export interface UseClipboardOptions {
  resetDelay?: number
  onSuccess?: ((value: string) => void) | undefined
  onError?: ((error: Error, value: string) => void) | undefined
}

const toError = (error: unknown) =>
  error instanceof Error ? error : new Error('Unable to copy to clipboard')

export function useClipboard({
  resetDelay = 1500,
  onSuccess,
  onError,
}: UseClipboardOptions = {}) {
  const [status, setStatus] = useState<ClipboardStatus>('idle')
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearResetTimer = useCallback(() => {
    if (resetTimer.current) {
      clearTimeout(resetTimer.current)
      resetTimer.current = null
    }
  }, [])

  useEffect(() => clearResetTimer, [clearResetTimer])

  const copy = useCallback(async (value: string) => {
    clearResetTimer()

    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
        throw new Error('Clipboard API is unavailable')
      }

      await navigator.clipboard.writeText(value)
      setStatus('success')
      onSuccess?.(value)
      resetTimer.current = setTimeout(() => setStatus('idle'), resetDelay)
      return true
    } catch (error) {
      const clipboardError = toError(error)
      setStatus('error')
      onError?.(clipboardError, value)
      resetTimer.current = setTimeout(() => setStatus('idle'), resetDelay)
      return false
    }
  }, [clearResetTimer, onError, onSuccess, resetDelay])

  return { copy, status }
}
