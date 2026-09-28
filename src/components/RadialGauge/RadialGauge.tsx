import { useRef } from 'react'
import type { ReactNode } from 'react'
import type { Options, PlotSolidgaugeOptions, SeriesOptionsType } from 'highcharts'
import { Highcharts, HighchartsReact } from '../../internal/highchartsSetup'
import { pruneUndefined } from '../../internal/chartTheme'
import { useChartTheme } from '../../hooks/ChartTheme/useChartTheme'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const theme = useChartTheme(containerRef)
  const [startColor, endColor] = colors ?? [theme.primary, theme.info]
  const gradientStops = startColor && endColor ? [[0, startColor], [1, endColor]] : undefined

  const options = pruneUndefined<Options>({
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
      // segment options; Highcharts' own .d.ts omits them here. The border
      // matches the surface behind the gauge, so it reads as a gap in both themes.
      solidgauge: {
        borderWidth: 2,
        borderColor: theme.surface,
        dataLabels: { enabled: false },
      } as unknown as PlotSolidgaugeOptions,
    },
    series: [
      {
        type: 'solidgauge',
        name: 'Value',
        data: [
          {
            color: gradientStops ? { linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 }, stops: gradientStops } : undefined,
            radius: '124%',
            innerRadius: '76%',
            borderWidth: 2,
            borderColor: theme.surface,
            y: value,
          },
        ],
      },
    ] as unknown as SeriesOptionsType[],
    credits: { enabled: false },
    exporting: { enabled: false },
  })

  return (
    <div
      ref={containerRef}
      className={['pz-radial-gauge', className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
      data-testid={testId}
    >
      <HighchartsReact highcharts={Highcharts} options={options} />
      {centerContent && <div className="pz-radial-gauge__center">{centerContent}</div>}
    </div>
  )
}
