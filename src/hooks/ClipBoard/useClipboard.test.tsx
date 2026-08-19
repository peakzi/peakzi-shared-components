import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useClipboard } from './useClipboard'

describe('useClipboard', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('copies a value and reports success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    const onSuccess = vi.fn()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    const { result } = renderHook(() => useClipboard({ onSuccess }))

    let copied = false
    await act(async () => {
      copied = await result.current.copy('Peakzi API key')
    })

    expect(copied).toBe(true)
    expect(result.current.status).toBe('success')
    expect(writeText).toHaveBeenCalledWith('Peakzi API key')
    expect(onSuccess).toHaveBeenCalledWith('Peakzi API key')
  })

  it('reports clipboard failures', async () => {
    const clipboardError = new Error('Clipboard permission denied')
    const onError = vi.fn()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(clipboardError) },
      configurable: true,
    })
    const { result } = renderHook(() => useClipboard({ onError }))

    let copied = true
    await act(async () => {
      copied = await result.current.copy('Peakzi API key')
    })

    expect(copied).toBe(false)
    expect(result.current.status).toBe('error')
    expect(onError).toHaveBeenCalledWith(clipboardError, 'Peakzi API key')
  })

  it('resets feedback after the configured delay', async () => {
    vi.useFakeTimers()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    })
    const { result } = renderHook(() => useClipboard({ resetDelay: 100 }))

    await act(async () => {
      await result.current.copy('Peakzi API key')
    })
    expect(result.current.status).toBe('success')

    act(() => vi.advanceTimersByTime(100))
    expect(result.current.status).toBe('idle')
  })
})
