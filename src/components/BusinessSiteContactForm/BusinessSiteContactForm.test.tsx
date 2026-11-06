import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { BusinessSiteContactForm } from './BusinessSiteContactForm'
import { BusinessSiteHero } from '../BusinessSiteHero'
import type { BusinessSiteContactFormPhoneValidation, BusinessSiteContactFormProps, BusinessSiteContactFormResult } from './helpers/types'

const disclosure = 'I agree to calls and texts from Example Home Services about my service request.'
const requiredValues = { fullName: 'Jordan Smith', phone: '+44 20 7946 0123', address: '123 Example Street, Dallas, TX 75001' }
function submit(form = screen.getByRole('form')) {
  const checkbox = within(form).getByRole('checkbox') as HTMLInputElement
  if (!checkbox.checked) fireEvent.click(checkbox)
  fireEvent.submit(form)
}
function fillRequired() {
  fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: requiredValues.fullName } })
  fireEvent.change(screen.getByLabelText(/Phone number/), { target: { value: requiredValues.phone } })
  fireEvent.change(screen.getByLabelText(/Service address/), { target: { value: requiredValues.address } })
}
function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => { resolve = done })
  return { promise, resolve }
}

describe('BusinessSiteContactForm', () => {
  it.each(['compact', 'comfortable'] as const)('uses asterisks instead of optional label annotations in %s mode', (density) => {
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} appearance={{ density }} />)
    expect(screen.queryByText(/\(optional\)/)).not.toBeInTheDocument()
    expect(screen.getByLabelText(/Full name/)).toBeRequired()
    expect(screen.getByLabelText(/Phone number/)).toBeRequired()
    expect(screen.getByLabelText(/Service address/)).toBeRequired()
  })

  it('omits email and its prefilled value from compact submissions', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} appearance={{ density: 'compact' }}
      initialValues={{ ...requiredValues, email: 'hidden@example.com' }} />)
    expect(screen.queryByLabelText('Email address')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Request service' })).toBeVisible()
    expect(screen.getByLabelText('How can we help?')).toHaveAttribute('rows', '2')
    submit()
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0]![0].email).toBe('')
  })

  it('surfaces any backend error for a hidden compact field in the form feedback', async () => {
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={async () => ({ success: false, fieldErrors: { email: 'Please contact our team to confirm your details.' } })}
      appearance={{ density: 'compact' }} initialValues={requiredValues} />)
    submit()
    await waitFor(() => expect(screen.getByText(/Please contact our team to confirm your details/)).toBeVisible())
  })

  it.each(['fullName', 'phone', 'email', 'address', 'description'] as const)('renders and associates backend validation feedback for %s', async (field) => {
    render(<BusinessSiteContactForm consentText={disclosure} initialValues={requiredValues}
      onSubmit={async () => ({ success: false, fieldErrors: { [field]: 'Please check this detail.' } })} />)
    submit()
    const form = screen.getByRole('form') as HTMLFormElement
    await waitFor(() => expect(form.elements.namedItem(field)).toHaveAttribute('aria-invalid', 'true'))
    expect(form.elements.namedItem(field)).toHaveAccessibleDescription('Please check this detail.')
    await waitFor(() => expect(form.elements.namedItem(field)).toHaveFocus())
  })

  it('requires explicit, initially unchecked consent before any backend validation or submission', () => {
    const onSubmit = vi.fn(), validatePhone = vi.fn()
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} phoneValidation={{ validate: validatePhone }} initialValues={requiredValues} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    expect(checkbox).toBeRequired()
    expect(checkbox).toHaveAccessibleDescription(disclosure)
    fireEvent.submit(screen.getByRole('form'))
    expect(validatePhone).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(checkbox).toHaveFocus()
    expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    expect(checkbox).toHaveAccessibleDescription(`${disclosure} Please agree to the contact terms before sending your request.`)
  })

  it.each(['compact', 'comfortable'] as const)('replaces the %s form introduction with confirmation and restores it for another request', async (density) => {
    render(<BusinessSiteContactForm consentText={disclosure} title="Book Service" description="Tell us about the work you need."
      successTitle="Request received" onSubmit={() => {}} initialValues={requiredValues} appearance={{ density }} />)
    submit()
    expect(await screen.findByRole('heading', { name: 'Request received' })).toBeVisible()
    expect(screen.getByRole('region', { name: 'Request received' })).toBeVisible()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Book Service' })).not.toBeInTheDocument()
    expect(screen.queryByText('Tell us about the work you need.')).not.toBeInTheDocument()
    expect(screen.queryByText(/Fields marked/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Send another request' }))
    expect(screen.getByRole('heading', { name: 'Book Service' })).toBeVisible()
    expect(screen.getByText('Tell us about the work you need.')).toBeVisible()
    if (density === 'comfortable') expect(screen.getByText(/Fields marked/)).toBeVisible()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('keeps confirmation labelled when its title is intentionally empty', async () => {
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} initialValues={requiredValues} successTitle="" />)
    submit()
    expect(await screen.findByRole('region', { name: 'Service request confirmation' })).toHaveTextContent('Your request has been sent.')
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('requires fresh acknowledgement when the consumer changes the disclosure', () => {
    const onSubmit = vi.fn()
    const { rerender } = render(<BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} initialValues={requiredValues} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).toBeChecked()
    rerender(<BusinessSiteContactForm consentText="Updated contact terms for Example Home Services." onSubmit={onSubmit} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    fireEvent.submit(screen.getByRole('form'))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('renders an optional safe privacy link in the form footer and omits it when unavailable', () => {
    const { rerender, container } = render(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}}
      privacyPolicy={{ href: '/privacy-policy', newTab: true }} />)
    const link = screen.getByRole('link', { name: 'Privacy policy' })
    expect(link).toHaveAttribute('href', '/privacy-policy')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(container.querySelector('.pz-business-contact-form__footer')).toContainElement(link)
    rerender(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it.each(['javascript:alert(1)', '//untrusted.example/policy', 'mailto:example@example.com', ''])('does not render an unsafe or invalid privacy policy URL: %s', (href) => {
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} privacyPolicy={{ href }} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders a server-readable, labelled form with only name, phone and address required', () => {
    const html = renderToStaticMarkup(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} />)
    expect(html).toContain('Tell us how we can help')
    const { container } = render(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} />)
    const ids = [...container.querySelectorAll('[id]')].map((element) => element.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(screen.getByRole('form', { name: 'Tell us how we can help' })).toBeVisible()
    for (const label of [/Full name/, /Phone number/, /Service address/]) expect(screen.getByLabelText(label)).toBeRequired()
    for (const label of [/Email address/, /How can we help/]) expect(screen.getByLabelText(label)).not.toBeRequired()
    expect(screen.getByLabelText(/Phone number/)).toHaveAttribute('autocomplete', 'tel')
    expect(screen.getByLabelText(/Service address/)).toHaveAttribute('autocomplete', 'street-address')
  })

  it('blocks empty and whitespace-only required fields before backend validation and focuses the first error', () => {
    const onSubmit = vi.fn(), validatePhone = vi.fn()
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} phoneValidation={{ validate: validatePhone }} initialValues={{ fullName: '  ', phone: '  ' }} />)
    submit()
    expect(validatePhone).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByLabelText(/Full name/)).toHaveFocus()
    expect(screen.getByLabelText(/Phone number/)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/Phone number/)).toHaveAccessibleDescription('Please enter your phone number.')
  })

  it('shows each missing mandatory field and consent as its own error, without a form-level message', () => {
    const { container } = render(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} />)
    fireEvent.submit(screen.getByRole('form'))
    expect(screen.getByLabelText(/Full name/)).toHaveAccessibleDescription('Please enter your full name.')
    expect(screen.getByLabelText(/Phone number/)).toHaveAccessibleDescription('Please enter your phone number.')
    expect(screen.getByLabelText(/Service address/)).toHaveAccessibleDescription('Please enter your service address.')
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
    for (const label of [/Email address/, /How can we help/]) expect(screen.getByLabelText(label)).not.toHaveAttribute('aria-invalid')
    expect(container.querySelector('.pz-business-contact-form__feedback')).toBeNull()
  })

  it('submits trimmed values with empty optional fields and accepts international phone formats for backend validation', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} initialValues={{ fullName: ' Jordan Smith ', phone: ' +44 20 7946 0123 ', address: ' 123 Example Street, Dallas, TX 75001 ' }} />)
    submit()
    await waitFor(() => expect(screen.getByText('Your request has been sent. Our team will be in touch.')).toBeVisible())
    expect(onSubmit).toHaveBeenCalledWith({ ...requiredValues, email: '', description: '', consent: true }, { signal: expect.any(AbortSignal), consentText: disclosure })
  })

  it('checks the phone with the backend before submitting and shows its error on the field', async () => {
    const onSubmit = vi.fn()
    const validatePhone = vi.fn<BusinessSiteContactFormPhoneValidation['validate']>(async () => 'We couldn’t verify this phone number.')
    const { container } = render(<BusinessSiteContactForm consentText={disclosure} initialValues={requiredValues} onSubmit={onSubmit}
      phoneValidation={{ validate: validatePhone }} />)
    submit()
    const input = screen.getByLabelText(/Phone number/)
    await waitFor(() => expect(input).toHaveAccessibleDescription('We couldn’t verify this phone number.'))
    await waitFor(() => expect(input).toHaveFocus())
    expect(validatePhone).toHaveBeenCalledWith(requiredValues.phone, { signal: expect.any(AbortSignal) })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(container.querySelector('.pz-business-contact-form__feedback')).toBeNull()
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.change(input, { target: { value: '+44 20 7946 0999' } })
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('awaits backend validation, locks all controls, and prevents duplicate validation/submission', async () => {
    const validation = deferred<void | string>()
    const submission = deferred<void | BusinessSiteContactFormResult>()
    const validatePhone = vi.fn(() => validation.promise), onSubmit = vi.fn(() => submission.promise)
    render(<BusinessSiteContactForm consentText={disclosure} initialValues={requiredValues} onSubmit={onSubmit} phoneValidation={{ validate: validatePhone }} />)
    const form = screen.getByRole('form')
    submit(form)
    submit(form)
    expect(validatePhone).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByLabelText(/Full name/)).toBeDisabled()
    expect(screen.getByRole('button', { name: /Checking details/ })).toBeDisabled()
    await act(async () => validation.resolve(undefined))
    expect(onSubmit).toHaveBeenCalledTimes(1)
    const sending = screen.getByRole('button', { name: /Sending request/ })
    expect(sending).toBeDisabled()
    expect(sending.querySelector('.pz-btn__spinner')).toBeInTheDocument()
    for (const control of within(form).getAllByRole('textbox')) expect(control).toBeDisabled()
    expect(within(form).getByRole('checkbox')).toBeDisabled()
    submit(form)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    await act(async () => submission.resolve({ success: true, message: 'Request received.' }))
    expect(screen.getByText('Request received.')).toBeVisible()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })

  it('shows field errors from a single submission endpoint in place of its form-level message and preserves the entered details', async () => {
    render(<BusinessSiteContactForm consentText={disclosure} initialValues={requiredValues} onSubmit={async () => ({ success: false,
      message: 'We need a different contact number.', fieldErrors: { phone: 'That number cannot receive calls.' } })} />)
    submit()
    await waitFor(() => expect(screen.getByLabelText(/Phone number/)).toHaveAccessibleDescription('That number cannot receive calls.'))
    expect(screen.queryByText('We need a different contact number.')).not.toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText(/Phone number/)).toHaveFocus())
    expect(screen.getByLabelText(/Full name/)).toHaveValue(requiredValues.fullName)
    expect(screen.getByRole('button', { name: 'Send request' })).toBeDisabled()
    fireEvent.change(screen.getByLabelText(/Phone number/), { target: { value: '+44 20 7946 0999' } })
    expect(screen.getByRole('button', { name: 'Send request' })).toBeEnabled()
  })

  it('keeps the draft on a failed request and lets the homeowner retry', async () => {
    const onSubmit = vi.fn().mockRejectedValueOnce(new Error('Internal backend diagnostic')).mockResolvedValueOnce({ success: true })
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} />)
    fillRequired()
    fireEvent.change(screen.getByLabelText(/How can we help/), { target: { value: 'The kitchen tap is leaking.' } })
    submit()
    await waitFor(() => expect(screen.getByText('We couldn’t send your request. Please try again.')).toBeVisible())
    expect(screen.queryByText('Internal backend diagnostic')).not.toBeInTheDocument()
    expect(screen.getByLabelText(/How can we help/)).toHaveValue('The kitchen tap is leaking.')
    submit()
    await waitFor(() => expect(screen.getByText('Your request has been sent. Our team will be in touch.')).toBeVisible())
    expect(onSubmit).toHaveBeenCalledTimes(2)
  })

  it('does not submit when backend validation fails to connect', async () => {
    const onSubmit = vi.fn()
    render(<BusinessSiteContactForm consentText={disclosure} initialValues={requiredValues} onSubmit={onSubmit}
      phoneValidation={{ validate: async () => { throw new Error('Network error') } }} />)
    submit()
    await waitFor(() => expect(screen.getByText('We couldn’t check your details. Please try again.')).toBeVisible())
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByLabelText(/Full name/)).toBeEnabled()
  })

  it.each(['validation', 'submission'] as const)('aborts pending %s when a modal/page unmounts', async (phase) => {
    const pending = deferred<void>()
    const validatePhone = vi.fn<BusinessSiteContactFormPhoneValidation['validate']>(() => pending.promise)
    const onSubmit = vi.fn<BusinessSiteContactFormProps['onSubmit']>(() => pending.promise)
    const { unmount } = render(<BusinessSiteContactForm consentText={disclosure} initialValues={requiredValues} onSubmit={onSubmit}
      {...(phase === 'validation' ? { phoneValidation: { validate: validatePhone } } : {})} />)
    submit()
    const context = phase === 'validation' ? validatePhone.mock.calls[0]?.[1] : onSubmit.mock.calls[0]?.[1]
    unmount()
    expect(context?.signal.aborted).toBe(true)
    await act(async () => pending.resolve(undefined))
    if (phase === 'validation') expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not submit or validate while disabled', () => {
    const onSubmit = vi.fn(), validatePhone = vi.fn()
    render(<BusinessSiteContactForm consentText={disclosure} disabled initialValues={requiredValues} onSubmit={onSubmit} phoneValidation={{ validate: validatePhone }} />)
    submit()
    expect(validatePhone).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByLabelText(/Full name/)).toBeDisabled()
  })

  it('supports customized labels, hints, success copy and starting another request', async () => {
    render(<BusinessSiteContactForm consentText={disclosure} title="Request plumbing service" description="Tell our team what happened."
      labels={{ phone: 'Best number to reach you' }} hints={{ phone: 'Include your area code.' }}
      successMessage="Thanks, our team has your request." onSubmit={() => {}} initialValues={requiredValues} />)
    expect(screen.getByLabelText(/Best number/)).toHaveAccessibleDescription('Include your area code.')
    submit()
    await waitFor(() => expect(screen.getByText('Thanks, our team has your request.')).toBeVisible())
    fireEvent.click(screen.getByRole('button', { name: 'Send another request' }))
    expect(screen.getByRole('form')).toBeVisible()
    expect(screen.getByLabelText(/Full name/)).toHaveValue(requiredValues.fullName)
    expect(screen.getByText('Request plumbing service')).toBeVisible()
  })

  it('supports customized placeholders and success title', async () => {
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} initialValues={requiredValues} successTitle="All set"
      placeholders={{ phone: '(555) 555-0100', address: 'Street, city and ZIP', description: 'Describe the job' }} />)
    expect(screen.getByLabelText(/Phone number/)).toHaveAttribute('placeholder', '(555) 555-0100')
    expect(screen.getByLabelText(/Service address/)).toHaveAttribute('placeholder', 'Street, city and ZIP')
    expect(screen.getByLabelText('How can we help?')).toHaveAttribute('placeholder', 'Describe the job')
    submit()
    await waitFor(() => expect(screen.getByText('All set')).toBeVisible())
  })

  it('debounces live phone checks and links backend errors to the field', async () => {
    vi.useFakeTimers()
    try {
      const validatePhone = vi.fn<BusinessSiteContactFormPhoneValidation['validate']>(async () => 'We couldn’t verify this phone number.')
      render(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} phoneValidation={{ validate: validatePhone }} />)
      const phone = screen.getByLabelText(/Phone number/)
      fireEvent.change(phone, { target: { value: '214' } })
      fireEvent.change(phone, { target: { value: '214 555 0199 ' } })
      await act(async () => { await vi.advanceTimersByTimeAsync(299) })
      expect(validatePhone).not.toHaveBeenCalled()
      await act(async () => { await vi.advanceTimersByTimeAsync(1) })
      expect(validatePhone).toHaveBeenCalledOnce()
      expect(validatePhone).toHaveBeenCalledWith('214 555 0199', { signal: expect.any(AbortSignal) })
      expect(phone).toHaveAccessibleDescription('We couldn’t verify this phone number.')
      expect(phone).toHaveAttribute('aria-invalid', 'true')
    } finally {
      vi.useRealTimers()
    }
  })

  it('shows an in-field loader while the live phone check is in flight without blocking typing', async () => {
    vi.useFakeTimers()
    try {
      let finish!: (message?: string) => void
      const validatePhone = vi.fn<BusinessSiteContactFormPhoneValidation['validate']>(() => new Promise((resolve) => { finish = resolve }))
      const { container } = render(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} phoneValidation={{ validate: validatePhone }} />)
      const input = screen.getByLabelText(/Phone number/)
      const spinner = () => input.parentElement!.querySelector('.pz-business-contact-form__input-spinner')
      fireEvent.change(input, { target: { value: '2145550142' } })
      await act(async () => { await vi.advanceTimersByTimeAsync(299) })
      expect(spinner()).toBeNull()
      await act(async () => { await vi.advanceTimersByTimeAsync(1) })
      expect(spinner()).toBeInTheDocument()
      expect(input).toHaveAttribute('aria-busy', 'true')
      expect(input).toBeEnabled()
      fireEvent.change(input, { target: { value: '21455501429' } })
      expect(input).toHaveValue('21455501429')
      expect(spinner()).toBeNull()
      await act(async () => { await vi.advanceTimersByTimeAsync(300) })
      expect(spinner()).toBeInTheDocument()
      await act(async () => finish())
      expect(spinner()).toBeNull()
      expect(container.querySelectorAll('.pz-business-contact-form__input-spinner')).toHaveLength(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it('aborts outdated live checks and ignores their late results', async () => {
    vi.useFakeTimers()
    try {
      const checks: { signal: AbortSignal; resolve: (message: string) => void }[] = []
      const validatePhone = vi.fn<BusinessSiteContactFormPhoneValidation['validate']>((_value, { signal }) =>
        new Promise<string>((resolve) => checks.push({ signal, resolve })))
      render(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} phoneValidation={{ validate: validatePhone, debounceMs: 100 }} />)
      const phone = screen.getByLabelText(/Phone number/)
      fireEvent.change(phone, { target: { value: '214 555 0142' } })
      await act(async () => { await vi.advanceTimersByTimeAsync(100) })
      fireEvent.change(phone, { target: { value: '214 555 01423' } })
      expect(checks[0]!.signal.aborted).toBe(true)
      await act(async () => checks[0]!.resolve('Stale error'))
      expect(screen.queryByText('Stale error')).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('checks prefilled phone numbers but does not check short or disabled numbers', async () => {
    vi.useFakeTimers()
    try {
      const validatePhone = vi.fn<BusinessSiteContactFormPhoneValidation['validate']>(async () => 'Invalid')
      const { rerender } = render(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} phoneValidation={{ validate: validatePhone }}
        initialValues={{ phone: '2145550142' }} />)
      await act(async () => { await vi.advanceTimersByTimeAsync(1000) })
      expect(validatePhone).toHaveBeenCalledOnce()
      validatePhone.mockClear()
      fireEvent.change(screen.getByLabelText(/Phone number/), { target: { value: '21' } })
      await act(async () => { await vi.advanceTimersByTimeAsync(1000) })
      rerender(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} phoneValidation={{ validate: validatePhone }} disabled />)
      await act(async () => { await vi.advanceTimersByTimeAsync(1000) })
      expect(validatePhone).not.toHaveBeenCalled()
    } finally {
      vi.useRealTimers()
    }
  })

  it('reports numbers failing the built-in rules locally instead of calling the phone API', async () => {
    vi.useFakeTimers()
    try {
      const validatePhone = vi.fn<BusinessSiteContactFormPhoneValidation['validate']>()
      render(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} phoneValidation={{ validate: validatePhone }} />)
      fireEvent.change(screen.getByLabelText(/Phone number/), { target: { value: '214 55' } })
      await act(async () => { await vi.advanceTimersByTimeAsync(300) })
      expect(screen.getByLabelText(/Phone number/)).toHaveAccessibleDescription('Please enter a valid phone number.')
      expect(validatePhone).not.toHaveBeenCalled()
    } finally {
      vi.useRealTimers()
    }
  })

  it('reuses a completed live phone check on submit instead of calling the API again', async () => {
    vi.useFakeTimers()
    try {
      const onSubmit = vi.fn()
      const validatePhone = vi.fn<BusinessSiteContactFormPhoneValidation['validate']>(async (phone) => phone.endsWith('0199') ? 'Unverified number.' : undefined)
      render(<BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} phoneValidation={{ validate: validatePhone }}
        initialValues={{ fullName: 'Jordan Smith', address: requiredValues.address }} />)
      const phone = screen.getByLabelText(/Phone number/)
      fireEvent.change(phone, { target: { value: '214 555 0199' } })
      await act(async () => { await vi.advanceTimersByTimeAsync(300) })
      submit()
      expect(validatePhone).toHaveBeenCalledOnce()
      expect(onSubmit).not.toHaveBeenCalled()
      expect(phone).toHaveAccessibleDescription('Unverified number.')
      fireEvent.change(phone, { target: { value: '214 555 0142' } })
      await act(async () => { await vi.advanceTimersByTimeAsync(300) })
      submit()
      await act(async () => { await vi.advanceTimersByTimeAsync(0) })
      expect(validatePhone).toHaveBeenCalledTimes(2)
      expect(onSubmit).toHaveBeenCalledOnce()
    } finally {
      vi.useRealTimers()
    }
  })

  it.each(['jordan@example', 'jordan@@example.com', 'jordan example@x.com', 'jordan@localhost'])('validates email %s in the component on blur and submit', (email) => {
    const onSubmit = vi.fn()
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} initialValues={requiredValues} />)
    const input = screen.getByLabelText(/Email address/)
    fireEvent.change(input, { target: { value: email } })
    expect(input).not.toHaveAttribute('aria-invalid')
    fireEvent.blur(input)
    expect(input).toHaveAccessibleDescription('Please check this email address.')
    submit()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('accepts a valid email without any backend call', async () => {
    const onSubmit = vi.fn()
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} initialValues={{ ...requiredValues, email: 'jordan.smith+home@example.co.uk' }} />)
    fireEvent.blur(screen.getByLabelText(/Email address/))
    expect(screen.getByLabelText(/Email address/)).not.toHaveAttribute('aria-invalid')
    submit()
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
  })

  it('limits field length and blocks submission on basic rule failures before any backend call', () => {
    const onSubmit = vi.fn(), validatePhone = vi.fn()
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} phoneValidation={{ validate: validatePhone }}
      initialValues={{ fullName: '1234', phone: '555-CALL-NOW', email: 'not-an-email', address: 'a'.repeat(201), description: 'x'.repeat(1001) }} />)
    expect(screen.getByLabelText(/Full name/)).toHaveAttribute('maxlength', '100')
    expect(screen.getByLabelText(/Phone number/)).toHaveAttribute('maxlength', '20')
    expect(screen.getByLabelText(/Email address/)).toHaveAttribute('maxlength', '254')
    expect(screen.getByLabelText(/Service address/)).toHaveAttribute('maxlength', '200')
    expect(screen.getByLabelText(/How can we help/)).toHaveAttribute('maxlength', '1000')
    expect(screen.getByText('1001/1000')).toBeVisible()
    submit()
    expect(validatePhone).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByLabelText(/Full name/)).toHaveAccessibleDescription('Please enter your full name.')
    expect(screen.getByLabelText(/Phone number/)).toHaveAccessibleDescription('Please enter a valid phone number.')
    expect(screen.getByLabelText(/Email address/)).toHaveAccessibleDescription('Please check this email address.')
    expect(screen.getByLabelText(/Service address/)).toHaveAccessibleDescription('Please keep this under 200 characters.')
    expect(screen.getByLabelText(/How can we help/)).toHaveAccessibleDescription('Please keep this under 1000 characters.')
    expect(screen.getByLabelText(/Full name/)).toHaveFocus()
  })

  it('keeps a draft when consumer props change and uses distinct field IDs for multiple placements', () => {
    const onSubmit = vi.fn()
    const { rerender } = render(<BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} />)
    fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: 'My draft' } })
    rerender(<BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} initialValues={{ fullName: 'New defaults' }} />)
    expect(screen.getByLabelText(/Full name/)).toHaveValue('My draft')
    rerender(<><BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} /><BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} /></>)
    const forms = screen.getAllByRole('form')
    const ids = forms.map((form) => within(form).getByLabelText(/Full name/).id)
    expect(new Set(ids).size).toBe(2)
  })

  it('fits the hero formContent slot without introducing a second h1', () => {
    const html = renderToStaticMarkup(<BusinessSiteHero headline="Plumbing help for your home" layout="split"
      formContent={<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} appearance={{ density: 'compact' }} />} />)
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain('pz-business-hero__aside')
    expect(html).toContain('data-density="compact"')
    expect(html).toContain('name="phone"')
  })

  it.each([
    { backgroundColor: '#ffffff', textColor: '#ffffff', accentColor: '#FFD700', onAccent: '#000000' },
    { backgroundColor: '#12171c', textColor: '#12171c', accentColor: '#01173c', onAccent: '#ffffff' },
    { backgroundColor: '#ffffff', textColor: '#12171c', accentColor: '#00ff00', onAccent: '#000000' },
  ])('keeps theme text readable with accent $accentColor', ({ onAccent, ...appearance }) => {
    const html = renderToStaticMarkup(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} appearance={{ ...appearance, font: 'system-ui' }} />)
    expect(html).toContain(`--pz-contact-form-on-accent:${onAccent}`)
    expect(html).toContain('--pz-contact-form-font:system-ui')
    expect(html).not.toContain(`--pz-contact-form-text:${appearance.backgroundColor};`)
  })
})
