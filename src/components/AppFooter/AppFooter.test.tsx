import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppFooter } from './AppFooter'

describe('AppFooter', () => {
  it('renders as <footer>', () => {
    const { container } = render(<AppFooter />)
    expect(container.querySelector('footer')).toBeInTheDocument()
  })

  it('applies pz-app-footer class', () => {
    const { container } = render(<AppFooter />)
    expect(container.querySelector('.pz-app-footer')).toBeInTheDocument()
  })

  it('prepends © symbol before text', () => {
    render(<AppFooter text="Peakzi Copyright" />)
    expect(screen.getByText(/©/)).toBeInTheDocument()
  })

  it('renders the text', () => {
    render(<AppFooter text="Peakzi Copyright" />)
    expect(screen.getByText(/Peakzi Copyright/)).toBeInTheDocument()
  })

  it('renders the version', () => {
    render(<AppFooter text="Peakzi Copyright" version="v3.14.0" />)
    expect(screen.getByText('v3.14.0')).toBeInTheDocument()
  })

  it('does not render version element when version is omitted', () => {
    const { container } = render(<AppFooter text="Peakzi Copyright" />)
    expect(container.querySelector('.pz-app-footer__version')).not.toBeInTheDocument()
  })

  it('renders nothing when text is omitted', () => {
    const { container } = render(<AppFooter />)
    expect(container.querySelector('.pz-app-footer__content')).not.toBeInTheDocument()
  })

  it('applies center position class by default', () => {
    const { container } = render(<AppFooter text="Peakzi Copyright" />)
    expect(container.querySelector('.pz-app-footer--center')).toBeInTheDocument()
  })

  it('applies left position class', () => {
    const { container } = render(<AppFooter text="Peakzi Copyright" position="left" />)
    expect(container.querySelector('.pz-app-footer--left')).toBeInTheDocument()
  })

  it('applies right position class', () => {
    const { container } = render(<AppFooter text="Peakzi Copyright" position="right" />)
    expect(container.querySelector('.pz-app-footer--right')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<AppFooter className="custom" />)
    expect(container.querySelector('.pz-app-footer.custom')).toBeInTheDocument()
  })

  it('renders version inline by default (no stacked class)', () => {
    const { container } = render(<AppFooter text="Peakzi Copyright" version="v3.14.0" />)
    expect(container.querySelector('.pz-app-footer__content--stacked')).not.toBeInTheDocument()
  })

  it('applies stacked class when versionPlacement is block', () => {
    const { container } = render(
      <AppFooter text="Peakzi Copyright" version="v3.14.0" versionPlacement="block" />
    )
    expect(container.querySelector('.pz-app-footer__content--stacked')).toBeInTheDocument()
  })

  it('does not apply stacked class when versionPlacement is inline', () => {
    const { container } = render(
      <AppFooter text="Peakzi Copyright" version="v3.14.0" versionPlacement="inline" />
    )
    expect(container.querySelector('.pz-app-footer__content--stacked')).not.toBeInTheDocument()
  })
})
