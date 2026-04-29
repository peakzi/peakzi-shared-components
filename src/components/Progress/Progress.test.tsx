import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Progress, Ring, Spinner, Skeleton } from './Progress'

// =============================================================================
// Progress
// =============================================================================

describe('Progress', () => {
  it('renders with role=progressbar', () => {
    render(<Progress value={50} label="Test" />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('sets aria-valuenow to clamped value', () => {
    render(<Progress value={75} label="Test" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75')
  })

  it('clamps value to 0-100 range (above)', () => {
    render(<Progress value={150} label="Test" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('clamps value to 0-100 range (below)', () => {
    render(<Progress value={-10} label="Test" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('applies pz-progress base class', () => {
    const { container } = render(<Progress value={50} label="Test" />)
    expect(container.querySelector('.pz-progress')).toBeInTheDocument()
  })

  it('does not apply variant class for default', () => {
    const { container } = render(<Progress value={50} label="Test" />)
    const bar = container.querySelector('.pz-progress')
    expect(bar?.className).toBe('pz-progress')
  })

  it('applies gradient variant class', () => {
    const { container } = render(<Progress value={50} variant="gradient" label="Test" />)
    expect(container.querySelector('.pz-progress--gradient')).toBeInTheDocument()
  })

  it('applies success variant class', () => {
    const { container } = render(<Progress value={50} variant="success" label="Test" />)
    expect(container.querySelector('.pz-progress--success')).toBeInTheDocument()
  })

  it('applies sm size class', () => {
    const { container } = render(<Progress value={50} size="sm" label="Test" />)
    expect(container.querySelector('.pz-progress--sm')).toBeInTheDocument()
  })

  it('applies lg size class', () => {
    const { container } = render(<Progress value={50} size="lg" label="Test" />)
    expect(container.querySelector('.pz-progress--lg')).toBeInTheDocument()
  })

  it('renders bar with correct width style', () => {
    const { container } = render(<Progress value={60} label="Test" />)
    const bar = container.querySelector('.pz-progress__bar') as HTMLElement
    expect(bar.style.width).toBe('60%')
  })
})

// =============================================================================
// Ring
// =============================================================================

describe('Ring', () => {
  it('renders with role=progressbar', () => {
    render(<Ring value={72} aria-label="Score" />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('sets correct aria attributes', () => {
    render(<Ring value={72} aria-label="Score" />)
    const ring = screen.getByRole('progressbar')
    expect(ring).toHaveAttribute('aria-valuenow', '72')
    expect(ring).toHaveAttribute('aria-valuemin', '0')
    expect(ring).toHaveAttribute('aria-valuemax', '100')
  })

  it('renders label text when provided', () => {
    render(<Ring value={72} label="72" aria-label="Score" />)
    expect(screen.getByText('72')).toBeInTheDocument()
  })

  it('applies pz-ring class', () => {
    const { container } = render(<Ring value={50} aria-label="Score" />)
    expect(container.querySelector('.pz-ring')).toBeInTheDocument()
  })
})

// =============================================================================
// Spinner
// =============================================================================

describe('Spinner', () => {
  it('renders with role=status', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has default aria-label of "Loading"', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading')
  })

  it('uses custom label', () => {
    render(<Spinner label="Saving changes" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Saving changes')
  })

  it('applies pz-spinner class', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('.pz-spinner')).toBeInTheDocument()
  })

  it('applies sm size class', () => {
    const { container } = render(<Spinner size="sm" />)
    expect(container.querySelector('.pz-spinner--sm')).toBeInTheDocument()
  })

  it('applies lg size class', () => {
    const { container } = render(<Spinner size="lg" />)
    expect(container.querySelector('.pz-spinner--lg')).toBeInTheDocument()
  })

  it('applies gradient variant class', () => {
    const { container } = render(<Spinner variant="gradient" />)
    expect(container.querySelector('.pz-spinner--gradient')).toBeInTheDocument()
  })
})

// =============================================================================
// Skeleton
// =============================================================================

describe('Skeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies pz-skeleton base class', () => {
    const { container } = render(<Skeleton />)
    expect(container.querySelector('.pz-skeleton')).toBeInTheDocument()
  })

  it('applies text variant class', () => {
    const { container } = render(<Skeleton variant="text" />)
    expect(container.querySelector('.pz-skeleton--text')).toBeInTheDocument()
  })

  it('applies circle variant class', () => {
    const { container } = render(<Skeleton variant="circle" />)
    expect(container.querySelector('.pz-skeleton--circle')).toBeInTheDocument()
  })

  it('does not apply variant class for rect', () => {
    const { container } = render(<Skeleton variant="rect" />)
    const el = container.querySelector('.pz-skeleton')
    expect(el?.className).toBe('pz-skeleton')
  })

  it('applies width style', () => {
    const { container } = render(<Skeleton width={200} />)
    expect((container.firstChild as HTMLElement).style.width).toBe('200px')
  })

  it('applies height style', () => {
    const { container } = render(<Skeleton height={100} />)
    expect((container.firstChild as HTMLElement).style.height).toBe('100px')
  })
})
