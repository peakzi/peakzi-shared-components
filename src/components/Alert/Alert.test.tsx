import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders with role=alert', () => {
    render(<Alert>Message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders title text', () => {
    render(<Alert title="Watch out">Message</Alert>)
    expect(screen.getByText('Watch out')).toBeInTheDocument()
  })

  it('renders children as description', () => {
    render(<Alert>Something happened</Alert>)
    expect(screen.getByText('Something happened')).toBeInTheDocument()
  })

  it('applies pz-alert base class', () => {
    const { container } = render(<Alert>Message</Alert>)
    expect(container.querySelector('.pz-alert')).toBeInTheDocument()
  })

  it('applies info variant by default', () => {
    const { container } = render(<Alert>Message</Alert>)
    expect(container.querySelector('.pz-alert--info')).toBeInTheDocument()
  })

  it('applies success variant class', () => {
    const { container } = render(<Alert variant="success">Message</Alert>)
    expect(container.querySelector('.pz-alert--success')).toBeInTheDocument()
  })

  it('applies warning variant class', () => {
    const { container } = render(<Alert variant="warning">Message</Alert>)
    expect(container.querySelector('.pz-alert--warning')).toBeInTheDocument()
  })

  it('applies danger variant class', () => {
    const { container } = render(<Alert variant="danger">Message</Alert>)
    expect(container.querySelector('.pz-alert--danger')).toBeInTheDocument()
  })

  it('renders icon by default', () => {
    const { container } = render(<Alert>Message</Alert>)
    expect(container.querySelector('.pz-alert__icon')).toBeInTheDocument()
  })

  it('hides icon when hideIcon is true', () => {
    const { container } = render(<Alert hideIcon>Message</Alert>)
    expect(container.querySelector('.pz-alert__icon')).not.toBeInTheDocument()
  })

  it('renders custom icon when provided', () => {
    render(<Alert icon={<span data-testid="custom-icon" />}>Message</Alert>)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('does not render title element when title not provided', () => {
    const { container } = render(<Alert>Message</Alert>)
    expect(container.querySelector('.pz-alert__title')).not.toBeInTheDocument()
  })

  it('does not render desc element when children not provided', () => {
    const { container } = render(<Alert title="Title only" />)
    expect(container.querySelector('.pz-alert__desc')).not.toBeInTheDocument()
  })
})
