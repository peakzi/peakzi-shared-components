import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TimeSeriesChart } from './TimeSeriesChart'

const series = [{ name: 'Visits', data: [10, 20, 15, 30] }]

describe('TimeSeriesChart', () => {
  it('renders a skeleton while loading, not the chart', () => {
    const { container } = render(<TimeSeriesChart isLoading series={series} />)
    expect(container.querySelector('.pz-skeleton')).toBeInTheDocument()
    expect(container.querySelector('.highcharts-container')).not.toBeInTheDocument()
  })

  it('renders the chart once loaded, with the given test id', () => {
    render(<TimeSeriesChart series={series} testId="traffic-chart" />)
    expect(screen.getByTestId('traffic-chart')).toBeInTheDocument()
  })

  it('renders multiple series with a legend by default', () => {
    const { container } = render(
      <TimeSeriesChart
        series={[
          { name: 'This week', data: [1, 2, 3] },
          { name: 'Last week', data: [2, 1, 2] },
        ]}
      />,
    )
    expect(container.querySelector('.highcharts-legend')).toBeInTheDocument()
  })

  it('hides the legend when legendEnabled is false', () => {
    const { container } = render(<TimeSeriesChart series={series} legendEnabled={false} />)
    expect(container.querySelector('.highcharts-legend')).not.toBeInTheDocument()
  })

  it('renders a subtitle when provided', () => {
    const { container } = render(<TimeSeriesChart series={series} subtitle="Last 30 days" />)
    expect(container.querySelector('.highcharts-subtitle')?.textContent).toBe('Last 30 days')
  })

  it('applies a custom className to the root figure', () => {
    const { container } = render(<TimeSeriesChart series={series} className="custom-chart" />)
    const figure = container.querySelector('figure')
    expect(figure?.className).toContain('pz-timeseries-chart')
    expect(figure?.className).toContain('custom-chart')
  })
})
