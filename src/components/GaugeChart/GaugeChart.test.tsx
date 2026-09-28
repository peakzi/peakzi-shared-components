import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GaugeChart } from './GaugeChart'

describe('GaugeChart', () => {
  it('renders the chart with the given test id', () => {
    render(<GaugeChart value={72} maxValue={100} testId="market-share-gauge" />)
    expect(screen.getByTestId('market-share-gauge')).toBeInTheDocument()
  })

  it('renders the value in the data label', () => {
    const { container } = render(<GaugeChart value={72} maxValue={100} />)
    expect(container.textContent).toContain('72')
  })

  it('appends the given unit instead of a hardcoded metric name check', () => {
    const { container } = render(<GaugeChart value={72} maxValue={100} unit="%" />)
    expect(container.textContent).toContain('72')
    expect(container.textContent).toContain('%')
  })

  it('renders no unit when omitted', () => {
    const { container } = render(<GaugeChart value={4.8} maxValue={5} />)
    expect(container.textContent).toContain('4.8')
    expect(container.textContent).not.toContain('%')
  })

  it('applies a custom className to the root figure', () => {
    const { container } = render(<GaugeChart value={1} maxValue={5} className="custom-gauge" />)
    const figure = container.querySelector('figure')
    expect(figure?.className).toContain('pz-gauge-chart')
    expect(figure?.className).toContain('custom-gauge')
  })
})
