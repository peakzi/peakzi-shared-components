import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="No accounts yet" />)
    expect(screen.getByText('No accounts yet')).toBeInTheDocument()
  })

  it('applies pz-empty class', () => {
    const { container } = render(<EmptyState title="Empty" />)
    expect(container.querySelector('.pz-empty')).toBeInTheDocument()
  })

  it('has role="status"', () => {
    render(<EmptyState title="Empty" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<EmptyState title="Empty" icon={<span data-testid="icon" />} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('does not render icon container when icon omitted', () => {
    const { container } = render(<EmptyState title="Empty" />)
    expect(container.querySelector('.pz-empty__icon')).not.toBeInTheDocument()
  })

  it('renders body text when provided', () => {
    render(<EmptyState title="Empty" body="Nothing here yet." />)
    expect(screen.getByText('Nothing here yet.')).toBeInTheDocument()
  })

  it('renders actions slot', () => {
    render(<EmptyState title="Empty" actions={<button>Create</button>} />)
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
  })

  it('does not apply size modifier for md (default)', () => {
    const { container } = render(<EmptyState title="Empty" />)
    expect(container.querySelector('.pz-empty--md')).not.toBeInTheDocument()
  })

  it('applies pz-empty--sm class for sm size', () => {
    const { container } = render(<EmptyState title="Empty" size="sm" />)
    expect(container.querySelector('.pz-empty--sm')).toBeInTheDocument()
  })

  it('applies pz-empty--lg class for lg size', () => {
    const { container } = render(<EmptyState title="Empty" size="lg" />)
    expect(container.querySelector('.pz-empty--lg')).toBeInTheDocument()
  })
})
