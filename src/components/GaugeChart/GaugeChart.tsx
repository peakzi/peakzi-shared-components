import type { Options, SeriesOptionsType } from 'highcharts'
import { Highcharts, HighchartsReact } from '../../internal/highchartsSetup'
import { getChartTheme } from '../../internal/chartTheme'

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
  const theme = getChartTheme()

  const options: Options = {
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
          formatter(this: { y?: number | null }): string {
            return `
              <p style="color:${theme.primary};font-size:38px;font-weight:600;display:flex;align-items:flex-end;justify-content:center">
                <span style="font-size:1em;width:min-content">${(this.y ?? 0).toLocaleString()}</span>
                <span style="font-size:0.6em;width:min-content;padding-bottom:4px">${unit}</span>
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
            color: { linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 }, stops: [[0, theme.primary], [1, theme.info]] },
            radius: '112%',
            innerRadius: '88%',
            y: value,
          },
        ],
      },
    ] as unknown as SeriesOptionsType[],
    credits: { enabled: false },
    exporting: { enabled: false },
  }

  return (
    <figure className={['pz-gauge-chart', className].filter(Boolean).join(' ')} style={{ width: '100%', margin: 0 }} data-testid={testId}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  )
}
