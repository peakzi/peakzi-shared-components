import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Banner } from './Banner'

describe('Banner', () => {
  it('renders body text', () => {
    render(<Banner>Scheduled maintenance tonight.</Banner>)
    expect(screen.getByText('Scheduled maintenance tonight.')).toBeTruthy()
  })

  it('renders title when provided', () => {
    render(<Banner title="Heads up">Details here.</Banner>)
    expect(screen.getByText('Heads up')).toBeTruthy()
  })

  it('applies default variant class (info)', () => {
    const { container } = render(<Banner>msg</Banner>)
    expect(container.firstChild).toHaveClass('pz-banner--info')
  })

  it('applies variant class', () => {
    const { container } = render(<Banner variant="danger">msg</Banner>)
    expect(container.firstChild).toHaveClass('pz-banner--danger')
  })

  it('applies size class for sm', () => {
    const { container } = render(<Banner size="sm">msg</Banner>)
    expect(container.firstChild).toHaveClass('pz-banner--sm')
  })

  it('applies size class for lg', () => {
    const { container } = render(<Banner size="lg">msg</Banner>)
    expect(container.firstChild).toHaveClass('pz-banner--lg')
  })

  it('does not apply size class for default md', () => {
    const { container } = render(<Banner size="md">msg</Banner>)
    expect(container.firstChild).not.toHaveClass('pz-banner--md')
  })

  it('applies position class for top', () => {
    const { container } = render(<Banner position="top">msg</Banner>)
    expect(container.firstChild).toHaveClass('pz-banner--top')
  })

  it('applies position class for bottom', () => {
    const { container } = render(<Banner position="bottom">msg</Banner>)
    expect(container.firstChild).toHaveClass('pz-banner--bottom')
  })

  it('does not apply position class for default inline', () => {
    const { container } = render(<Banner position="inline">msg</Banner>)
    expect(container.firstChild).not.toHaveClass('pz-banner--inline')
  })

  it('renders dismiss button when dismissible', () => {
    render(<Banner dismissible>msg</Banner>)
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeTruthy()
  })

  it('does not render dismiss button when not dismissible', () => {
    render(<Banner>msg</Banner>)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('calls onDismiss when close button is clicked', () => {
    const onDismiss = vi.fn()
    render(<Banner dismissible onDismiss={onDismiss}>msg</Banner>)
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('renders action slot', () => {
    render(<Banner action={<button type="button">Undo</button>}>msg</Banner>)
    expect(screen.getByRole('button', { name: 'Undo' })).toBeTruthy()
  })

  it('passes through className and extra props', () => {
    const { container } = render(<Banner className="custom" data-testid="b">msg</Banner>)
    const el = container.firstChild as HTMLElement
    expect(el.classList.contains('custom')).toBe(true)
    expect(el.dataset.testid).toBe('b')
  })

  it('hides icon when icon prop is null', () => {
    const { container } = render(<Banner icon={null}>msg</Banner>)
    expect(container.querySelector('.pz-banner__icon')).toBeNull()
  })
})
