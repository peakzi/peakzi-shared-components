import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { BusinessSiteContactDialog, type BusinessSiteContactDialogProps } from './BusinessSiteContactDialog'

const consentText = 'I agree to contact from Example Home Services about my request.'

describe('BusinessSiteContactDialog', () => {
  it('inherits tenant colors and radius through the portal, traps focus and restores the opener on close', () => {
    function Example() {
      const [open, setOpen] = useState(false)
      return <><button onClick={() => setOpen(true)}>Book Service</button>
        <BusinessSiteContactDialog open={open} onClose={() => setOpen(false)} title="Book Service" consentText={consentText}
          onSubmit={() => {}} appearance={{ backgroundColor: '#ffffff', textColor: '#01173c', accentColor: '#efbf57', buttonRadius: '32px' }} />
      </>
    }
    const { container } = render(<Example />)
    const opener = screen.getByRole('button', { name: 'Book Service' })
    opener.focus()
    fireEvent.click(opener)
    const dialog = screen.getByRole('dialog', { name: 'Book Service' })
    expect(container).not.toContainElement(dialog)
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog.style.getPropertyValue('--pz-contact-form-accent')).toBe('#efbf57')
    expect(dialog.style.getPropertyValue('--pz-contact-form-radius')).toBe('32px')
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    const submit = screen.getByRole('button', { name: 'Send request' })
    submit.focus()
    fireEvent.keyDown(dialog, { key: 'Tab' })
    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('cancels a pending submission when closed and starts a fresh draft on reopen', async () => {
    let signal: AbortSignal | undefined
    let finish!: () => void
    const onSubmit = vi.fn<BusinessSiteContactDialogProps['onSubmit']>((_values, context) => {
      signal = context.signal
      return new Promise<void>((resolve) => { finish = resolve })
    })
    const props = { onClose: () => {}, title: 'Book Service', consentText, onSubmit }
    const { rerender } = render(<BusinessSiteContactDialog {...props} open />)
    fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: 'Jordan Smith' } })
    fireEvent.change(screen.getByLabelText(/Phone number/), { target: { value: '+1 512 555 0123' } })
    fireEvent.change(screen.getByLabelText(/Service address/), { target: { value: '123 Test Street' } })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.submit(screen.getByRole('form'))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(signal?.aborted).toBe(false)
    rerender(<BusinessSiteContactDialog {...props} open={false} />)
    expect(signal?.aborted).toBe(true)
    await act(async () => finish())
    rerender(<BusinessSiteContactDialog {...props} open />)
    expect(screen.getByLabelText(/Full name/)).toHaveValue('')
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })
})
