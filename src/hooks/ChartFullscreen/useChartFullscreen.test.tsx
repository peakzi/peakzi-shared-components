import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useChartFullscreen } from './useChartFullscreen'

function fireFullscreenChange() {
  act(() => {
    document.dispatchEvent(new Event('fullscreenchange'))
  })
}

function fireWindowResize() {
  act(() => {
    window.dispatchEvent(new Event('resize'))
  })
}

describe('useChartFullscreen', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(document, 'fullscreenElement', { value: null, configurable: true })
  })

  it('starts out of fullscreen with width null (auto) and the given height', () => {
    const { result } = renderHook(() => useChartFullscreen({ height: 320 }))

    expect(result.current.isFullscreen).toBe(false)
    expect(result.current.size).toEqual({ width: null, height: 320 })
  })

  it('reflects height prop changes while not fullscreen', () => {
    const { result, rerender } = renderHook(({ height }) => useChartFullscreen({ height }), {
      initialProps: { height: 320 },
    })

    rerender({ height: 480 })

    expect(result.current.size).toEqual({ width: null, height: 480 })
  })

  it('requests fullscreen on the container element', async () => {
    const requestFullscreen = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useChartFullscreen({ height: 320 }))

    Object.defineProperty(result.current.containerRef, 'current', {
      value: { requestFullscreen },
      writable: true,
    })

    await act(async () => {
      result.current.toggleFullscreen()
      await Promise.resolve()
    })

    expect(requestFullscreen).toHaveBeenCalledTimes(1)
  })

  it('ignores fullscreen entered by some other element', () => {
    const { result } = renderHook(() => useChartFullscreen({ height: 320 }))
    const container = document.createElement('div')
    Object.defineProperty(result.current.containerRef, 'current', { value: container, writable: true })

    Object.defineProperty(document, 'fullscreenElement', { value: document.createElement('div'), configurable: true })
    fireFullscreenChange()

    expect(result.current.isFullscreen).toBe(false)
    expect(result.current.size).toEqual({ width: null, height: 320 })
  })

  it('exits fullscreen only when its own container owns it, and requests it otherwise', async () => {
    const requestFullscreen = vi.fn().mockResolvedValue(undefined)
    const exitFullscreen = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(document, 'exitFullscreen', { value: exitFullscreen, configurable: true })
    const { result } = renderHook(() => useChartFullscreen({ height: 320 }))
    const container = Object.assign(document.createElement('div'), { requestFullscreen })
    Object.defineProperty(result.current.containerRef, 'current', { value: container, writable: true })

    Object.defineProperty(document, 'fullscreenElement', { value: document.createElement('div'), configurable: true })
    await act(async () => {
      result.current.toggleFullscreen()
      await Promise.resolve()
    })
    expect(requestFullscreen).toHaveBeenCalledTimes(1)
    expect(exitFullscreen).not.toHaveBeenCalled()

    Object.defineProperty(document, 'fullscreenElement', { value: container, configurable: true })
    await act(async () => {
      result.current.toggleFullscreen()
      await Promise.resolve()
    })
    expect(exitFullscreen).toHaveBeenCalledTimes(1)
  })

  it('switches to window dimensions on fullscreenchange and back on exit', () => {
    const { result } = renderHook(() => useChartFullscreen({ height: 320 }))
    const container = document.createElement('div')
    Object.defineProperty(result.current.containerRef, 'current', { value: container, writable: true })

    Object.defineProperty(document, 'fullscreenElement', { value: container, configurable: true })
    fireFullscreenChange()

    expect(result.current.isFullscreen).toBe(true)
    expect(result.current.size).toEqual({ width: window.innerWidth, height: window.innerHeight })

    Object.defineProperty(document, 'fullscreenElement', { value: null, configurable: true })
    fireFullscreenChange()

    expect(result.current.isFullscreen).toBe(false)
    expect(result.current.size).toEqual({ width: null, height: 320 })
  })

  it('calls onResize on mount and again on window resize even while not fullscreen', () => {
    vi.useFakeTimers()
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
    const onResize = vi.fn()

    renderHook(() => useChartFullscreen({ height: 320, onResize }))
    expect(onResize).toHaveBeenCalledWith({ width: null, height: 320 })
    onResize.mockClear()

    fireWindowResize()
    expect(onResize).toHaveBeenCalledTimes(1)
    expect(onResize).toHaveBeenCalledWith({ width: null, height: 320 })

    rafSpy.mockRestore()
    vi.useRealTimers()
  })
})
