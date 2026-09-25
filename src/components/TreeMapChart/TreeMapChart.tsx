import type { Options, SeriesOptionsType } from 'highcharts'
import { Highcharts, HighchartsReact } from '../../internal/highchartsSetup'
import { pruneUndefined, toPx } from '../../internal/chartTheme'
import { useChartFrame } from '../../internal/useChartFrame'
import { Skeleton } from '../Progress'

export interface TreeMapChartPoint {
  name: string
  value: number
  /** Group id, for hierarchical (drilldown) treemaps */
  id?: string
  /** Parent group id, for hierarchical (drilldown) treemaps */
  parent?: string
  color?: string
}

export interface TreeMapChartProps {
  isLoading?: boolean
  data: TreeMapChartPoint[]
  title?: string
  /** Suffix appended to values in the tooltip and data labels, e.g. `'%'` */
  valueSuffix?: string
  chartHeight?: number
  className?: string
  /** Rendered as `data-testid` on the chart's root element. */
  testId?: string
}

export function TreeMapChart({
  isLoading = false,
  data,
  title,
  valueSuffix = '%',
  chartHeight = 400,
  className,
  testId,
}: TreeMapChartProps) {
  const { containerRef, isFullscreen, size, theme, exportMenuItems, setChart } = useChartFrame(chartHeight)

  const options = pruneUndefined<Options>({
    chart: { height: size.height, width: size.width ?? null, backgroundColor: 'transparent' },
    drilldown: {
      breadcrumbs: {
        buttonTheme: {
          fill: 'transparent',
          padding: 8,
          stroke: theme.gridLine,
          'stroke-width': 1,
          style: { color: theme.textPrimary, fontWeight: theme.weightBold, fontSize: theme.textSm },
        },
        floating: true,
        position: { align: 'right' },
        showFullPath: false,
      },
    },
    series: [
      {
        type: 'treemap',
        name: title ?? 'Value',
        layoutAlgorithm: 'squarified',
        allowTraversingTree: true,
        animationLimit: 1000,
        dataLabels: { enabled: false },
        levels: [
          {
            level: 1,
            dataLabels: {
              enabled: true,
              style: { fontSize: theme.textSm, fontFamily: theme.fontFamily },
              useHTML: true,
              formatter(this: { point: { name: string; value?: number } }): string {
                return `${this.point.name} (${this.point.value}${valueSuffix})`
              },
            },
            borderWidth: 3,
            levelIsConstant: false,
          },
        ],
        accessibility: { exposeAsGroupOnly: true },
        data,
      },
    ] as unknown as SeriesOptionsType[],
    title: {
      text: title ?? '',
      style: { color: theme.textPrimary, fontSize: theme.textMd, fontWeight: theme.weightBold, fontFamily: theme.fontFamily },
    },
    tooltip: {
      borderRadius: toPx(theme.radiusSm),
      formatter() {
        return `${this.point.name} : ${this.point.options.value}${valueSuffix}`
      },
      style: { color: theme.textPrimary, fontSize: theme.textSm, fontWeight: theme.weightBold, fontFamily: theme.fontFamily },
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
      className={['pz-treemap-chart', isFullscreen && 'pz-treemap-chart--fullscreen', className].filter(Boolean).join(' ')}
    >
      {isLoading ? (
        <Skeleton className="pz-treemap-chart__skeleton" height={chartHeight} />
      ) : (
        <div className="pz-treemap-chart__canvas" data-testid={testId}>
          <HighchartsReact ref={setChart} highcharts={Highcharts} options={options} containerProps={{ className: 'pz-treemap-chart__plot' }} />
        </div>
      )}
    </figure>
  )
}
