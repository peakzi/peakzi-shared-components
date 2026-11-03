import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { BusinessSiteContactForm } from './BusinessSiteContactForm'
import { BusinessSiteHero } from '../BusinessSiteHero'
import type { BusinessSiteContactFormErrors, BusinessSiteContactFormProps, BusinessSiteContactFormResult } from './helpers/types'

const disclosure = 'I agree to calls and texts from Example Home Services about my service request.'
const requiredValues = { fullName: 'Jordan Smith', phone: '+44 20 7946 0123' }
function submit(form = screen.getByRole('form')) {
  const checkbox = within(form).getByRole('checkbox') as HTMLInputElement
  if (!checkbox.checked) fireEvent.click(checkbox)
  fireEvent.submit(form)
}
function fillRequired() {
  fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: requiredValues.fullName } })
  fireEvent.change(screen.getByLabelText(/Phone number/), { target: { value: requiredValues.phone } })
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
    expect(screen.getByLabelText('Service address')).not.toBeRequired()
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
    const onSubmit = vi.fn(), onValidate = vi.fn()
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} onValidate={onValidate} initialValues={requiredValues} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    expect(checkbox).toBeRequired()
    expect(checkbox).toHaveAccessibleDescription(disclosure)
    fireEvent.submit(screen.getByRole('form'))
    expect(onValidate).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(checkbox).toHaveFocus()
    expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    expect(checkbox).toHaveAccessibleDescription(`${disclosure} Please agree to the contact terms before sending your request.`)
  })

  it('clears consent when starting another request', async () => {
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} initialValues={requiredValues} />)
    submit()
    await waitFor(() => expect(screen.queryByRole('form')).not.toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: 'Send another request' }))
    expect(screen.getByRole('checkbox')).not.toBeChecked()
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

  it('renders a server-readable, labelled form with only name and phone required', () => {
    const html = renderToStaticMarkup(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} />)
    expect(html).toContain('Tell us how we can help')
    const { container } = render(<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} />)
    const ids = [...container.querySelectorAll('[id]')].map((element) => element.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(screen.getByRole('form', { name: 'Tell us how we can help' })).toBeVisible()
    for (const label of [/Full name/, /Phone number/]) expect(screen.getByLabelText(label)).toBeRequired()
    for (const label of [/Email address/, /Service address/, /How can we help/]) expect(screen.getByLabelText(label)).not.toBeRequired()
    expect(screen.getByLabelText(/Phone number/)).toHaveAttribute('autocomplete', 'tel')
    expect(screen.getByLabelText(/Service address/)).toHaveAttribute('autocomplete', 'street-address')
  })

  it('blocks empty and whitespace-only required fields before backend validation and focuses the first error', () => {
    const onSubmit = vi.fn(), onValidate = vi.fn()
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} onValidate={onValidate} initialValues={{ fullName: '  ', phone: '  ' }} />)
    submit()
    expect(onValidate).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByLabelText(/Full name/)).toHaveFocus()
    expect(screen.getByLabelText(/Phone number/)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/Phone number/)).toHaveAccessibleDescription('Please enter your phone number.')
  })

  it('submits trimmed values with empty optional fields and accepts international phone formats for backend validation', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<BusinessSiteContactForm consentText={disclosure} onSubmit={onSubmit} initialValues={{ fullName: ' Jordan Smith ', phone: ' +44 20 7946 0123 ' }} />)
    submit()
    await waitFor(() => expect(screen.getByText('Your request has been sent. Our team will be in touch.')).toBeVisible())
    expect(onSubmit).toHaveBeenCalledWith({ ...requiredValues, email: '', address: '', description: '', consent: true }, { signal: expect.any(AbortSignal), consentText: disclosure })
  })

  it.each(['phone', 'email', 'address'] as const)('shows consumer backend validation errors for %s without submitting', async (field) => {
    const onSubmit = vi.fn()
    render(<BusinessSiteContactForm consentText={disclosure} initialValues={requiredValues} onSubmit={onSubmit}
      onValidate={async () => ({ [field]: 'Please check this value with our service team.' })} />)
    submit()
    const labels = { phone: /Phone number/, email: /Email address/, address: /Service address/ }
    const input = screen.getByLabelText(labels[field])
    await waitFor(() => expect(input).toHaveAccessibleDescription('Please check this value with our service team.'))
    await waitFor(() => expect(input).toHaveFocus())
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.change(input, { target: { value: 'Corrected value' } })
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('awaits backend validation, locks all controls, and prevents duplicate validation/submission', async () => {
    const validation = deferred<void | BusinessSiteContactFormErrors>()
    const submission = deferred<void | BusinessSiteContactFormResult>()
    const onValidate = vi.fn(() => validation.promise), onSubmit = vi.fn(() => submission.promise)
    render(<BusinessSiteContactForm consentText={disclosure} initialValues={requiredValues} onSubmit={onSubmit} onValidate={onValidate} />)
    const form = screen.getByRole('form')
    submit(form)
    submit(form)
    expect(onValidate).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByLabelText(/Full name/)).toBeDisabled()
    expect(screen.getByRole('button', { name: /Checking details/ })).toBeDisabled()
    await act(async () => validation.resolve(undefined))
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: /Sending request/ })).toBeDisabled()
    submit(form)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    await act(async () => submission.resolve({ success: true, message: 'Request received.' }))
    expect(screen.getByText('Request received.')).toBeVisible()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })

  it('supports field errors from a single submission endpoint and preserves the entered details', async () => {
    render(<BusinessSiteContactForm consentText={disclosure} initialValues={requiredValues} onSubmit={async () => ({ success: false,
      message: 'We need a different contact number.', fieldErrors: { phone: 'That number cannot receive calls.' } })} />)
    submit()
    await waitFor(() => expect(screen.getByText('We need a different contact number.')).toBeVisible())
    expect(screen.getByLabelText(/Phone number/)).toHaveAccessibleDescription('That number cannot receive calls.')
    await waitFor(() => expect(screen.getByLabelText(/Phone number/)).toHaveFocus())
    expect(screen.getByLabelText(/Full name/)).toHaveValue(requiredValues.fullName)
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
      onValidate={async () => { throw new Error('Network error') }} />)
    submit()
    await waitFor(() => expect(screen.getByText('We couldn’t check your details. Please try again.')).toBeVisible())
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByLabelText(/Full name/)).toBeEnabled()
  })

  it.each(['validation', 'submission'] as const)('aborts pending %s when a modal/page unmounts', async (phase) => {
    const pending = deferred<void>()
    const onValidate = vi.fn<NonNullable<BusinessSiteContactFormProps['onValidate']>>(() => pending.promise)
    const onSubmit = vi.fn<BusinessSiteContactFormProps['onSubmit']>(() => pending.promise)
    const { unmount } = render(<BusinessSiteContactForm consentText={disclosure} initialValues={requiredValues} onSubmit={onSubmit}
      {...(phase === 'validation' ? { onValidate } : {})} />)
    submit()
    const callback = phase === 'validation' ? onValidate : onSubmit
    const context = callback.mock.calls[0]?.[1]
    unmount()
    expect(context?.signal.aborted).toBe(true)
    await act(async () => pending.resolve(undefined))
    if (phase === 'validation') expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not submit or validate while disabled', () => {
    const onSubmit = vi.fn(), onValidate = vi.fn()
    render(<BusinessSiteContactForm consentText={disclosure} disabled initialValues={requiredValues} onSubmit={onSubmit} onValidate={onValidate} />)
    submit()
    expect(onValidate).not.toHaveBeenCalled()
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

  it('fits the existing hero aside slot without introducing a second h1', () => {
    const html = renderToStaticMarkup(<BusinessSiteHero headline="Plumbing help for your home" layout="split"
      aside={<BusinessSiteContactForm consentText={disclosure} onSubmit={() => {}} appearance={{ density: 'compact' }} />} />)
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
