import { useRef } from 'react'
import type { Chart, Options, SeriesOptionsType, TooltipFormatterCallbackFunction } from 'highcharts'
import { Highcharts, HighchartsReact } from '../../internal/highchartsSetup'
import { getChartTheme } from '../../internal/chartTheme'
import { useChartFullscreen } from '../../hooks/ChartFullscreen/useChartFullscreen'
import { Skeleton } from '../Progress'

export type ColumnChartType = 'column' | 'bar' | 'line'

export interface ColumnChartSeries {
  name: string
  data: number[]
  color?: string
}

export interface ColumnChartProps {
  isLoading?: boolean
  /** Single-series values. Ignored if `series` is provided. */
  data?: number[]
  /** Multiple named series — enables the legend automatically. */
  series?: ColumnChartSeries[]
  /** Stack `series` instead of grouping them side by side. */
  stacked?: boolean
  categories?: string[]
  type?: ColumnChartType
  title?: string
  yAxisTitle?: string
  tooltipFormatter?: TooltipFormatterCallbackFunction
  columnWidth?: number
  /** Default point/line color when a single `data` series is used. Defaults to the design system's brand accent. */
  color?: string
  chartHeight?: number
  className?: string
  /** Rendered as `data-testid` on the chart's root element. */
  testId?: string
}

export function ColumnChart({
  isLoading = false,
  data,
  series,
  stacked = false,
  categories,
  type = 'column',
  title,
  yAxisTitle,
  tooltipFormatter,
  columnWidth = 80,
  color,
  chartHeight = 480,
  className,
  testId,
}: ColumnChartProps) {
  const theme = getChartTheme()
  const resolvedColor = color ?? theme.primary
  const hasMultipleSeries = !!series
  const chartRef = useRef<Chart | null>(null)

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

  // Highcharts supports custom {text, onclick} menu items at runtime, but its
  // own .d.ts only declares `menuItems?: Array<string>` — a known gap between
  // the library's real API and its published types.
  const fullscreenMenuItems = [
    { text: `${isFullscreen ? 'Exit' : 'View'} Full Screen`, onclick: toggleFullscreen },
    'downloadPNG',
    'downloadJPEG',
    'downloadSVG',
    'downloadPDF',
  ] as unknown as string[]

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
      buttons: {
        contextButton: {
          menuItems: fullscreenMenuItems,
        },
      },
      enabled: true,
      fallbackToExportServer: false,
    },
    responsive: {
      rules: [
        {
          condition: { maxWidth: 500 },
          chartOptions: {
            legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom' },
          },
        },
      ],
    },
    title: {
      text: title ?? '',
      style: { fontSize: '16px', fontWeight: 'bold', color: theme.textPrimary, fontFamily: theme.fontFamily },
    },
    xAxis: {
      categories: categories ?? [],
      gridLineWidth: 1,
      gridLineDashStyle: 'LongDash',
      gridLineColor: theme.gridLine,
      gridZIndex: 0,
      labels: { style: baseTextStyle },
    },
    yAxis: {
      title: {
        text: yAxisTitle ?? '',
        style: { color: theme.textPrimary, fontSize: '14px', fontWeight: 'bold', fontFamily: theme.fontFamily },
      },
      minorGridLineWidth: 0,
      gridLineWidth: 1,
      gridLineDashStyle: 'LongDash',
      gridLineColor: theme.gridLine,
      gridZIndex: 0,
      labels: { style: baseTextStyle },
    },
    tooltip: {
      borderRadius: 8,
      formatter:
        tooltipFormatter ??
        function () {
          return `<b>${this.x}</b><br/>${this.series.name}: <b>${this.y}</b>`
        },
      style: baseTextStyle,
    },
    plotOptions: {
      column: {
        ...(stacked ? { stacking: 'normal' as const } : {}),
        maxPointWidth: columnWidth,
        pointPadding: 0.1,
        borderWidth: 0,
        borderRadius: 4,
        color: resolvedColor,
      },
      bar: {
        maxPointWidth: columnWidth,
        pointPadding: 0.1,
        borderWidth: 0,
        borderRadius: 4,
        color: resolvedColor,
      },
      line: {
        color: resolvedColor,
        lineWidth: 3,
        marker: { enabled: true, radius: 4, fillColor: resolvedColor },
      },
    },
    series: (hasMultipleSeries
      ? series.map((entry) => ({ type, name: entry.name, data: entry.data, color: entry.color }))
      : [{ type, data: data ?? [], color: resolvedColor }]) as SeriesOptionsType[],
    legend: {
      enabled: hasMultipleSeries,
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
    <figure ref={containerRef} className={['pz-column-chart', className].filter(Boolean).join(' ')} style={containerStyle}>
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
