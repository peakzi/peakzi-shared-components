import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatCard } from './StatCard'

describe('StatCard', () => {
  it('renders value', () => {
    render(<StatCard value="2,418" />)
    expect(screen.getByText('2,418')).toBeInTheDocument()
  })

  it('applies pz-stat-card class', () => {
    const { container } = render(<StatCard value="100" />)
    expect(container.querySelector('.pz-stat-card')).toBeInTheDocument()
  })

  it('renders inside a Card (pz-card)', () => {
    const { container } = render(<StatCard value="100" />)
    expect(container.querySelector('.pz-card')).toBeInTheDocument()
  })

  it('renders eyebrow when provided as string', () => {
    render(<StatCard eyebrow="Active accounts" value="2,418" />)
    expect(screen.getByText('Active accounts')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(<StatCard value="100" footer={<span>Footnote</span>} />)
    expect(screen.getByText('Footnote')).toBeInTheDocument()
  })

  it('footer container has pz-stat-card__footer class', () => {
    const { container } = render(<StatCard value="100" footer={<span>Note</span>} />)
    expect(container.querySelector('.pz-stat-card__footer')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<StatCard value="100" className="custom" />)
    expect(container.querySelector('.pz-stat-card.custom')).toBeInTheDocument()
  })
})
