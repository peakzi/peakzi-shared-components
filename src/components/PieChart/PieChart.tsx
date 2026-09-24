import { useRef } from 'react'
import type { Chart, Options, SeriesOptionsType } from 'highcharts'
import { Highcharts, HighchartsReact } from '../../internal/highchartsSetup'
import { getChartTheme } from '../../internal/chartTheme'
import { useChartFullscreen } from '../../hooks/ChartFullscreen/useChartFullscreen'
import { Skeleton } from '../Progress'

export interface PieChartSlice {
  name: string
  value: number
}

export interface PieChartProps {
  isLoading?: boolean
  data: PieChartSlice[]
  title?: string
  /** Suffix appended to values in the tooltip and data labels, e.g. `'%'` */
  valueSuffix?: string
  chartHeight?: number
  className?: string
  /** Rendered as `data-testid` on the chart's root element. */
  testId?: string
}

export function PieChart({ isLoading = false, data, title, valueSuffix = '%', chartHeight = 400, className, testId }: PieChartProps) {
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

  const fullscreenMenuItems = [
    { text: `${isFullscreen ? 'Exit' : 'View'} Full Screen`, onclick: toggleFullscreen },
    'downloadPNG',
    'downloadJPEG',
    'downloadSVG',
    'downloadPDF',
  ] as unknown as string[]

  const seriesData = data.map((slice) => ({ name: slice.name, y: slice.value }))

  const options: Options = {
    chart: {
      type: 'pie',
      height: size.height,
      width: size.width ?? null,
      backgroundColor: 'transparent',
    },
    title: { text: title ?? '' },
    tooltip: {
      useHTML: true,
      formatter() {
        return `
          <p style="font-size:14px;"><b>${this.point.name}</b></p>
          <p style="font-size:14px;">${this.point.y}${valueSuffix}</p>
        `
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: `<b>{point.name}</b>: {point.percentage:.1f} %`,
          style: { fontSize: '14px', fontFamily: theme.fontFamily },
        },
      },
    },
    series: [{ type: 'pie', name: title ?? 'Value', colorByPoint: true, data: seriesData }] as unknown as SeriesOptionsType[],
    credits: { enabled: false },
    exporting: {
      buttons: { contextButton: { menuItems: fullscreenMenuItems } },
      enabled: true,
      fallbackToExportServer: false,
    },
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
    <figure ref={containerRef} className={['pz-pie-chart', className].filter(Boolean).join(' ')} style={containerStyle}>
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
