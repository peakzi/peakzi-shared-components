import { useEffect, useLayoutEffect, useState } from 'react'
import type { RefObject } from 'react'
import { isSameChartTheme, readChartTheme, subscribeToThemeChanges } from '../../internal/chartTheme'
import type { ChartTheme } from '../../internal/chartTheme'

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Resolved design tokens for a chart, read from the chart's own root element
 * and re-read whenever `data-theme`/`class` changes anywhere in the document —
 * so a light/dark switch restyles mounted charts without waiting for the
 * caller to re-render them.
 */
export function useChartTheme(ref: RefObject<Element | null>): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>(() => readChartTheme())

  useIsomorphicLayoutEffect(() => {
    const sync = () => {
      const next = readChartTheme(ref.current)
      setTheme((current) => (isSameChartTheme(current, next) ? current : next))
    }
    sync()
    return subscribeToThemeChanges(sync)
  }, [ref])

  return theme
}
