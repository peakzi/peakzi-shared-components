import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusPill } from './StatusPill'

describe('StatusPill', () => {
  it('renders children', () => {
    render(<StatusPill status="active">Active</StatusPill>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies pz-badge base class', () => {
    const { container } = render(<StatusPill status="active">Active</StatusPill>)
    expect(container.querySelector('.pz-badge')).toBeInTheDocument()
  })

  it('applies pz-status-pill class', () => {
    const { container } = render(<StatusPill status="active">Active</StatusPill>)
    expect(container.querySelector('.pz-status-pill')).toBeInTheDocument()
  })

  it('maps active status to success variant', () => {
    const { container } = render(<StatusPill status="active">Active</StatusPill>)
    expect(container.querySelector('.pz-badge--success')).toBeInTheDocument()
  })

  it('maps pending status to warning variant', () => {
    const { container } = render(<StatusPill status="pending">Pending</StatusPill>)
    expect(container.querySelector('.pz-badge--warning')).toBeInTheDocument()
  })

  it('maps error status to danger variant', () => {
    const { container } = render(<StatusPill status="error">Error</StatusPill>)
    expect(container.querySelector('.pz-badge--danger')).toBeInTheDocument()
  })

  it('maps inactive status to neutral variant', () => {
    const { container } = render(<StatusPill status="inactive">Inactive</StatusPill>)
    expect(container.querySelector('.pz-badge--neutral')).toBeInTheDocument()
  })

  it('maps info status to info variant', () => {
    const { container } = render(<StatusPill status="info">Info</StatusPill>)
    expect(container.querySelector('.pz-badge--info')).toBeInTheDocument()
  })

  it('applies dot class by default', () => {
    const { container } = render(<StatusPill status="active">Active</StatusPill>)
    expect(container.querySelector('.pz-badge--dot')).toBeInTheDocument()
  })

  it('does not apply dot class when dot=false', () => {
    const { container } = render(<StatusPill status="active" dot={false}>Active</StatusPill>)
    expect(container.querySelector('.pz-badge--dot')).not.toBeInTheDocument()
  })

  it('applies status-specific class', () => {
    const { container } = render(<StatusPill status="pending">Pending</StatusPill>)
    expect(container.querySelector('.pz-status-pill--pending')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<StatusPill status="active" className="custom">Active</StatusPill>)
    expect(container.querySelector('.pz-status-pill.custom')).toBeInTheDocument()
  })
})
