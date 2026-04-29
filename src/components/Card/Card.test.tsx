import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardTitle, CardBody, Stat } from './Card'

describe('Card', () => {
  it('renders a div with pz-card class', () => {
    const { container } = render(<Card>content</Card>)
    expect(container.querySelector('.pz-card')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Card>Hello card</Card>)
    expect(screen.getByText('Hello card')).toBeInTheDocument()
  })

  it('does not apply variant class for default', () => {
    const { container } = render(<Card>content</Card>)
    const card = container.querySelector('.pz-card')
    expect(card?.className).toBe('pz-card')
  })

  it('applies hoverable variant class', () => {
    const { container } = render(<Card variant="hoverable">content</Card>)
    expect(container.querySelector('.pz-card--hoverable')).toBeInTheDocument()
  })

  it('applies elevated variant class', () => {
    const { container } = render(<Card variant="elevated">content</Card>)
    expect(container.querySelector('.pz-card--elevated')).toBeInTheDocument()
  })

  it('applies inset variant class', () => {
    const { container } = render(<Card variant="inset">content</Card>)
    expect(container.querySelector('.pz-card--inset')).toBeInTheDocument()
  })

  it('applies dark variant class', () => {
    const { container } = render(<Card variant="dark">content</Card>)
    expect(container.querySelector('.pz-card--dark')).toBeInTheDocument()
  })

  it('applies gradient variant class', () => {
    const { container } = render(<Card variant="gradient">content</Card>)
    expect(container.querySelector('.pz-card--gradient')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<Card className="my-card">content</Card>)
    expect(container.querySelector('.pz-card.my-card')).toBeInTheDocument()
  })

  it('passes through HTML attributes', () => {
    const { container } = render(<Card data-testid="my-card">content</Card>)
    expect(container.querySelector('[data-testid="my-card"]')).toBeInTheDocument()
  })
})

describe('CardTitle', () => {
  it('renders an h3 by default', () => {
    render(<CardTitle>My Title</CardTitle>)
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
  })

  it('renders the correct heading level when `as` is provided', () => {
    render(<CardTitle as="h2">My Title</CardTitle>)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('applies pz-card__title class', () => {
    render(<CardTitle>Title</CardTitle>)
    expect(screen.getByRole('heading')).toHaveClass('pz-card__title')
  })
})

describe('CardBody', () => {
  it('renders a paragraph with pz-card__body class', () => {
    const { container } = render(<CardBody>Body text</CardBody>)
    const p = container.querySelector('p.pz-card__body')
    expect(p).toBeInTheDocument()
    expect(p).toHaveTextContent('Body text')
  })
})

describe('Stat', () => {
  it('renders the stat value', () => {
    render(<Stat value="14" />)
    expect(screen.getByText('14')).toBeInTheDocument()
  })

  it('renders eyebrow when provided', () => {
    render(<Stat eyebrow="AI Citations" value="14" />)
    expect(screen.getByText('AI Citations')).toBeInTheDocument()
  })

  it('does not render eyebrow when not provided', () => {
    const { container } = render(<Stat value="14" />)
    expect(container.querySelector('.pz-stat__eyebrow')).not.toBeInTheDocument()
  })

  it('renders delta with up direction', () => {
    render(<Stat value="14" delta="23%" deltaType="up" />)
    const delta = document.querySelector('.pz-stat__delta--up')
    expect(delta).toBeInTheDocument()
    expect(delta).toHaveTextContent('↑')
  })

  it('renders delta with down direction', () => {
    render(<Stat value="14" delta="5%" deltaType="down" />)
    const delta = document.querySelector('.pz-stat__delta--down')
    expect(delta).toBeInTheDocument()
    expect(delta).toHaveTextContent('↓')
  })

  it('does not render delta when not provided', () => {
    const { container } = render(<Stat value="14" />)
    expect(container.querySelector('.pz-stat__delta')).not.toBeInTheDocument()
  })

  it('applies pz-stat class', () => {
    const { container } = render(<Stat value="14" />)
    expect(container.querySelector('.pz-stat')).toBeInTheDocument()
  })
})
