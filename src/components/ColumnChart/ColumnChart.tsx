import type { Options, SeriesOptionsType, TooltipFormatterCallbackFunction } from 'highcharts'
import { Highcharts, HighchartsReact } from '../../internal/highchartsSetup'
import { pruneUndefined, toPx } from '../../internal/chartTheme'
import { useChartFrame } from '../../internal/useChartFrame'
import { Skeleton } from '../Progress'

export type ColumnChartType = 'column' | 'bar' | 'line'

export interface ColumnChartSeries {
  name: string
  data: number[]
  color?: string
}

export interface ColumnChartProps {
  isLoading?: boolean
  /** Single-series values. Ignored if `series` is provided. */
  data?: number[]
  /** Multiple named series — enables the legend automatically. */
  series?: ColumnChartSeries[]
  /** Stack `series` instead of grouping them side by side. */
  stacked?: boolean
  categories?: string[]
  type?: ColumnChartType
  title?: string
  yAxisTitle?: string
  tooltipFormatter?: TooltipFormatterCallbackFunction
  columnWidth?: number
  /** Default point/line color when a single `data` series is used. Defaults to the design system's brand accent. */
  color?: string
  chartHeight?: number
  className?: string
  /** Rendered as `data-testid` on the chart's root element. */
  testId?: string
}

export function ColumnChart({
  isLoading = false,
  data,
  series,
  stacked = false,
  categories,
  type = 'column',
  title,
  yAxisTitle,
  tooltipFormatter,
  columnWidth = 80,
  color,
  chartHeight = 480,
  className,
  testId,
}: ColumnChartProps) {
  const { containerRef, isFullscreen, size, theme, exportMenuItems, setChart } = useChartFrame(chartHeight)
  const resolvedColor = color ?? theme.primary
  const hasMultipleSeries = !!series
  const pointRadius = toPx(theme.radiusXs)

  const baseTextStyle = { fontSize: theme.textXs, fontWeight: theme.weightRegular, color: theme.textSecondary, fontFamily: theme.fontFamily }

  const options = pruneUndefined<Options>({
    chart: {
      type,
      height: size.height,
      width: size.width ?? null,
      spacing: [10, 10, 10, 10],
      animation: { duration: 0 },
      backgroundColor: 'transparent',
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: exportMenuItems,
        },
      },
      enabled: true,
      fallbackToExportServer: false,
    },
    responsive: {
      rules: [
        {
          condition: { maxWidth: 500 },
          chartOptions: {
            legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom' },
          },
        },
      ],
    },
    title: {
      text: title ?? '',
      style: { fontSize: theme.textBase, fontWeight: theme.weightBold, color: theme.textPrimary, fontFamily: theme.fontFamily },
    },
    xAxis: {
      categories: categories ?? [],
      gridLineWidth: 1,
      gridLineDashStyle: 'LongDash',
      gridLineColor: theme.gridLine,
      gridZIndex: 0,
      labels: { style: baseTextStyle },
    },
    yAxis: {
      title: {
        text: yAxisTitle ?? '',
        style: { color: theme.textPrimary, fontSize: theme.textSm, fontWeight: theme.weightBold, fontFamily: theme.fontFamily },
      },
      minorGridLineWidth: 0,
      gridLineWidth: 1,
      gridLineDashStyle: 'LongDash',
      gridLineColor: theme.gridLine,
      gridZIndex: 0,
      labels: { style: baseTextStyle },
    },
    tooltip: {
      borderRadius: toPx(theme.radiusSm),
      formatter:
        tooltipFormatter ??
        function () {
          return `<b>${this.x}</b><br/>${this.series.name}: <b>${this.y}</b>`
        },
      style: baseTextStyle,
    },
    plotOptions: {
      column: {
        ...(stacked ? { stacking: 'normal' as const } : {}),
        maxPointWidth: columnWidth,
        pointPadding: 0.1,
        borderWidth: 0,
        borderRadius: pointRadius,
        color: resolvedColor,
      },
      bar: {
        maxPointWidth: columnWidth,
        pointPadding: 0.1,
        borderWidth: 0,
        borderRadius: pointRadius,
        color: resolvedColor,
      },
      line: {
        color: resolvedColor,
        lineWidth: 3,
        marker: { enabled: true, radius: 4, fillColor: resolvedColor },
      },
    },
    series: (hasMultipleSeries
      ? series.map((entry) => ({ type, name: entry.name, data: entry.data, color: entry.color }))
      : [{ type, data: data ?? [], color: resolvedColor }]) as SeriesOptionsType[],
    legend: {
      enabled: hasMultipleSeries,
      itemStyle: { ...baseTextStyle, fontWeight: theme.weightBold },
    },
    credits: { enabled: false },
    accessibility: { enabled: false },
  })

  return (
    <figure
      ref={containerRef}
      className={['pz-column-chart', isFullscreen && 'pz-column-chart--fullscreen', className].filter(Boolean).join(' ')}
    >
      {isLoading ? (
        <Skeleton className="pz-column-chart__skeleton" height={chartHeight} />
      ) : (
        <div className="pz-column-chart__canvas" data-testid={testId}>
          <HighchartsReact
            ref={setChart}
            highcharts={Highcharts}
            options={options}
            containerProps={{ className: 'pz-column-chart__plot' }}
          />
        </div>
      )}
    </figure>
  )
}
