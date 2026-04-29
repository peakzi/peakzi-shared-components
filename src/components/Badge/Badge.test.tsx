import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Badge, Chip } from './Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies pz-badge base class', () => {
    const { container } = render(<Badge>Active</Badge>)
    expect(container.querySelector('.pz-badge')).toBeInTheDocument()
  })

  it('applies neutral variant by default', () => {
    const { container } = render(<Badge>Active</Badge>)
    expect(container.querySelector('.pz-badge--neutral')).toBeInTheDocument()
  })

  it('applies provided variant class', () => {
    const { container } = render(<Badge variant="success">Active</Badge>)
    expect(container.querySelector('.pz-badge--success')).toBeInTheDocument()
  })

  it('applies gradient variant class', () => {
    const { container } = render(<Badge variant="gradient">Pro</Badge>)
    expect(container.querySelector('.pz-badge--gradient')).toBeInTheDocument()
  })

  it('applies lg size class', () => {
    const { container } = render(<Badge size="lg">Active</Badge>)
    expect(container.querySelector('.pz-badge--lg')).toBeInTheDocument()
  })

  it('applies sm size class when size="sm" is passed', () => {
    const { container } = render(<Badge size="sm">Active</Badge>)
    expect(container.querySelector('.pz-badge--sm')).toBeInTheDocument()
  })

  it('applies dot class when dot prop set', () => {
    const { container } = render(<Badge dot>Active</Badge>)
    expect(container.querySelector('.pz-badge--dot')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<Badge className="custom">Active</Badge>)
    expect(container.querySelector('.pz-badge.custom')).toBeInTheDocument()
  })

  it('passes through HTML attributes', () => {
    render(<Badge data-testid="my-badge">Active</Badge>)
    expect(screen.getByTestId('my-badge')).toBeInTheDocument()
  })
})

describe('Chip', () => {
  it('renders children', () => {
    render(<Chip>HVAC</Chip>)
    expect(screen.getByText('HVAC')).toBeInTheDocument()
  })

  it('applies pz-chip class', () => {
    const { container } = render(<Chip>HVAC</Chip>)
    expect(container.querySelector('.pz-chip')).toBeInTheDocument()
  })

  it('does not render close button when onClose is not provided', () => {
    render(<Chip>HVAC</Chip>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders close button when onClose is provided', () => {
    render(<Chip onClose={() => {}}>HVAC</Chip>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<Chip onClose={onClose}>HVAC</Chip>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('uses default closeLabel of "Remove"', () => {
    render(<Chip onClose={() => {}}>HVAC</Chip>)
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
  })

  it('uses custom closeLabel when provided', () => {
    render(<Chip onClose={() => {}} closeLabel="Remove HVAC">HVAC</Chip>)
    expect(screen.getByRole('button', { name: 'Remove HVAC' })).toBeInTheDocument()
  })
})
