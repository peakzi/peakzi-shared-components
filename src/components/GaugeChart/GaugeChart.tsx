import { useRef } from 'react'
import type { Options, SeriesOptionsType } from 'highcharts'
import { Highcharts, HighchartsReact } from '../../internal/highchartsSetup'
import { pruneUndefined } from '../../internal/chartTheme'
import { useChartTheme } from '../../hooks/ChartTheme/useChartTheme'

export interface GaugeChartProps {
  value: number
  maxValue: number
  /** Appended after the value in the center label, e.g. `'%'`. Omit for a unitless value. */
  unit?: string
  chartHeight?: number
  className?: string
  /** Rendered as `data-testid` on the chart's root element. */
  testId?: string
}

export function GaugeChart({ value, maxValue, unit = '', chartHeight = 170, className, testId }: GaugeChartProps) {
  const containerRef = useRef<HTMLElement>(null)
  const theme = useChartTheme(containerRef)
  const gradientStops = theme.primary && theme.info ? [[0, theme.primary], [1, theme.info]] : undefined

  const options = pruneUndefined<Options>({
    chart: {
      type: 'solidgauge',
      backgroundColor: 'transparent',
      height: chartHeight,
      marginTop: 10,
      marginBottom: 0,
      style: { padding: '0' },
    },
    title: { text: '' },
    pane: {
      size: '80%',
      startAngle: -150,
      endAngle: 150,
      background: [
        {
          backgroundColor: theme.gridLine,
          outerRadius: '107%',
          innerRadius: '97%',
          borderWidth: 0,
          shape: 'arc',
        },
      ],
    },
    tooltip: { enabled: false },
    yAxis: {
      tickWidth: 0,
      min: 0,
      max: maxValue,
      lineWidth: 0,
      tickAmount: 2,
      labels: { enabled: false },
    },
    plotOptions: {
      solidgauge: {
        linecap: 'round',
        rounded: true,
        dataLabels: {
          enabled: true,
          borderWidth: 0,
          y: -30,
          useHTML: true,
          // HTML data labels live in the page DOM, so they're styled by class with tokens in GaugeChart.scss.
          formatter(this: { y?: number | null }): string {
            return `
              <p class="pz-gauge-chart__value">
                <span class="pz-gauge-chart__number">${(this.y ?? 0).toLocaleString()}</span>
                <span class="pz-gauge-chart__unit">${unit}</span>
              </p>
            `
          },
        },
      },
    },
    series: [
      {
        type: 'solidgauge',
        name: 'Value',
        rounded: true,
        data: [
          {
            color: gradientStops ? { linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 }, stops: gradientStops } : undefined,
            radius: '112%',
            innerRadius: '88%',
            y: value,
          },
        ],
      },
    ] as unknown as SeriesOptionsType[],
    credits: { enabled: false },
    exporting: { enabled: false },
  })

  return (
    <figure ref={containerRef} className={['pz-gauge-chart', className].filter(Boolean).join(' ')} data-testid={testId}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  )
}
