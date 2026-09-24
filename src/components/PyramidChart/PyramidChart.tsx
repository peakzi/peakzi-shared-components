import type { ReactNode } from 'react'
import { useRef } from 'react'
import type { Chart, Options, PlotSeriesOptions, SeriesOptionsType } from 'highcharts'
import { Highcharts, HighchartsReact } from '../../internal/highchartsSetup'
import { getChartTheme } from '../../internal/chartTheme'
import { useChartFullscreen } from '../../hooks/ChartFullscreen/useChartFullscreen'
import { Skeleton } from '../Progress'

export type PyramidChartPoint = [name: string, value: number]

export interface PyramidChartProps {
  isLoading?: boolean
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

const toLogScale = (value: number) => Math.log(1 + value)
const fromLogScale = (logValue: number) => Math.round(Math.exp(logValue) - 1)

export function PyramidChart({ isLoading = false, data, emptyState = null, chartHeight = 415, className, testId }: PyramidChartProps) {
  const theme = getChartTheme()
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

  const isEmpty = data.length === 0 || data.reduce((sum, [, value]) => sum + value, 0) === 0

  if (!isLoading && isEmpty) {
    return (
      <figure className={['pz-pyramid-chart', className].filter(Boolean).join(' ')} style={{ width: '100%', margin: 0 }} data-testid={testId}>
        {emptyState}
      </figure>
    )
  }

  const smoothed = reverseConsecutiveZeros(data)
  const logScaledData = smoothed.map(([name, value]): [string, number] => [name, toLogScale(value)])

  const fullscreenMenuItems = [
    { text: `${isFullscreen ? 'Exit' : 'View'} Full Screen`, onclick: toggleFullscreen },
    'downloadPNG',
    'downloadJPEG',
    'downloadSVG',
    'downloadPDF',
  ] as unknown as string[]

  const options: Options = {
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
          style: { fontSize: '1.4rem', fontFamily: theme.fontFamily },
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
          style: { fontSize: isFullscreen ? '18px' : '16px', fontFamily: theme.fontFamily },
        },
        center: isFullscreen ? ['50%', '50%'] : ['52%', '50%'],
        width: isFullscreen ? '60%' : '100%',
        height: isFullscreen ? '80%' : 395,
      } as unknown as PlotSeriesOptions,
    },
    legend: { enabled: false },
    series: [{ type: 'pyramid', name: 'Value', data: logScaledData }] as unknown as SeriesOptionsType[],
    tooltip: {
      borderRadius: 8,
      useHTML: true,
      formatter(this: { point: { name: string; y?: number | null } }): string {
        return `
          <p style="font-size:14px;">Size: <b>${this.point.name}</b></p>
          <p style="font-size:14px;">Value: <b>${fromLogScale(this.point.y ?? 0)}</b></p>
        `
      },
      style: { color: theme.textPrimary, fontSize: '14px', fontFamily: theme.fontFamily },
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
      buttons: { contextButton: { menuItems: fullscreenMenuItems } },
      enabled: true,
      fallbackToExportServer: false,
    },
  }

  return (
    <figure
      ref={containerRef}
      className={['pz-pyramid-chart', className].filter(Boolean).join(' ')}
      style={{ position: 'relative', width: '100%', height: isFullscreen ? '100vh' : 'auto', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      {isLoading ? (
        <Skeleton style={{ width: '100%', height: chartHeight, borderRadius: 8 }} />
      ) : (
        <div style={{ width: '100%', height: '100%' }} data-testid={testId}>
          <HighchartsReact
            ref={(instance) => {
              chartRef.current = instance?.chart ?? null
            }}
            highcharts={Highcharts}
            options={options}
          />
        </div>
      )}
    </figure>
  )
}
