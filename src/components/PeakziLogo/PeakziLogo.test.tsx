import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PeakziLogo } from './PeakziLogo'
import type { LogoVariant, LogoSize } from './PeakziLogo'

describe('PeakziLogo', () => {
  const variants: LogoVariant[] = ['color', 'white', 'icon', 'icon-navy']

  it.each(variants)('variant "%s" renders a non-empty src', (variant) => {
    render(<PeakziLogo variant={variant} />)
    const src = screen.getByRole('img').getAttribute('src')
    expect(src).toBeTruthy()
  })

  it('all variants produce distinct src values', () => {
    const srcs = variants.map((variant) => {
      const { unmount } = render(<PeakziLogo variant={variant} />)
      const src = screen.getByRole('img').getAttribute('src')
      unmount()
      return src
    })
    // If any two variants shared the same src the Set would be smaller
    expect(new Set(srcs).size).toBe(variants.length)
  })

  // ---------------------------------------------------------------------------
  // Alt text
  // ---------------------------------------------------------------------------
  describe('alt text', () => {
    it('defaults to "Peakzi" for color variant', () => {
      render(<PeakziLogo />)
      expect(screen.getByRole('img', { name: 'Peakzi' })).toBeInTheDocument()
    })

    it('defaults to "Peakzi" for white variant', () => {
      render(<PeakziLogo variant="white" />)
      expect(screen.getByRole('img', { name: 'Peakzi' })).toBeInTheDocument()
    })

    it('defaults to "Peakzi icon" for icon variant', () => {
      render(<PeakziLogo variant="icon" />)
      expect(screen.getByRole('img', { name: 'Peakzi icon' })).toBeInTheDocument()
    })

    it('defaults to "Peakzi icon" for icon-navy variant', () => {
      render(<PeakziLogo variant="icon-navy" />)
      expect(screen.getByRole('img', { name: 'Peakzi icon' })).toBeInTheDocument()
    })

    it('accepts a custom alt', () => {
      render(<PeakziLogo alt="Go to homepage" />)
      expect(screen.getByRole('img', { name: 'Go to homepage' })).toBeInTheDocument()
    })
  })

  // ---------------------------------------------------------------------------
  // Wrapper element
  // ---------------------------------------------------------------------------
  describe('wrapper element', () => {
    it('renders as <span> when no href', () => {
      render(<PeakziLogo />)
      const wrapper = screen.getByRole('img').closest('span')
      expect(wrapper).toBeInTheDocument()
      expect(wrapper).toHaveClass('pz-logo')
      expect(wrapper).not.toHaveClass('pz-logo--link')
    })

    it('renders as <a> when href is provided', () => {
      render(<PeakziLogo href="/" />)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/')
      expect(link).toHaveClass('pz-logo', 'pz-logo--link')
    })
  })

  // ---------------------------------------------------------------------------
  // Size modifier class
  // ---------------------------------------------------------------------------
  describe('size class', () => {
    const sizes: LogoSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

    it.each(sizes)('size "%s" applies pz-logo--%s class', (size) => {
      render(<PeakziLogo size={size} />)
      expect(screen.getByRole('img').closest('.pz-logo')).toHaveClass(`pz-logo--${size}`)
    })
  })

  // ---------------------------------------------------------------------------
  // rel / target
  // ---------------------------------------------------------------------------
  describe('rel attribute', () => {
    it('adds rel="noopener noreferrer" automatically when target="_blank"', () => {
      render(<PeakziLogo href="https://peakzi.com" target="_blank" />)
      expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('respects a custom rel when target is not _blank', () => {
      render(<PeakziLogo href="/" rel="nofollow" />)
      expect(screen.getByRole('link')).toHaveAttribute('rel', 'nofollow')
    })

    it('does not set rel when href is provided without target or rel', () => {
      render(<PeakziLogo href="/" />)
      expect(screen.getByRole('link')).not.toHaveAttribute('rel')
    })
  })

  // ---------------------------------------------------------------------------
  // img element attributes
  // ---------------------------------------------------------------------------
  describe('img element', () => {
    it('is not draggable', () => {
      render(<PeakziLogo />)
      expect(screen.getByRole('img')).toHaveAttribute('draggable', 'false')
    })

    it('always has the pz-logo__img class', () => {
      render(<PeakziLogo />)
      expect(screen.getByRole('img')).toHaveClass('pz-logo__img')
    })
  })

  // ---------------------------------------------------------------------------
  // Custom className
  // ---------------------------------------------------------------------------
  it('forwards className to the wrapper', () => {
    render(<PeakziLogo className="my-logo" />)
    expect(screen.getByRole('img').closest('.pz-logo')).toHaveClass('my-logo')
  })
})
