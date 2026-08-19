import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { CodeSnippet } from './CodeSnippet'

describe('CodeSnippet', () => {
  it('renders a labelled code block', () => {
    render(<CodeSnippet label="Request body" language="json" code={'{\n  "active": true\n}'} />)

    expect(screen.getByRole('region', { name: 'Request body' })).toBeInTheDocument()
    expect(screen.getByText('json')).toBeInTheDocument()
    expect(screen.getByText(/"active": true/)).toBeInTheDocument()
  })

  it('copies code and shows success feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    const onCopySuccess = vi.fn()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })

    render(<CodeSnippet label="Endpoint" code="POST /accounts" onCopySuccess={onCopySuccess} />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy Endpoint' }))

    await waitFor(() => expect(screen.getByText('Copied')).toBeInTheDocument())
    expect(writeText).toHaveBeenCalledWith('POST /accounts')
    expect(onCopySuccess).toHaveBeenCalledWith('POST /accounts')
  })

  it('shows failure feedback when clipboard access is rejected', async () => {
    const clipboardError = new Error('Clipboard permission denied')
    const onCopyError = vi.fn()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(clipboardError) },
      writable: true,
      configurable: true,
    })

    render(<CodeSnippet code="example" onCopyError={onCopyError} />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy Code snippet' }))

    await waitFor(() => expect(screen.getByText('Copy failed')).toBeInTheDocument())
    expect(onCopyError).toHaveBeenCalledWith(clipboardError, 'example')
  })

  it('supports wrapped code and a non-copyable presentation', () => {
    const { container } = render(<CodeSnippet code="example" wrap copyable={false} />)

    expect(container.querySelector('.pz-code-snippet--wrap')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
