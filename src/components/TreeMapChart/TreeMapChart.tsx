import type { Options, SeriesOptionsType } from 'highcharts'
import { Highcharts, HighchartsReact } from '../../internal/highchartsSetup'
import { getChartTheme } from '../../internal/chartTheme'
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
  const theme = getChartTheme()

  const options: Options = {
    chart: { height: chartHeight, backgroundColor: 'transparent' },
    drilldown: {
      breadcrumbs: {
        buttonTheme: {
          fill: 'transparent',
          padding: 8,
          stroke: theme.gridLine,
          'stroke-width': 1,
          style: { fontWeight: 'bold', fontSize: '14px' },
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
              style: { fontSize: '14px' },
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
      style: { color: theme.textPrimary, fontSize: '18px', fontWeight: 'bold', fontFamily: theme.fontFamily },
    },
    tooltip: {
      borderRadius: 8,
      formatter() {
        return `${this.point.name} : ${this.point.options.value}${valueSuffix}`
      },
      style: { color: theme.textPrimary, fontSize: '14px', fontWeight: 'bold', fontFamily: theme.fontFamily },
    },
    credits: { enabled: false },
  }

  return (
    <figure className={['pz-treemap-chart', className].filter(Boolean).join(' ')} style={{ width: '100%', margin: 0 }}>
      {isLoading ? (
        <Skeleton style={{ width: '100%', height: chartHeight, borderRadius: 8 }} />
      ) : (
        <div style={{ width: '100%', height: '100%' }} data-testid={testId}>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      )}
    </figure>
  )
}
