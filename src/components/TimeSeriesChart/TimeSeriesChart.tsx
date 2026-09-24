import { useRef, useState } from 'react'
import type { Chart, Options, Series, SeriesOptionsType, TooltipFormatterCallbackFunction } from 'highcharts'
import { Highcharts, HighchartsReact } from '../../internal/highchartsSetup'
import { getChartTheme } from '../../internal/chartTheme'
import { useChartFullscreen } from '../../hooks/ChartFullscreen/useChartFullscreen'
import { Skeleton } from '../Progress'

export type TimeSeriesChartType = 'line' | 'area' | 'spline'

export interface TimeSeriesChartSeries {
  name: string
  data: Array<number | null>
}

export interface TimeSeriesChartProps {
  isLoading?: boolean
  series: TimeSeriesChartSeries[]
  /** Milliseconds between points — combined with `pointStart` to place points on the time axis */
  pointInterval?: number
  /** Timestamp (ms) of the first point */
  pointStart?: number
  tooltipFormatter?: TooltipFormatterCallbackFunction
  legendEnabled?: boolean
  type?: TimeSeriesChartType
  chartHeight?: number
  subtitle?: string
  /** Called with the names of series left visible after the viewer toggles the legend */
  onVisibleSeriesChange?: (visibleSeriesNames: string[]) => void
  className?: string
  /** Rendered as `data-testid` on the chart's root element. */
  testId?: string
}

export function TimeSeriesChart({
  isLoading = false,
  series,
  pointInterval,
  pointStart,
  tooltipFormatter,
  legendEnabled = true,
  type = 'line',
  chartHeight = 300,
  subtitle,
  onVisibleSeriesChange,
  className,
  testId,
}: TimeSeriesChartProps) {
  const theme = getChartTheme()
  const chartRef = useRef<Chart | null>(null)
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())

  const { containerRef, isFullscreen, size, toggleFullscreen } = useChartFullscreen<HTMLElement>({
    height: chartHeight,
    onResize: (next) => {
      const chart = chartRef.current
      if (!chart) return
      chart.setSize(next.width, next.height, false)
      chart.reflow()
    },
  })

  const baseTextStyle = { fontSize: '12px', fontWeight: 'normal', color: theme.textSecondary, fontFamily: theme.fontFamily }

  const fullscreenMenuItems = [
    { text: `${isFullscreen ? 'Exit' : 'View'} Full Screen`, onclick: toggleFullscreen },
    'downloadPNG',
    'downloadJPEG',
    'downloadSVG',
    'downloadPDF',
  ] as unknown as string[]

  const seriesWithColorIndex = series.map((entry, index) => ({
    type,
    name: entry.name,
    data: entry.data,
    colorIndex: index,
  })) as unknown as SeriesOptionsType[]

  const options: Options = {
    chart: {
      type,
      height: size.height,
      width: size.width ?? null,
      spacing: [10, 10, 10, 10],
      animation: { duration: 0 },
      backgroundColor: 'transparent',
    },
    exporting: {
      buttons: { contextButton: { menuItems: fullscreenMenuItems } },
      enabled: true,
      fallbackToExportServer: false,
    },
    responsive: {
      rules: [
        {
          condition: { maxWidth: 500 },
          chartOptions: { legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom' } },
        },
      ],
    },
    title: { text: '' },
    subtitle: subtitle
      ? { text: subtitle, useHTML: true, align: 'left', style: { fontSize: '13px', color: theme.textSecondary, fontFamily: theme.fontFamily } }
      : { text: '' },
    xAxis: {
      type: 'datetime',
      gridLineWidth: 1,
      gridLineDashStyle: 'LongDash',
      gridLineColor: theme.gridLine,
      gridZIndex: 0,
      labels: { style: baseTextStyle },
    },
    yAxis: {
      title: { text: '' },
      gridLineWidth: 1,
      gridLineDashStyle: 'LongDash',
      gridLineColor: theme.gridLine,
      labels: { style: baseTextStyle },
    },
    tooltip: {
      borderRadius: 8,
      ...(tooltipFormatter ? { formatter: tooltipFormatter } : {}),
      style: baseTextStyle,
    },
    plotOptions: {
      series: {
        ...(pointInterval !== undefined ? { pointInterval } : {}),
        ...(pointStart !== undefined ? { pointStart } : {}),
        connectNulls: false,
        marker: { enabled: false, states: { hover: { enabled: true } } },
        events: {
          legendItemClick(this: Series) {
            const next = new Set(hiddenSeries)
            if (this.visible) {
              next.add(this.name)
            } else {
              next.delete(this.name)
            }
            setHiddenSeries(next)

            requestAnimationFrame(() => {
              const chart = chartRef.current
              if (!chart) return
              const visibleNames = chart.series.filter((s) => s.visible).map((s) => s.name)
              onVisibleSeriesChange?.(visibleNames)
            })
          },
        },
      },
    },
    series: seriesWithColorIndex,
    legend: {
      enabled: legendEnabled,
      itemStyle: { ...baseTextStyle, fontWeight: 'bold' },
    },
    credits: { enabled: false },
    accessibility: { enabled: false },
  }

  const containerStyle = {
    position: 'relative' as const,
    width: '100%',
    height: isFullscreen ? '100vh' : '100%',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  }

  return (
    <figure ref={containerRef} className={['pz-timeseries-chart', className].filter(Boolean).join(' ')} style={containerStyle}>
      {isLoading ? (
        <Skeleton style={{ width: '100%', height: chartHeight, borderRadius: 8 }} />
      ) : (
        <div style={{ ...containerStyle, flex: 1 }} data-testid={testId}>
          <HighchartsReact
            ref={(instance) => {
              chartRef.current = instance?.chart ?? null
            }}
            highcharts={Highcharts}
            options={options}
            containerProps={{ style: { height: '100%', width: '100%', flex: 1 } }}
          />
        </div>
      )}
    </figure>
  )
}
