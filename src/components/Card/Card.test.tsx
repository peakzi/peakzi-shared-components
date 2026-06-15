import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardTitle, CardBody, CardFooter, Stat } from './Card'

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

describe('CardTitle — titleIcon', () => {
  it('renders the icon when titleIcon is provided', () => {
    const { container } = render(<CardTitle titleIcon={<svg data-testid="icon" />}>Title</CardTitle>)
    expect(container.querySelector('.pz-card__title-icon')).toBeInTheDocument()
  })

  it('renders the icon alongside a multiline title', () => {
    const { container } = render(
      <CardTitle titleIcon={<svg data-testid="icon" />}>
        Licensed experts in your area with a very long title that wraps
      </CardTitle>,
    )
    expect(container.querySelector('.pz-card__title-icon')).toBeInTheDocument()
    expect(container.querySelector('.pz-card__title-text')).toBeInTheDocument()
  })

  it('does not render the icon wrapper when titleIcon is omitted', () => {
    const { container } = render(<CardTitle>Title</CardTitle>)
    expect(container.querySelector('.pz-card__title-icon')).not.toBeInTheDocument()
  })

  it('always wraps children in pz-card__title-text', () => {
    render(<CardTitle>My Title</CardTitle>)
    expect(screen.getByText('My Title').closest('.pz-card__title-text')).toBeInTheDocument()
  })
})

describe('CardTitle — actionButton', () => {
  it('renders the action when actionButton is provided', () => {
    render(<CardTitle actionButton={<a href="/all">View all</a>}>Title</CardTitle>)
    expect(screen.getByRole('link', { name: 'View all' })).toBeInTheDocument()
  })

  it('wraps the action in pz-card__title-action', () => {
    const { container } = render(
      <CardTitle actionButton={<button>Go</button>}>Title</CardTitle>,
    )
    expect(container.querySelector('.pz-card__title-action')).toBeInTheDocument()
  })

  it('does not render the action wrapper when actionButton is omitted', () => {
    const { container } = render(<CardTitle>Title</CardTitle>)
    expect(container.querySelector('.pz-card__title-action')).not.toBeInTheDocument()
  })

  it('applies center modifier when centerAlign is true', () => {
    const { container } = render(<CardTitle centerAlign>Title</CardTitle>)
    expect(container.querySelector('.pz-card__title--center')).toBeInTheDocument()
  })

  it('does not apply center modifier by default', () => {
    const { container } = render(<CardTitle>Title</CardTitle>)
    expect(container.querySelector('.pz-card__title--center')).not.toBeInTheDocument()
  })

  it('renders both icon and action together', () => {
    const { container } = render(
      <CardTitle titleIcon={<svg data-testid="icon" />} actionButton={<button>Go</button>}>Title</CardTitle>,
    )
    expect(container.querySelector('.pz-card__title-icon')).toBeInTheDocument()
    expect(container.querySelector('.pz-card__title-action')).toBeInTheDocument()
  })
})

describe('CardBody', () => {
  it('renders a div with pz-card__body class', () => {
    const { container } = render(<CardBody>Body text</CardBody>)
    const div = container.querySelector('div.pz-card__body')
    expect(div).toBeInTheDocument()
    expect(div).toHaveTextContent('Body text')
  })
})

describe('CardFooter', () => {
  it('renders a div with pz-card__footer class', () => {
    const { container } = render(<CardFooter>Footer content</CardFooter>)
    expect(container.querySelector('div.pz-card__footer')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<CardFooter>Footer content</CardFooter>)
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<CardFooter className="extra">Footer</CardFooter>)
    expect(container.querySelector('.pz-card__footer.extra')).toBeInTheDocument()
  })

  it('passes through HTML attributes', () => {
    const { container } = render(<CardFooter data-testid="my-footer">Footer</CardFooter>)
    expect(container.querySelector('[data-testid="my-footer"]')).toBeInTheDocument()
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
