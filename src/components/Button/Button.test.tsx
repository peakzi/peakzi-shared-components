import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

// =============================================================================
// Button — Unit Tests
// =============================================================================
// Covers: rendering, variants, sizes, states, SEO (anchor rendering),
// accessibility attributes, and event handling.
// =============================================================================

describe('Button', () => {
  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  describe('rendering', () => {
    it('renders as a <button> by default', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('renders children correctly', () => {
      render(<Button>Submit form</Button>)
      expect(screen.getByText('Submit form')).toBeInTheDocument()
    })

    it('has type="button" by default to prevent accidental form submission', () => {
      render(<Button>Click</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })

    it('accepts type="submit" override', () => {
      render(<Button type="submit">Submit</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })
  })

  // ---------------------------------------------------------------------------
  // SEO — anchor rendering
  // ---------------------------------------------------------------------------

  describe('SEO / anchor rendering', () => {
    it('renders as <a> when href is provided', () => {
      render(<Button href="/pricing">View pricing</Button>)
      const link = screen.getByRole('link', { name: 'View pricing' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/pricing')
    })

    it('auto-adds rel="noopener noreferrer" for target="_blank"', () => {
      render(
        <Button href="https://peakzi.com" target="_blank">
          Open Peakzi
        </Button>,
      )
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('uses explicit rel when provided', () => {
      render(
        <Button href="/page" rel="nofollow">
          Page
        </Button>,
      )
      expect(screen.getByRole('link')).toHaveAttribute('rel', 'nofollow')
    })
  })

  // ---------------------------------------------------------------------------
  // CSS classes
  // ---------------------------------------------------------------------------

  describe('CSS classes', () => {
    it('applies pz-btn base class', () => {
      render(<Button>Test</Button>)
      expect(screen.getByRole('button')).toHaveClass('pz-btn')
    })

    it('applies variant class', () => {
      render(<Button variant="gradient">CTA</Button>)
      expect(screen.getByRole('button')).toHaveClass('pz-btn--gradient')
    })

    it('applies size class for non-default sizes', () => {
      render(<Button size="lg">Large</Button>)
      expect(screen.getByRole('button')).toHaveClass('pz-btn--lg')
    })

    it('does NOT apply size class for default size (md)', () => {
      render(<Button size="md">Default</Button>)
      expect(screen.getByRole('button')).not.toHaveClass('pz-btn--md')
    })

    it('applies block class', () => {
      render(<Button block>Block</Button>)
      expect(screen.getByRole('button')).toHaveClass('pz-btn--block')
    })

    it('applies loading class', () => {
      render(<Button loading>Loading</Button>)
      expect(screen.getByRole('button')).toHaveClass('pz-btn--loading')
    })

    it('merges custom className', () => {
      render(<Button className="my-override">Test</Button>)
      expect(screen.getByRole('button')).toHaveClass('pz-btn', 'my-override')
    })
  })

  // ---------------------------------------------------------------------------
  // States
  // ---------------------------------------------------------------------------

  describe('disabled state', () => {
    it('sets disabled attribute on <button>', () => {
      render(<Button disabled>Disabled</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('sets aria-disabled on <a> (cannot use disabled attr)', () => {
      render(
        <Button href="/page" disabled>
          Disabled link
        </Button>,
      )
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('aria-disabled', 'true')
    })

    it('prevents click when disabled as <a>', async () => {
      const onClick = vi.fn()
      render(
        <Button href="/page" disabled onClick={onClick}>
          Link
        </Button>,
      )
      await userEvent.click(screen.getByRole('link'))
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('loading state', () => {
    it('disables button when loading', () => {
      render(<Button loading>Saving</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('sets aria-busy when loading', () => {
      render(<Button loading>Saving</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    })

    it('still renders label text alongside spinner', () => {
      render(<Button loading>Saving changes</Button>)
      expect(screen.getByText('Saving changes')).toBeInTheDocument()
    })
  })

  // ---------------------------------------------------------------------------
  // Interactions
  // ---------------------------------------------------------------------------

  describe('interactions', () => {
    it('calls onClick when clicked', async () => {
      const onClick = vi.fn()
      render(<Button onClick={onClick}>Click me</Button>)
      await userEvent.click(screen.getByRole('button'))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('does NOT call onClick when disabled', async () => {
      const onClick = vi.fn()
      render(
        <Button disabled onClick={onClick}>
          Disabled
        </Button>,
      )
      await userEvent.click(screen.getByRole('button'))
      expect(onClick).not.toHaveBeenCalled()
    })

    it('does NOT call onClick when loading', async () => {
      const onClick = vi.fn()
      render(
        <Button loading onClick={onClick}>
          Loading
        </Button>,
      )
      await userEvent.click(screen.getByRole('button'))
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  // ---------------------------------------------------------------------------
  // Accessibility
  // ---------------------------------------------------------------------------

  describe('accessibility', () => {
    it('is accessible via keyboard (Enter key)', async () => {
      const onClick = vi.fn()
      render(<Button onClick={onClick}>Press Enter</Button>)
      screen.getByRole('button').focus()
      await userEvent.keyboard('{Enter}')
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('accepts aria-label for icon-only buttons', () => {
      render(<Button variant="icon" aria-label="Close dialog">×</Button>)
      expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument()
    })
  })
})
