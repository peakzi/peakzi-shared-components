import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'

// Cross-browser Fullscreen API still needs vendor-prefixed fallbacks in some
// browsers; typed locally instead of reaching for `any`.
interface VendorFullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>
  mozRequestFullScreen?: () => Promise<void>
  msRequestFullscreen?: () => Promise<void>
}

interface VendorFullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null
  mozFullScreenElement?: Element | null
  msFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void>
  mozCancelFullScreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
}

function getFullscreenElement(): Element | null {
  const doc = document as VendorFullscreenDocument
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.mozFullScreenElement ?? doc.msFullscreenElement ?? null
}

export interface ChartSize {
  width: number | null
  height: number
}

export interface UseChartFullscreenOptions {
  /** Chart height when not fullscreen */
  height: number
  /** Called after fullscreen/resize state settles, so the caller can resize its chart instance */
  onResize?: (size: ChartSize) => void
}

export interface UseChartFullscreenResult<T extends HTMLElement = HTMLElement> {
  containerRef: RefObject<T | null>
  isFullscreen: boolean
  size: ChartSize
  toggleFullscreen: () => void
}

/**
 * Shared fullscreen-toggle + resize mechanics for chart components — replaces
 * five near-identical implementations that used to live in each chart file.
 */
export function useChartFullscreen<T extends HTMLElement = HTMLElement>({
  height,
  onResize,
}: UseChartFullscreenOptions): UseChartFullscreenResult<T> {
  const containerRef = useRef<T>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [windowSize, setWindowSize] = useState(() => ({
    width: typeof window === 'undefined' ? 0 : window.innerWidth,
    height: typeof window === 'undefined' ? 0 : window.innerHeight,
  }))
  // Bumped on every raw resize/fullscreen event, independent of whether the
  // derived `size` below actually changes value — a non-fullscreen chart's
  // width stays `null` (auto) across resizes, but Highcharts/Leaflet still
  // need to be told to reflow when their container's rendered size changes.
  const [resizeTick, setResizeTick] = useState(0)

  // `size` is a plain derived value, not its own state — it always reflects
  // the latest `height` prop with no synchronization step required. Memoized
  // so its reference is stable across unrelated re-renders, since it's used
  // as an effect dependency below.
  const size: ChartSize = useMemo(
    () => (isFullscreen ? { width: windowSize.width, height: windowSize.height } : { width: null, height }),
    [isFullscreen, windowSize.width, windowSize.height, height],
  )

  const toggleFullscreen = useCallback(() => {
    const element = containerRef.current as VendorFullscreenElement | null
    if (!element) return

    void (async () => {
      try {
        // Only exit when *this* container owns fullscreen; otherwise take it over.
        if (getFullscreenElement() !== element) {
          const request =
            element.requestFullscreen?.bind(element) ??
            element.webkitRequestFullscreen?.bind(element) ??
            element.mozRequestFullScreen?.bind(element) ??
            element.msRequestFullscreen?.bind(element)
          await request?.()
        } else {
          const doc = document as VendorFullscreenDocument
          const exit =
            doc.exitFullscreen?.bind(doc) ??
            doc.webkitExitFullscreen?.bind(doc) ??
            doc.mozCancelFullScreen?.bind(doc) ??
            doc.msExitFullscreen?.bind(doc)
          await exit?.()
        }
      } catch {
        // Fullscreen API rejections (missing user gesture, unsupported browser) are non-fatal.
      }
    })()
  }, [])

  useEffect(() => {
    const events = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
    // Fullscreen events are document-wide; a chart only reacts when its own
    // container enters or leaves fullscreen, not when any other element does.
    let ownsFullscreen = false
    const handleFullscreenChange = () => {
      const next = !!containerRef.current && getFullscreenElement() === containerRef.current
      if (next === ownsFullscreen) return
      ownsFullscreen = next
      setIsFullscreen(next)
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      setResizeTick((tick) => tick + 1)
    }
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      setResizeTick((tick) => tick + 1)
    }

    events.forEach((event) => document.addEventListener(event, handleFullscreenChange))
    window.addEventListener('resize', handleResize)

    return () => {
      events.forEach((event) => document.removeEventListener(event, handleFullscreenChange))
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Sync the imperative chart instance (Highcharts `setSize`/`reflow`, Leaflet
  // `invalidateSize`, etc.) on mount and on every subsequent resize/fullscreen
  // event. This effect only calls the caller-supplied `onResize`, never a
  // local setState, so it's the "update an external system" case effects are
  // meant for — `resizeTick` is intentionally unused in the body, it just
  // forces a re-notify on raw resize events where `size`'s own values (e.g.
  // width staying `null` while not fullscreen) wouldn't otherwise change.
  useEffect(() => {
    const id = requestAnimationFrame(() => onResize?.(size))
    return () => cancelAnimationFrame(id)
  }, [size, resizeTick, onResize])

  return { containerRef, isFullscreen, size, toggleFullscreen }
}
