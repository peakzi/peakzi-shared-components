import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RadialGauge } from './RadialGauge'

describe('RadialGauge', () => {
  it('renders with the given test id', () => {
    render(<RadialGauge value={72} maxValue={100} testId="score-gauge" />)
    expect(screen.getByTestId('score-gauge')).toBeInTheDocument()
  })

  it('renders arbitrary centerContent instead of a hardcoded brand logo', () => {
    render(<RadialGauge value={72} maxValue={100} centerContent={<img src="/anything.png" alt="Custom brand" />} />)
    expect(screen.getByAltText('Custom brand')).toBeInTheDocument()
  })

  it('renders no center overlay when centerContent is omitted', () => {
    const { container } = render(<RadialGauge value={72} maxValue={100} />)
    expect(container.querySelector('.pz-radial-gauge__center')).not.toBeInTheDocument()
  })

  it('sizes the root element to the given size', () => {
    const { container } = render(<RadialGauge value={1} maxValue={5} size={200} />)
    const root = container.querySelector('.pz-radial-gauge') as HTMLElement
    expect(root.style.width).toBe('200px')
    expect(root.style.height).toBe('200px')
  })

  it('applies a custom className', () => {
    const { container } = render(<RadialGauge value={1} maxValue={5} className="brand-meter" />)
    const root = container.querySelector('.pz-radial-gauge')
    expect(root?.className).toContain('brand-meter')
  })
})
