import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CopyField } from './CopyField'

describe('CopyField', () => {
  it('displays the value', () => {
    render(<CopyField value="acct_8f2a91" />)
    expect(screen.getByText('acct_8f2a91')).toBeInTheDocument()
  })

  it('applies pz-copy-field class', () => {
    const { container } = render(<CopyField value="abc" />)
    expect(container.querySelector('.pz-copy-field')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<CopyField label="Account ID" value="acct_123" />)
    expect(screen.getByText('Account ID')).toBeInTheDocument()
  })

  it('renders Copy button', () => {
    render(<CopyField value="abc" />)
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })

  it('renders display node instead of raw value', () => {
    render(<CopyField value="acct_123" display={<em>Account</em>} />)
    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.queryByText('acct_123')).not.toBeInTheDocument()
  })

  it('applies mono class by default', () => {
    const { container } = render(<CopyField value="abc" />)
    expect(container.querySelector('.pz-copy-field__value--mono')).toBeInTheDocument()
  })

  it('does not apply mono class when mono=false', () => {
    const { container } = render(<CopyField value="abc" mono={false} />)
    expect(container.querySelector('.pz-copy-field__value--mono')).not.toBeInTheDocument()
  })

  it('calls clipboard writeText on copy click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })

    render(<CopyField value="acct_123" />)
    fireEvent.click(screen.getByRole('button', { name: /copy/i }))
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('acct_123'))
  })

  it('shows "Copied" text after successful copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })

    render(<CopyField value="abc" />)
    fireEvent.click(screen.getByRole('button', { name: /copy/i }))
    await waitFor(() => expect(screen.getByText('Copied')).toBeInTheDocument())
  })

  it('shows failure feedback and calls onCopyError when copying is rejected', async () => {
    const clipboardError = new Error('Clipboard permission denied')
    const onCopyError = vi.fn()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(clipboardError) },
      writable: true,
      configurable: true,
    })

    render(<CopyField value="abc" onCopyError={onCopyError} />)
    fireEvent.click(screen.getByRole('button', { name: /copy/i }))

    await waitFor(() => expect(screen.getByText('Copy failed')).toBeInTheDocument())
    expect(onCopyError).toHaveBeenCalledWith(clipboardError, 'abc')
  })

  it('reports an unavailable clipboard API', async () => {
    const onCopyError = vi.fn()
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true,
    })

    render(<CopyField value="abc" onCopyError={onCopyError} />)
    fireEvent.click(screen.getByRole('button', { name: /copy/i }))

    await waitFor(() => expect(screen.getByText('Copy failed')).toBeInTheDocument())
    expect(onCopyError.mock.calls[0][0].message).toBe('Clipboard API is unavailable')
  })
})
