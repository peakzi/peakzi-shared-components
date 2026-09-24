// Default colors/fonts for chart components, sourced from the design system's
// own CSS custom properties (src/styles/_foundations.scss) instead of
// hardcoding hex values. Every chart still accepts its own color/font props —
// this only supplies the out-of-the-box look, and it reads live so it follows
// [data-theme="dark"] token overrides whenever a chart re-renders.

const FALLBACKS = {
  '--peakzi-purple': '#a070f0',
  '--fg-1': '#1f1e5a',
  '--fg-2': '#52526a',
  '--border': '#d9d9e3',
  '--font-body': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  '--success': '#17b26a',
  '--danger': '#f04438',
  '--warning': '#f79009',
  '--info': '#7080f0',
} as const

type ThemeToken = keyof typeof FALLBACKS

function readToken(token: ThemeToken): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return FALLBACKS[token]
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
  return value || FALLBACKS[token]
}

export interface ChartTheme {
  /** Primary brand accent — default series/point color */
  primary: string
  /** Primary text — titles */
  textPrimary: string
  /** Secondary text — axis labels, legend */
  textSecondary: string
  /** Grid lines / borders */
  gridLine: string
  fontFamily: string
  success: string
  danger: string
  warning: string
  info: string
}

export function getChartTheme(): ChartTheme {
  return {
    primary: readToken('--peakzi-purple'),
    textPrimary: readToken('--fg-1'),
    textSecondary: readToken('--fg-2'),
    gridLine: readToken('--border'),
    fontFamily: readToken('--font-body'),
    success: readToken('--success'),
    danger: readToken('--danger'),
    warning: readToken('--warning'),
    info: readToken('--info'),
  }
}
