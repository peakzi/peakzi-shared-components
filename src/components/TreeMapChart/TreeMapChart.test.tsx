import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TreeMapChart } from './TreeMapChart'

const data = [
  { name: 'Plumbing', value: 45 },
  { name: 'Electrical', value: 30 },
  { name: 'HVAC', value: 25 },
]

describe('TreeMapChart', () => {
  it('renders a skeleton while loading, not the chart', () => {
    const { container } = render(<TreeMapChart isLoading data={data} />)
    expect(container.querySelector('.pz-skeleton')).toBeInTheDocument()
    expect(container.querySelector('.highcharts-container')).not.toBeInTheDocument()
  })

  it('renders the chart once loaded, with the given test id', () => {
    render(<TreeMapChart data={data} testId="service-mix" />)
    expect(screen.getByTestId('service-mix')).toBeInTheDocument()
  })

  it('renders one tile per data point', () => {
    const { container } = render(<TreeMapChart data={data} />)
    expect(container.querySelectorAll('.highcharts-point')).toHaveLength(3)
  })

  it('renders a title when provided', () => {
    const { container } = render(<TreeMapChart data={data} title="Service Mix" />)
    expect(container.querySelector('.highcharts-title')?.textContent).toBe('Service Mix')
  })

  it('applies a custom className to the root figure', () => {
    const { container } = render(<TreeMapChart data={data} className="custom-chart" />)
    const figure = container.querySelector('figure')
    expect(figure?.className).toContain('pz-treemap-chart')
    expect(figure?.className).toContain('custom-chart')
  })
})
