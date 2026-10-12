import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { TimeSeriesChart } from './TimeSeriesChart'

const series = [{ name: 'Visits', data: [10, 20, 15, 30] }]

afterEach(() => document.documentElement.style.removeProperty('--surface-1'))

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

  it('wraps a palette shorter than the series count instead of leaving a series uncolored', () => {
    const { container } = render(
      <TimeSeriesChart
        series={[
          { name: 'A', data: [1, 2] },
          { name: 'B', data: [2, 3] },
          { name: 'C', data: [3, 4] },
        ]}
        colors={['#111111', '#222222']}
      />,
    )
    const strokes = Array.from(container.querySelectorAll('path.highcharts-graph')).map((p) => p.getAttribute('stroke'))
    expect(strokes).toEqual(['#111111', '#222222', '#111111'])
  })

  it('keeps wrapping correctly when a mounted chart is switched to a shorter palette', () => {
    const threeSeries = [
      { name: 'A', data: [1, 2] },
      { name: 'B', data: [2, 3] },
      { name: 'C', data: [3, 4] },
    ]
    const { container, rerender } = render(<TimeSeriesChart series={threeSeries} />)

    rerender(<TimeSeriesChart series={threeSeries} colors={['#111111', '#222222']} />)
    const strokes = Array.from(container.querySelectorAll('path.highcharts-graph')).map((p) => p.getAttribute('stroke'))
    expect(strokes).toEqual(['#111111', '#222222', '#111111'])
  })

  it('themes the export menu from design tokens instead of Highcharts defaults', async () => {
    document.documentElement.style.setProperty('--surface-1', 'rgb(10, 20, 30)')
    const { container } = render(<TimeSeriesChart series={series} />)
    fireEvent.click(container.querySelector('.highcharts-contextbutton')!)
    await waitFor(() => expect(document.querySelector('.highcharts-menu')).toBeInTheDocument())
    expect((document.querySelector('.highcharts-menu') as HTMLElement).style.background).toBe('rgb(10, 20, 30)')
  })
})
