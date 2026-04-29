import { render, screen } from '@testing-library/react'
import { PeakziLogo } from './PeakziLogo'

describe('PeakziLogo', () => {
  it('renders with default alt "Peakzi"', () => {
    render(<PeakziLogo />)
    expect(screen.getByRole('img', { name: 'Peakzi' })).toBeInTheDocument()
  })

  it('renders as <span> by default', () => {
    render(<PeakziLogo />)
    const wrapper = screen.getByRole('img').closest('span')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass('pz-logo')
  })

  it('applies size modifier class', () => {
    render(<PeakziLogo size="lg" />)
    expect(screen.getByRole('img').closest('.pz-logo')).toHaveClass('pz-logo--lg')
  })

  it('applies variant-specific src', () => {
    render(<PeakziLogo variant="white" />)
    const img = screen.getByRole('img', { name: 'Peakzi' })
    expect(img).toHaveAttribute('src')
  })

  it('uses icon alt for icon variants', () => {
    render(<PeakziLogo variant="icon" />)
    expect(screen.getByRole('img', { name: 'Peakzi icon' })).toBeInTheDocument()
  })

  it('uses icon alt for icon-navy variant', () => {
    render(<PeakziLogo variant="icon-navy" />)
    expect(screen.getByRole('img', { name: 'Peakzi icon' })).toBeInTheDocument()
  })

  it('accepts custom alt text', () => {
    render(<PeakziLogo alt="Go to homepage" />)
    expect(screen.getByRole('img', { name: 'Go to homepage' })).toBeInTheDocument()
  })

  it('renders as <a> when href is provided', () => {
    render(<PeakziLogo href="/" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/')
    expect(link).toHaveClass('pz-logo--link')
  })

  it('adds rel="noopener noreferrer" for target="_blank"', () => {
    render(<PeakziLogo href="https://peakzi.com" target="_blank" />)
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('allows custom rel when target is not _blank', () => {
    render(<PeakziLogo href="/" rel="nofollow" />)
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'nofollow')
  })

  it('applies custom className', () => {
    render(<PeakziLogo className="my-logo" />)
    expect(screen.getByRole('img').closest('.pz-logo')).toHaveClass('my-logo')
  })
})
