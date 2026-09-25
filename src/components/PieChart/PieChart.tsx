import type { Options, SeriesOptionsType } from 'highcharts'
import { Highcharts, HighchartsReact } from '../../internal/highchartsSetup'
import { pruneUndefined, toPx } from '../../internal/chartTheme'
import { useChartFrame } from '../../internal/useChartFrame'
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
  const { containerRef, isFullscreen, size, theme, exportMenuItems, setChart } = useChartFrame(chartHeight)

  const seriesData = data.map((slice) => ({ name: slice.name, y: slice.value }))

  const options = pruneUndefined<Options>({
    chart: {
      type: 'pie',
      height: size.height,
      width: size.width ?? null,
      backgroundColor: 'transparent',
    },
    title: {
      text: title ?? '',
      style: { color: theme.textPrimary, fontWeight: theme.weightBold, fontFamily: theme.fontFamily },
    },
    tooltip: {
      useHTML: true,
      borderRadius: toPx(theme.radiusSm),
      // HTML tooltips live in the page DOM, so they're styled by class with tokens in PieChart.scss.
      formatter() {
        return `
          <p class="pz-pie-chart__tooltip"><b>${this.point.name}</b></p>
          <p class="pz-pie-chart__tooltip">${this.point.y}${valueSuffix}</p>
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
          style: { fontSize: theme.textSm, color: theme.textPrimary, fontFamily: theme.fontFamily },
        },
      },
    },
    series: [{ type: 'pie', name: title ?? 'Value', colorByPoint: true, data: seriesData }] as unknown as SeriesOptionsType[],
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
      className={['pz-pie-chart', isFullscreen && 'pz-pie-chart--fullscreen', className].filter(Boolean).join(' ')}
    >
      {isLoading ? (
        <Skeleton className="pz-pie-chart__skeleton" height={chartHeight} />
      ) : (
        <div className="pz-pie-chart__canvas" data-testid={testId}>
          <HighchartsReact ref={setChart} highcharts={Highcharts} options={options} containerProps={{ className: 'pz-pie-chart__plot' }} />
        </div>
      )}
    </figure>
  )
}
