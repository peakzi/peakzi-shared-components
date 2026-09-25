// Chart colors/typography resolved from the design system's CSS custom
// properties (src/styles/_foundations.scss, src/styles/_dark.scss).
//
// Highcharts can't consume `var(--token)` directly: it writes colors as SVG
// presentation attributes (where var() doesn't resolve), parses color strings
// itself for hover/gradient math, and serializes exports outside the document.
// So tokens are read as resolved values instead — with no hardcoded fallbacks.
// A token that doesn't resolve (stylesheet not imported, SSR, jsdom) comes back
// `undefined`, and Highcharts falls back to its own default for that option.

const TOKENS = {
  primary: '--peakzi-purple',
  textPrimary: '--fg-1',
  textSecondary: '--fg-2',
  gridLine: '--border',
  surface: '--surface-1',
  fontFamily: '--font-body',
  success: '--success',
  danger: '--danger',
  warning: '--warning',
  info: '--info',
  textXs: '--text-xs',
  textSm: '--text-sm',
  textBase: '--text-base',
  textMd: '--text-md',
  textLg: '--text-lg',
  weightRegular: '--weight-regular',
  weightSemibold: '--weight-semibold',
  weightBold: '--weight-bold',
  radiusXs: '--radius-xs',
  radiusSm: '--radius-sm',
} as const

export type ChartTheme = { -readonly [K in keyof typeof TOKENS]: string | undefined }

/**
 * Reads every chart token from `element`'s computed style, so a scoped
 * `.peakzi-dark` ancestor is respected, not just `[data-theme]` on `<html>`.
 */
export function readChartTheme(element?: Element | null): ChartTheme {
  const theme = {} as ChartTheme
  const target = element ?? (typeof document === 'undefined' ? null : document.documentElement)
  const style = target && typeof getComputedStyle === 'function' ? getComputedStyle(target) : null

  for (const key of Object.keys(TOKENS) as Array<keyof typeof TOKENS>) {
    theme[key] = style?.getPropertyValue(TOKENS[key]).trim() || undefined
  }
  return theme
}

export function isSameChartTheme(a: ChartTheme, b: ChartTheme): boolean {
  return (Object.keys(TOKENS) as Array<keyof typeof TOKENS>).every((key) => a[key] === b[key])
}

/** `'6px'` → `6`, for Highcharts options that only accept numbers (e.g. `borderRadius`). */
export function toPx(value: string | undefined): number | undefined {
  const parsed = value === undefined ? NaN : parseFloat(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

/** `T` with every property, at any depth, also accepting `undefined`. */
export type WithUndefined<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends Array<infer U>
    ? Array<WithUndefined<U>>
    : T extends object
      ? { [K in keyof T]?: WithUndefined<T[K]> | undefined }
      : T

/**
 * Deep-removes `undefined` leaves from a Highcharts options object. Highcharts'
 * option merge copies `undefined` over its own defaults, so an unresolved
 * token must be absent from the options — not present as `undefined`.
 */
export function pruneUndefined<T>(value: WithUndefined<T>): T {
  if (Array.isArray(value)) {
    return value.map((item: unknown) => pruneUndefined(item)) as T
  }
  if (value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const result: Record<string, unknown> = {}
    for (const [key, entry] of Object.entries(value)) {
      if (entry !== undefined) result[key] = pruneUndefined(entry)
    }
    return result as T
  }
  return value as T
}

// Classes that switch the token set (see src/styles/_dark.scss). Keep in sync
// if a new theme class is added there.
const THEME_CLASSES = ['peakzi-dark']

function hasThemeClass(className: string | null): boolean {
  if (!className) return false
  const classes = className.split(/\s+/)
  return THEME_CLASSES.some((themeClass) => classes.includes(themeClass))
}

/**
 * Only `data-theme` changes, or class changes that add/remove a theme class,
 * can change resolved tokens. Everything else — unrelated UI class toggles,
 * Highcharts' own hover/select classes on SVG nodes — is ignored cheaply here
 * instead of making every mounted chart re-read its computed style.
 */
export function isThemeMutation(record: MutationRecord): boolean {
  if (record.attributeName === 'data-theme') return record.oldValue !== (record.target as Element).getAttribute('data-theme')
  if (record.attributeName !== 'class') return false
  return hasThemeClass(record.oldValue) !== hasThemeClass((record.target as Element).getAttribute('class'))
}

// One MutationObserver shared by every mounted chart, batched per frame.
const listeners = new Set<() => void>()
let observer: MutationObserver | null = null
let frame: number | null = null

export function subscribeToThemeChanges(listener: () => void): () => void {
  listeners.add(listener)

  if (!observer && typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
    observer = new MutationObserver((records) => {
      if (frame !== null || !records.some(isThemeMutation)) return
      frame = requestAnimationFrame(() => {
        frame = null
        listeners.forEach((notify) => notify())
      })
    })
    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeOldValue: true,
      attributeFilter: ['data-theme', 'class'],
    })
  }

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && observer) {
      observer.disconnect()
      observer = null
      if (frame !== null) cancelAnimationFrame(frame)
      frame = null
    }
  }
}
