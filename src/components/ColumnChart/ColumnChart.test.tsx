import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ColumnChart } from './ColumnChart'

describe('ColumnChart', () => {
  it('renders a skeleton while loading, not the chart', () => {
    const { container } = render(<ColumnChart isLoading data={[1, 2, 3]} categories={['A', 'B', 'C']} />)
    expect(container.querySelector('.pz-skeleton')).toBeInTheDocument()
    expect(container.querySelector('.highcharts-container')).not.toBeInTheDocument()
  })

  it('renders the chart once loaded, with the given test id', () => {
    render(<ColumnChart data={[1, 2, 3]} categories={['A', 'B', 'C']} testId="revenue-chart" />)
    expect(screen.getByTestId('revenue-chart')).toBeInTheDocument()
  })

  it('applies a custom className to the root figure', () => {
    const { container } = render(<ColumnChart data={[1]} className="custom-chart" />)
    const figure = container.querySelector('figure')
    expect(figure?.className).toContain('pz-column-chart')
    expect(figure?.className).toContain('custom-chart')
  })

  it('renders with a single data series and no crash', () => {
    const { container } = render(<ColumnChart data={[10, 20, 30]} categories={['Jan', 'Feb', 'Mar']} />)
    expect(container.querySelector('.highcharts-container')).toBeInTheDocument()
  })

  it('renders with multiple named series (stacked or grouped) and no crash', () => {
    const { container } = render(
      <ColumnChart
        series={[
          { name: 'A', data: [1, 2, 3] },
          { name: 'B', data: [3, 2, 1] },
        ]}
        categories={['Jan', 'Feb', 'Mar']}
        stacked
      />,
    )
    expect(container.querySelector('.highcharts-container')).toBeInTheDocument()
    expect(container.querySelector('.highcharts-legend')).toBeInTheDocument()
  })

  it('renders a line chart type without crashing', () => {
    const { container } = render(<ColumnChart type="line" data={[5, 10, 15]} categories={['A', 'B', 'C']} />)
    expect(container.querySelector('.highcharts-container')).toBeInTheDocument()
  })
})
