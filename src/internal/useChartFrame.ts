import { useCallback, useRef } from 'react'
import type { Chart } from 'highcharts'
import type { HighchartsReactRefObject } from 'highcharts-react-official'
import { useChartFullscreen } from '../hooks/ChartFullscreen/useChartFullscreen'
import type { ChartSize } from '../hooks/ChartFullscreen/useChartFullscreen'
import { useChartTheme } from '../hooks/ChartTheme/useChartTheme'

/**
 * Wiring every fullscreen-capable chart shares: the chart instance ref, the
 * fullscreen/resize hook, live theme tokens, and the export menu with a
 * fullscreen toggle.
 */
export function useChartFrame(chartHeight: number) {
  const chartRef = useRef<Chart | null>(null)

  const onResize = useCallback((next: ChartSize) => {
    const chart = chartRef.current
    if (!chart) return
    chart.setSize(next.width, next.height, false)
    chart.reflow()
  }, [])

  const { containerRef, isFullscreen, size, toggleFullscreen } = useChartFullscreen<HTMLElement>({
    height: chartHeight,
    onResize,
  })
  const theme = useChartTheme(containerRef)

  const setChart = useCallback((instance: HighchartsReactRefObject | null) => {
    chartRef.current = instance?.chart ?? null
  }, [])

  // Highcharts supports custom {text, onclick} menu items at runtime, but its
  // own .d.ts only declares `menuItems?: Array<string>` — a known gap between
  // the library's real API and its published types.
  const exportMenuItems = [
    { text: `${isFullscreen ? 'Exit' : 'View'} Full Screen`, onclick: toggleFullscreen },
    'downloadPNG',
    'downloadJPEG',
    'downloadSVG',
    'downloadPDF',
  ] as unknown as string[]

  return { chartRef, containerRef, isFullscreen, size, theme, exportMenuItems, setChart }
}
