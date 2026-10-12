import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ColumnChart } from './ColumnChart'

afterEach(() => {
  document.documentElement.style.removeProperty('--surface-1')
  document.documentElement.style.removeProperty('--fg-2')
})

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

  it('gives each series without its own color a distinct default color', () => {
    const { container } = render(
      <ColumnChart
        series={[
          { name: 'Human Visits', data: [1, 2, 3] },
          { name: 'Bot Visits', data: [3, 2, 1] },
        ]}
        categories={['Jan', 'Feb', 'Mar']}
        stacked
      />,
    )
    const fills = Array.from(container.querySelectorAll('.highcharts-point')).map((p) => p.getAttribute('fill'))
    expect(new Set(fills).size).toBe(2)
  })

  it('reverts to the default palette when a custom one is removed', () => {
    const { container, rerender } = render(
      <ColumnChart
        series={[
          { name: 'A', data: [1] },
          { name: 'B', data: [1] },
        ]}
        colors={['#111111', '#222222']}
      />,
    )
    expect(Array.from(container.querySelectorAll('.highcharts-point')).map((p) => p.getAttribute('fill'))).toEqual([
      '#111111',
      '#222222',
    ])

    rerender(
      <ColumnChart
        series={[
          { name: 'A', data: [1] },
          { name: 'B', data: [1] },
        ]}
      />,
    )
    expect(Array.from(container.querySelectorAll('.highcharts-point')).map((p) => p.getAttribute('fill'))).not.toContain(
      '#111111',
    )
  })

  it('keeps wrapping correctly when a mounted chart is switched to a shorter palette', () => {
    const threeSeries = [
      { name: 'A', data: [1] },
      { name: 'B', data: [1] },
      { name: 'C', data: [1] },
    ]
    const { container, rerender } = render(<ColumnChart series={threeSeries} />)

    rerender(<ColumnChart series={threeSeries} colors={['#111111', '#222222']} />)
    const fills = Array.from(container.querySelectorAll('.highcharts-point')).map((p) => p.getAttribute('fill'))
    expect(fills).toEqual(['#111111', '#222222', '#111111'])
  })

  it('renders a line chart type without crashing', () => {
    const { container } = render(<ColumnChart type="line" data={[5, 10, 15]} categories={['A', 'B', 'C']} />)
    expect(container.querySelector('.highcharts-container')).toBeInTheDocument()
  })

  it('themes the export menu from design tokens instead of Highcharts defaults', async () => {
    document.documentElement.style.setProperty('--surface-1', 'rgb(10, 20, 30)')
    const { container } = render(<ColumnChart data={[1, 2, 3]} categories={['A', 'B', 'C']} />)
    fireEvent.click(container.querySelector('.highcharts-contextbutton')!)
    await waitFor(() => expect(document.querySelector('.highcharts-menu')).toBeInTheDocument())
    expect((document.querySelector('.highcharts-menu') as HTMLElement).style.background).toBe('rgb(10, 20, 30)')
  })

  it('themes the export button icon from design tokens, with a transparent resting background', () => {
    document.documentElement.style.setProperty('--fg-2', 'rgb(1, 2, 3)')
    const { container } = render(<ColumnChart data={[1, 2, 3]} categories={['A', 'B', 'C']} />)
    const button = container.querySelector('.highcharts-contextbutton')!
    expect(button.querySelector('.highcharts-button-box')).toHaveAttribute('fill', 'transparent')
    expect(button.querySelector('.highcharts-button-symbol')).toHaveAttribute('fill', 'rgb(1, 2, 3)')
  })
})
