import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PieChart } from './PieChart'

const data = [
  { name: 'Organic', value: 60 },
  { name: 'Paid', value: 40 },
]

describe('PieChart', () => {
  it('renders a skeleton while loading, not the chart', () => {
    const { container } = render(<PieChart isLoading data={data} />)
    expect(container.querySelector('.pz-skeleton')).toBeInTheDocument()
    expect(container.querySelector('.highcharts-container')).not.toBeInTheDocument()
  })

  it('renders the chart once loaded, with the given test id, and self-registers exporting', () => {
    render(<PieChart data={data} testId="demand-pie" />)
    expect(screen.getByTestId('demand-pie')).toBeInTheDocument()
  })

  it('renders one slice per data point', () => {
    const { container } = render(<PieChart data={data} />)
    expect(container.querySelectorAll('.highcharts-point')).toHaveLength(2)
  })

  it('renders a title when provided', () => {
    const { container } = render(<PieChart data={data} title="Trade Demand" />)
    expect(container.querySelector('.highcharts-title')?.textContent).toBe('Trade Demand')
  })

  it('applies a custom className to the root figure', () => {
    const { container } = render(<PieChart data={data} className="custom-chart" />)
    const figure = container.querySelector('figure')
    expect(figure?.className).toContain('pz-pie-chart')
    expect(figure?.className).toContain('custom-chart')
  })
})
