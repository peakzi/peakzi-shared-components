import { useState } from 'react'
import type { Options, Series, SeriesOptionsType, TooltipFormatterCallbackFunction } from 'highcharts'
import { Highcharts, HighchartsReact } from '../../internal/highchartsSetup'
import { pruneUndefined, toPx } from '../../internal/chartTheme'
import { useChartFrame } from '../../internal/useChartFrame'
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
  const { chartRef, containerRef, isFullscreen, size, theme, exportMenuItems, setChart } = useChartFrame(chartHeight)
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())

  const baseTextStyle = { fontSize: theme.textXs, fontWeight: theme.weightRegular, color: theme.textSecondary, fontFamily: theme.fontFamily }

  const seriesWithColorIndex = series.map((entry, index) => ({
    type,
    name: entry.name,
    data: entry.data,
    colorIndex: index,
  })) as unknown as SeriesOptionsType[]

  const options = pruneUndefined<Options>({
    chart: {
      type,
      height: size.height,
      width: size.width ?? null,
      spacing: [10, 10, 10, 10],
      animation: { duration: 0 },
      backgroundColor: 'transparent',
    },
    exporting: {
      buttons: { contextButton: { menuItems: exportMenuItems } },
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
      ? { text: subtitle, useHTML: true, align: 'left', style: { fontSize: theme.textSm, color: theme.textSecondary, fontFamily: theme.fontFamily } }
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
      borderRadius: toPx(theme.radiusSm),
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
      itemStyle: { ...baseTextStyle, fontWeight: theme.weightBold },
    },
    credits: { enabled: false },
    accessibility: { enabled: false },
  })

  return (
    <figure
      ref={containerRef}
      className={['pz-timeseries-chart', isFullscreen && 'pz-timeseries-chart--fullscreen', className].filter(Boolean).join(' ')}
    >
      {isLoading ? (
        <Skeleton className="pz-timeseries-chart__skeleton" height={chartHeight} />
      ) : (
        <div className="pz-timeseries-chart__canvas" data-testid={testId}>
          <HighchartsReact
            ref={setChart}
            highcharts={Highcharts}
            options={options}
            containerProps={{ className: 'pz-timeseries-chart__plot' }}
          />
        </div>
      )}
    </figure>
  )
}
