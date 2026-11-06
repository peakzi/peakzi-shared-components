import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BusinessSiteContactForm } from './BusinessSiteContactForm'

const consentText = 'I agree to calls and texts from Example Plumbing about my request.'
const initialValues = { fullName: 'Alex Homeowner', phone: '5125550123', address: 'Behind the barn, red gate' }
const send = () => screen.getByRole('button', { name: 'Send request' })

describe('contact form submit eligibility and persistent validation', () => {
  it('requires every mandatory field, consent and a valid optional email before enabling submit', () => {
    render(<BusinessSiteContactForm consentText={consentText} onSubmit={() => {}} />)
    expect(send()).toBeDisabled()
    for (const [label, value] of [[/Full name/, 'Alex Homeowner'], [/Phone number/, '5125550123'], [/Service address/, 'Main Street']] as const) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } })
      expect(send()).toBeDisabled()
    }
    fireEvent.click(screen.getByRole('checkbox'))
    expect(send()).toBeEnabled()
    fireEvent.change(screen.getByLabelText(/Email address/), { target: { value: 'wrong-email' } })
    expect(send()).toBeDisabled()
    fireEvent.change(screen.getByLabelText(/Email address/), { target: { value: '' } })
    expect(send()).toBeEnabled()
    fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: '   ' } })
    expect(send()).toBeDisabled()
  })

  it('keeps submit disabled during debounce and backend validation, then reuses the passed result', async () => {
    let complete!: (message: void | string) => void
    const validate = vi.fn(() => new Promise<void | string>((resolve) => { complete = resolve }))
    const onSubmit = vi.fn()
    render(<BusinessSiteContactForm consentText={consentText} initialValues={initialValues} onSubmit={onSubmit} phoneValidation={{ validate }} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(send()).toBeDisabled()
    await waitFor(() => expect(validate).toHaveBeenCalledOnce())
    expect(send()).toBeDisabled()
    expect(screen.getByLabelText(/Phone number/)).toHaveAttribute('aria-busy', 'true')
    await act(async () => complete(undefined))
    expect(send()).toBeEnabled()
    fireEvent.click(send())
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
    expect(validate).toHaveBeenCalledOnce()
  })

  it('keeps backend-invalid phones disabled and styled after blur until a corrected number passes', async () => {
    const validate = vi.fn().mockResolvedValueOnce('Please enter a valid phone number.').mockResolvedValue(undefined)
    render(<BusinessSiteContactForm consentText={consentText} initialValues={initialValues} onSubmit={() => {}} phoneValidation={{ validate }} />)
    fireEvent.click(screen.getByRole('checkbox'))
    const phone = screen.getByLabelText(/Phone number/)
    await waitFor(() => expect(phone).toHaveAccessibleDescription('Please enter a valid phone number.'))
    fireEvent.blur(phone)
    expect(phone).toHaveAttribute('aria-invalid', 'true')
    expect(send()).toBeDisabled()
    fireEvent.change(phone, { target: { value: '5125550199' } })
    expect(send()).toBeDisabled()
    await waitFor(() => expect(send()).toBeEnabled())
    expect(phone).not.toHaveAttribute('aria-invalid')
    expect(validate).toHaveBeenCalledTimes(2)
  })

  it('can retry an unavailable live phone check on blur without submitting or retyping', async () => {
    const validate = vi.fn().mockRejectedValueOnce(new Error('Offline')).mockResolvedValue(undefined)
    const onSubmit = vi.fn()
    render(<BusinessSiteContactForm consentText={consentText} initialValues={initialValues} onSubmit={onSubmit} phoneValidation={{ validate }} />)
    fireEvent.click(screen.getByRole('checkbox'))
    const phone = screen.getByLabelText(/Phone number/)
    await waitFor(() => expect(phone).toHaveAccessibleDescription('We couldn’t check your phone number. Please try again.'))
    expect(send()).toBeDisabled()
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.blur(phone)
    await waitFor(() => expect(send()).toBeEnabled())
    expect(phone).not.toHaveAttribute('aria-invalid')
    expect(validate).toHaveBeenCalledTimes(2)
  })

  it.each([
    [/Full name/, '123', '456', 'Alex Homeowner', 'Please enter your full name.'],
    [/Phone number/, '123', '456', '5125550123', 'Please enter a valid phone number.'],
    [/Email address/, 'not-an-email', 'still-invalid', 'alex@example.com', 'Please check this email address.'],
    [/Service address/, '', '  ', 'Main Street', 'Please enter your service address.'],
  ] as const)('retains errors after leaving and editing an invalid %s field', (label, invalid, stillInvalid, valid, message) => {
    render(<BusinessSiteContactForm consentText={consentText} onSubmit={() => {}} />)
    const input = screen.getByLabelText(label)
    fireEvent.change(input, { target: { value: invalid } })
    fireEvent.blur(input)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription(message)
    fireEvent.change(input, { target: { value: stillInvalid } })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    fireEvent.blur(input)
    expect(input).toHaveAccessibleDescription(message)
    fireEvent.change(input, { target: { value: valid } })
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('keeps an unchecked consent error visible on blur and clears it when accepted', () => {
    render(<BusinessSiteContactForm consentText={consentText} onSubmit={() => {}} initialValues={initialValues} />)
    const checkbox = screen.getByRole('checkbox')
    fireEvent.blur(checkbox)
    expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    expect(send()).toBeDisabled()
    fireEvent.click(checkbox)
    expect(checkbox).toHaveAttribute('aria-invalid', 'false')
    expect(send()).toBeEnabled()
  })
})
