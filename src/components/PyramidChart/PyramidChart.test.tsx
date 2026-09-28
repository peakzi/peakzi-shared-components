import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PyramidChart } from './PyramidChart'

const data: Array<[string, number]> = [
  ['1-10', 120],
  ['11-50', 80],
  ['51-200', 40],
  ['200+', 10],
]

describe('PyramidChart', () => {
  it('renders a skeleton while loading, not the chart', () => {
    const { container } = render(<PyramidChart isLoading data={data} />)
    expect(container.querySelector('.pz-skeleton')).toBeInTheDocument()
    expect(container.querySelector('.highcharts-container')).not.toBeInTheDocument()
  })

  it('renders the chart once loaded, with the given test id', () => {
    render(<PyramidChart data={data} testId="pyramid" />)
    expect(screen.getByTestId('pyramid')).toBeInTheDocument()
  })

  it('renders the caller-supplied emptyState when every value is zero, with no built-in fallback', () => {
    const { container } = render(
      <PyramidChart
        data={[
          ['A', 0],
          ['B', 0],
        ]}
        emptyState={<div data-testid="my-empty-state">No data yet</div>}
      />,
    )
    expect(screen.getByTestId('my-empty-state')).toBeInTheDocument()
    expect(container.querySelector('.highcharts-container')).not.toBeInTheDocument()
  })

  it('renders the chart for values that sum to zero but are not all zero', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container } = render(
      <PyramidChart
        data={[
          ['A', 10],
          ['B', -10],
        ]}
        emptyState={<div data-testid="my-empty-state">No data yet</div>}
      />,
    )
    expect(screen.queryByTestId('my-empty-state')).not.toBeInTheDocument()
    expect(container.querySelector('.highcharts-container')).toBeInTheDocument()
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('B=-10'))
    warn.mockRestore()
  })

  it('treats negative and non-finite values as zero, so all-invalid data is empty', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <PyramidChart
        data={[
          ['A', -5],
          ['B', Number.NaN],
        ]}
        emptyState={<div data-testid="my-empty-state">No data yet</div>}
      />,
    )
    expect(screen.getByTestId('my-empty-state')).toBeInTheDocument()
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })

  it('renders the caller-supplied emptyState when data is empty', () => {
    render(<PyramidChart data={[]} emptyState={<span>Nothing here</span>} />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('renders nothing extra when emptyState is omitted and data is all zero', () => {
    const { container } = render(
      <PyramidChart
        data={[
          ['A', 0],
          ['B', 0],
        ]}
      />,
    )
    expect(container.querySelector('.highcharts-container')).not.toBeInTheDocument()
    expect(container.querySelector('figure')?.textContent).toBe('')
  })

  it('applies a custom className to the root figure', () => {
    const { container } = render(<PyramidChart data={data} className="custom-chart" />)
    const figure = container.querySelector('figure')
    expect(figure?.className).toContain('pz-pyramid-chart')
    expect(figure?.className).toContain('custom-chart')
  })
})
