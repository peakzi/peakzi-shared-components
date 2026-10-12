import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { TreeMapChart } from './TreeMapChart'

const data = [
  { name: 'Plumbing', value: 45 },
  { name: 'Electrical', value: 30 },
  { name: 'HVAC', value: 25 },
]

afterEach(() => document.documentElement.style.removeProperty('--surface-1'))

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

  it('renders the export menu button that carries the fullscreen toggle', () => {
    const { container } = render(<TreeMapChart data={data} />)
    expect(container.querySelector('.highcharts-contextbutton')).toBeInTheDocument()
  })

  it('applies a custom className to the root figure', () => {
    const { container } = render(<TreeMapChart data={data} className="custom-chart" />)
    const figure = container.querySelector('figure')
    expect(figure?.className).toContain('pz-treemap-chart')
    expect(figure?.className).toContain('custom-chart')
  })

  it('cycles distinct colors across nodes that do not set their own', () => {
    const { container } = render(<TreeMapChart data={data} />)
    const fills = Array.from(container.querySelectorAll('.highcharts-point')).map((p) => p.getAttribute('fill'))
    expect(new Set(fills).size).toBe(3)
  })

  it('reverts to the default palette when a custom one is removed', () => {
    const { container, rerender } = render(<TreeMapChart data={data} colors={['#111111', '#222222', '#333333']} />)
    expect(Array.from(container.querySelectorAll('.highcharts-point')).map((p) => p.getAttribute('fill'))).toEqual([
      '#111111',
      '#222222',
      '#333333',
    ])

    rerender(<TreeMapChart data={data} />)
    const fills = Array.from(container.querySelectorAll('.highcharts-point')).map((p) => p.getAttribute('fill'))
    expect(fills).not.toContain('#111111')
  })

  it('themes the export menu from design tokens instead of Highcharts defaults', async () => {
    document.documentElement.style.setProperty('--surface-1', 'rgb(10, 20, 30)')
    const { container } = render(<TreeMapChart data={data} />)
    fireEvent.click(container.querySelector('.highcharts-contextbutton')!)
    await waitFor(() => expect(document.querySelector('.highcharts-menu')).toBeInTheDocument())
    expect((document.querySelector('.highcharts-menu') as HTMLElement).style.background).toBe('rgb(10, 20, 30)')
  })
})
