import { useMemo } from 'react'
import type { ReactNode } from 'react'
import type { Options, PlotSeriesOptions, SeriesOptionsType } from 'highcharts'
import { Highcharts, HighchartsReact } from '../../internal/highchartsSetup'
import { pruneUndefined, toPx } from '../../internal/chartTheme'
import { useChartFrame } from '../../internal/useChartFrame'
import { Skeleton } from '../Progress'

export type PyramidChartPoint = [name: string, value: number]

export interface PyramidChartProps {
  isLoading?: boolean
  /**
   * Non-negative counts per tier. Values are log-scaled for display, which is
   * undefined below zero, so negative or non-finite values are treated as `0`
   * (with a console warning).
   */
  data: PyramidChartPoint[]
  /**
   * Rendered instead of the chart when every value is zero (or `data` is empty).
   * The chart has no opinion on what an empty state should look like — pass
   * your own illustration/message/retry action.
   */
  emptyState?: ReactNode
  chartHeight?: number
  className?: string
  /** Rendered as `data-testid` on the chart's root element. */
  testId?: string
}

/** Smooths runs of consecutive zero-value points so the funnel doesn't collapse mid-shape. */
function reverseConsecutiveZeros(points: PyramidChartPoint[]): PyramidChartPoint[] {
  if (points.length <= 1) return points
  const result = [...points]
  let run: PyramidChartPoint[] = []

  for (let i = 0; i < result.length - 1; i++) {
    const current = result[i]
    const next = result[i + 1]
    if (current && next && current[1] === 0 && next[1] === 0) {
      run.push(current)
    } else if (run.length > 0 && current) {
      run.push(current)
      for (let j = 0; j < run.length; j++) {
        const point = run[j]
        if (point) result[i - j] = point
      }
      run = []
    }
  }

  if (run.length > 0) {
    const last = result[result.length - 1]
    if (last) run.push(last)
    for (let j = 0; j < run.length; j++) {
      const point = run[j]
      if (point) result[result.length - 1 - j] = point
    }
  }

  return result
}

/** Clamps unsupported (negative / non-finite) values to 0, warning so bad input isn't silently hidden. */
function sanitizePoints(points: PyramidChartPoint[]): PyramidChartPoint[] {
  const invalid = points.filter(([, value]) => !Number.isFinite(value) || value < 0)
  if (invalid.length === 0) return points
  console.warn(
    `PyramidChart: values must be non-negative finite numbers; treating as 0: ${invalid.map(([name, value]) => `${name}=${value}`).join(', ')}`,
  )
  return points.map(([name, value]) => [name, Number.isFinite(value) && value > 0 ? value : 0])
}

const toLogScale = (value: number) => Math.log(1 + value)
const fromLogScale = (logValue: number) => Math.round(Math.exp(logValue) - 1)

export function PyramidChart({ isLoading = false, data, emptyState = null, chartHeight = 415, className, testId }: PyramidChartProps) {
  const { containerRef, isFullscreen, size, theme, exportMenuItems, setChart } = useChartFrame(chartHeight)

  const points = useMemo(() => sanitizePoints(data), [data])
  const isEmpty = points.every(([, value]) => value === 0)

  if (!isLoading && isEmpty) {
    return (
      <figure className={['pz-pyramid-chart', className].filter(Boolean).join(' ')} data-testid={testId}>
        {emptyState}
      </figure>
    )
  }

  const smoothed = reverseConsecutiveZeros(points)
  const logScaledData = smoothed.map(([name, value]): [string, number] => [name, toLogScale(value)])

  const options = pruneUndefined<Options>({
    chart: {
      type: 'pyramid',
      height: size.height,
      width: size.width ?? null,
      spacing: isFullscreen ? [50, 50, 50, 50] : [10, 10, 10, 10],
      backgroundColor: 'transparent',
    },
    title: { text: '' },
    plotOptions: {
      pyramid: {
        dataLabels: {
          alignTo: 'connectors',
          enabled: true,
          style: { fontSize: theme.textLg, color: theme.textPrimary, fontFamily: theme.fontFamily },
          overflow: 'allow',
          crop: false,
          distance: isFullscreen ? 100 : 15,
          connectorWidth: 1,
          connectorPadding: 5,
        },
      },
      // `center`/`width`/`height`/`softConnector` are real, runtime-supported
      // funnel/pyramid series options; Highcharts' own .d.ts only types the
      // generic `plotOptions.series` slot narrowly, without these.
      series: {
        dataLabels: {
          enabled: true,
          useHTML: true,
          formatter(this: { point: { name: string; y?: number | null } }): string {
            return `${this.point.name} (${fromLogScale(this.point.y ?? 0)})`
          },
          softConnector: true,
          style: { fontSize: isFullscreen ? theme.textMd : theme.textBase, fontFamily: theme.fontFamily },
        },
        center: isFullscreen ? ['50%', '50%'] : ['52%', '50%'],
        width: isFullscreen ? '60%' : '100%',
        height: isFullscreen ? '80%' : 395,
      } as unknown as PlotSeriesOptions,
    },
    legend: { enabled: false },
    series: [{ type: 'pyramid', name: 'Value', data: logScaledData }] as unknown as SeriesOptionsType[],
    tooltip: {
      borderRadius: toPx(theme.radiusSm),
      useHTML: true,
      // HTML tooltips live in the page DOM, so they're styled by class with tokens in PyramidChart.scss.
      formatter(this: { point: { name: string; y?: number | null } }): string {
        return `
          <p class="pz-pyramid-chart__tooltip">Size: <b>${this.point.name}</b></p>
          <p class="pz-pyramid-chart__tooltip">Value: <b>${fromLogScale(this.point.y ?? 0)}</b></p>
        `
      },
      style: { color: theme.textPrimary, fontSize: theme.textSm, fontFamily: theme.fontFamily },
    },
    responsive: {
      rules: [
        {
          condition: { maxWidth: 460 },
          chartOptions: {
            plotOptions: {
              series: {
                dataLabels: { softConnector: true, alignTo: 'plotEdges', distance: 10 },
                center: ['50%', '50%'],
                width: '50%',
              } as unknown as PlotSeriesOptions,
            },
          },
        },
        {
          condition: { maxWidth: 824 },
          chartOptions: {
            plotOptions: {
              series: {
                dataLabels: { softConnector: false, distance: 12 },
                center: ['43%', '50%'],
                width: '90%',
              } as unknown as PlotSeriesOptions,
            },
          },
        },
      ],
    },
    credits: { enabled: false },
    exporting: {
      buttons: { contextButton: { menuItems: exportMenuItems } },
      enabled: true,
      fallbackToExportServer: false,
    },
  })

  return (
    <figure
      ref={containerRef}
      className={['pz-pyramid-chart', isFullscreen && 'pz-pyramid-chart--fullscreen', className].filter(Boolean).join(' ')}
    >
      {isLoading ? (
        <Skeleton className="pz-pyramid-chart__skeleton" height={chartHeight} />
      ) : (
        <div className="pz-pyramid-chart__canvas" data-testid={testId}>
          <HighchartsReact ref={setChart} highcharts={Highcharts} options={options} containerProps={{ className: 'pz-pyramid-chart__plot' }} />
        </div>
      )}
    </figure>
  )
}
