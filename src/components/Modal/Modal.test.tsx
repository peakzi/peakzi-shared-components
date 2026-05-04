import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from './Modal'

function renderModal(props: Partial<Parameters<typeof Modal>[0]> = {}) {
  return render(
    <Modal open={true} onClose={() => {}} title="Test Modal" {...props}>
      Modal content
    </Modal>,
  )
}

describe('Modal', () => {
  it('renders dialog when open', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    renderModal({ open: false })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders title', () => {
    renderModal({ title: 'My Modal' })
    expect(screen.getByText('My Modal')).toBeInTheDocument()
  })

  it('renders description', () => {
    renderModal({ description: 'This is a description' })
    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  it('renders children', () => {
    renderModal()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('renders footer content', () => {
    renderModal({ footer: <button type="button">Confirm</button> })
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is pressed', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.mouseDown(document.body.querySelector('.pz-modal-backdrop')!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('traps Tab focus inside the dialog', () => {
    renderModal({
      footer: (
        <>
          <button type="button">Cancel</button>
          <button type="button">Confirm</button>
        </>
      ),
    })

    const dialog = screen.getByRole('dialog')
    const close = screen.getByRole('button', { name: 'Close dialog' })
    const confirm = screen.getByRole('button', { name: 'Confirm' })

    confirm.focus()
    fireEvent.keyDown(dialog, { key: 'Tab' })
    expect(close).toHaveFocus()

    close.focus()
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true })
    expect(confirm).toHaveFocus()
  })

  it('restores body overflow and previous focus on close', () => {
    document.body.style.overflow = 'clip'
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    opener.focus()

    const { unmount } = renderModal()
    unmount()

    expect(document.body.style.overflow).toBe('clip')
    expect(opener).toHaveFocus()
    opener.remove()
    document.body.style.overflow = ''
  })

  it('sets aria-modal="true"', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('sets aria-labelledby to the title element id', () => {
    renderModal({ title: 'Labeled Modal' })
    const dialog = screen.getByRole('dialog')
    const labelledBy = dialog.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    expect(screen.getByText('Labeled Modal').id).toBe(labelledBy)
  })

  it('uses aria-label when no title is rendered', () => {
    renderModal({ title: undefined, 'aria-label': 'Account settings' })
    expect(screen.getByRole('dialog', { name: 'Account settings' })).toBeInTheDocument()
  })

  it('provides a fallback accessible name when title is omitted', () => {
    renderModal({ title: undefined })
    expect(screen.getByRole('dialog', { name: 'Dialog' })).toBeInTheDocument()
  })

  it('applies pz-modal class', () => {
    renderModal()
    // Modal renders via portal into document.body
    expect(document.body.querySelector('.pz-modal')).toBeInTheDocument()
  })

  it('applies lg size class', () => {
    renderModal({ size: 'lg' })
    expect(document.body.querySelector('.pz-modal--lg')).toBeInTheDocument()
  })

  it('applies xl size class', () => {
    renderModal({ size: 'xl' })
    expect(document.body.querySelector('.pz-modal--xl')).toBeInTheDocument()
  })
})
