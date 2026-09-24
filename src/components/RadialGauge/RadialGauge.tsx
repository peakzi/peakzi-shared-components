import type { ReactNode } from 'react'
import type { Options, PlotSolidgaugeOptions, SeriesOptionsType } from 'highcharts'
import { Highcharts, HighchartsReact } from '../../internal/highchartsSetup'
import { getChartTheme } from '../../internal/chartTheme'

export interface RadialGaugeProps {
  value: number
  maxValue: number
  /** Diameter in px */
  size?: number
  /** Two-stop gradient for the arc fill. Defaults to the design system's brand gradient. */
  colors?: [string, string]
  /**
   * Rendered in the center of the gauge — a logo, icon, or label. The gauge
   * itself has no opinion on what goes here, unlike a chart data label.
   */
  centerContent?: ReactNode
  className?: string
  /** Rendered as `data-testid` on the gauge's root element. */
  testId?: string
}

/**
 * A full-circle solid-gauge primitive with a slot for arbitrary center
 * content — the mechanical piece behind branded widgets like a company score
 * meter. Compose it with a logo/icon for a specific brand, rather than
 * building a new gauge from scratch.
 */
export function RadialGauge({ value, maxValue, size = 140, colors, centerContent, className, testId }: RadialGaugeProps) {
  const theme = getChartTheme()
  const [startColor, endColor] = colors ?? [theme.primary, theme.info]

  const options: Options = {
    chart: {
      type: 'solidgauge',
      backgroundColor: 'transparent',
      width: size,
      height: size,
      marginBottom: 0,
      style: { padding: '0' },
    },
    title: { text: '' },
    pane: {
      size: '82%',
      startAngle: 0,
      endAngle: 360,
      background: [
        {
          backgroundColor: theme.gridLine,
          outerRadius: '120%',
          innerRadius: '80%',
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
      // `borderWidth`/`borderColor` are real, runtime-supported solid-gauge
      // segment options; Highcharts' own .d.ts omits them here.
      solidgauge: {
        borderWidth: 2,
        borderColor: '#ffffff',
        dataLabels: { enabled: false },
      } as unknown as PlotSolidgaugeOptions,
    },
    series: [
      {
        type: 'solidgauge',
        name: 'Value',
        data: [
          {
            color: { linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 }, stops: [[0, startColor], [1, endColor]] },
            radius: '124%',
            innerRadius: '76%',
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.9)',
            y: value,
          },
        ],
      },
    ] as unknown as SeriesOptionsType[],
    credits: { enabled: false },
    exporting: { enabled: false },
  }

  return (
    <div
      className={['pz-radial-gauge', className].filter(Boolean).join(' ')}
      style={{ position: 'relative', width: size, height: size }}
      data-testid={testId}
    >
      <HighchartsReact highcharts={Highcharts} options={options} />
      {centerContent && (
        <div className="pz-radial-gauge__center" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {centerContent}
        </div>
      )}
    </div>
  )
}
