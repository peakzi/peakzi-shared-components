'use client'

import { useId } from 'react'
import { ArrowRight, Check, Mail, Phone, User } from 'lucide-react'
import { Alert } from '../Alert'
import { Button } from '../Button'
import { Field, Input, Textarea } from '../Input'
import { Checkbox } from '../Checkbox'
import { safeHref } from '../../utils/safeHref'
import { AddressField, InputSpinner } from './address/AddressField'
import { contactFormStyle } from './helpers/appearance'
import { useContactForm } from './helpers/useContactForm'
import { FIELD_LIMITS } from './helpers/validation'
import type { BusinessSiteContactFormProps } from './helpers/types'

const LABELS = { fullName: 'Full name', phone: 'Phone number', email: 'Email address', address: 'Service address', description: 'How can we help?',
  consent: 'I acknowledge and agree to the contact terms below.' }

/** Standalone service enquiry form. The consuming app owns backend validation, submission and modal/page placement. */
export function BusinessSiteContactForm(props: BusinessSiteContactFormProps) {
  const compact = props.appearance?.density === 'compact'
  const { title = compact ? 'Request service' : 'Tell us how we can help', description = compact ? 'We’ll contact you about your request.' : 'Send us a message and we’ll contact you about your service needs.',
    labels, hints, placeholders, submitLabel = 'Send request', validatingLabel = 'Checking details…', submittingLabel = 'Sending request…',
    successTitle = 'Request sent', resetLabel = 'Send another request', disabled = false, appearance = {}, placement, id, className, consentText, privacyPolicy } = props
  const generatedId = useId()
  const prefix = id ?? `pz-contact-${generatedId}`
  const { values, state, checkingPhone, formRef, change, blur, submit, reset, busy } = useContactForm(props)
  const label = { ...LABELS, ...(compact ? { consent: 'I agree to the contact terms below.' } : {}), ...labels }
  const placeholder = { ...(compact ? {} : { description: 'What’s going on, and when did it start?' }), ...placeholders }
  const policyHref = safeHref(privacyPolicy?.href)
  const privacyHref = policyHref && /^(?:https?:\/\/|\/(?!\/))/.test(policyHref) ? policyHref : null
  if (!consentText?.trim()) throw new Error('BusinessSiteContactForm requires a non-empty business-specific consentText')

  return <section id={id} className={['pz-business-contact-form', className].filter(Boolean).join(' ')}
    data-density={compact ? 'compact' : 'comfortable'} data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'}
    data-contact-placement={placement} data-disabled={disabled || busy} style={contactFormStyle(appearance)} aria-labelledby={`${prefix}-heading`}>
    <div className="pz-business-contact-form__layout">
      <header className="pz-business-contact-form__intro">
        <h2 id={`${prefix}-heading`}>{title}</h2>
        {description.trim() && <p id={`${prefix}-intro-description`}>{description}</p>}
        {!compact && <p className="pz-business-contact-form__required">Fields marked <span aria-hidden="true">*</span> are required.</p>}
      </header>
      {state.phase === 'success' ? <div className="pz-business-contact-form__success">
        <div role="status" className="pz-business-contact-form__success-body">
          <span className="pz-business-contact-form__success-icon" aria-hidden="true"><Check size={22} /></span>
          <div>
            {successTitle.trim() && <p className="pz-business-contact-form__success-title">{successTitle}</p>}
            <p className="pz-business-contact-form__success-message">{state.message}</p>
          </div>
        </div>
        <Button type="button" variant="secondary" className="pz-business-contact-form__reset" onClick={reset} disabled={disabled}>{resetLabel}</Button>
      </div> : <form ref={formRef} noValidate onSubmit={submit} aria-labelledby={`${prefix}-heading`}
        aria-describedby={description.trim() ? `${prefix}-intro-description` : undefined} aria-busy={busy}>
        {state.message && <Alert variant="danger" className="pz-business-contact-form__feedback">{state.message}</Alert>}
        <fieldset disabled={busy || disabled}>
          <legend className="pz-business-contact-form__legend">Your contact details and service request</legend>
          <div className="pz-business-contact-form__fields">
            <Field id={`${prefix}-fullName`} label={label.fullName} required error={state.errors.fullName ?? ''} hint={hints?.fullName ?? ''}>
              <div className="pz-business-contact-form__control">
                <span className="pz-business-contact-form__input-icon" aria-hidden="true"><User size={18} /></span>
                <Input id={`${prefix}-fullName`} name="fullName" autoComplete="name" required maxLength={FIELD_LIMITS.fullName} value={values.fullName} placeholder={placeholder.fullName}
                  hasError={Boolean(state.errors.fullName)} onChange={(event) => change('fullName', event.currentTarget.value)} onBlur={() => blur('fullName')} />
              </div>
            </Field>
            <Field id={`${prefix}-phone`} label={label.phone} required error={state.errors.phone ?? ''} hint={hints?.phone ?? ''}>
              <div className="pz-business-contact-form__control">
                <span className="pz-business-contact-form__input-icon" aria-hidden="true"><Phone size={18} /></span>
                <Input id={`${prefix}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={FIELD_LIMITS.phone} value={values.phone} placeholder={placeholder.phone}
                  aria-busy={checkingPhone || undefined} hasError={Boolean(state.errors.phone)} onChange={(event) => change('phone', event.currentTarget.value)}
                  onBlur={() => blur('phone')} />
                {checkingPhone && <InputSpinner />}
              </div>
            </Field>
            {!compact && <Field id={`${prefix}-email`} label={label.email} error={state.errors.email ?? ''} hint={hints?.email ?? ''}>
              <div className="pz-business-contact-form__control">
                <span className="pz-business-contact-form__input-icon" aria-hidden="true"><Mail size={18} /></span>
                <Input id={`${prefix}-email`} name="email" type="email" autoComplete="email" maxLength={FIELD_LIMITS.email} value={values.email} placeholder={placeholder.email}
                  hasError={Boolean(state.errors.email)} onChange={(event) => change('email', event.currentTarget.value)} onBlur={() => blur('email')} />
              </div>
            </Field>}
            <AddressField id={`${prefix}-address`} label={label.address} value={values.address} error={state.errors.address} hint={hints?.address} placeholder={placeholder.address} required
              maxLength={FIELD_LIMITS.address} disabled={disabled || busy} provider={props.addressSearch} onChange={(value) => change('address', value)} />
            <Field id={`${prefix}-description`} label={label.description} error={state.errors.description ?? ''} hint={hints?.description ?? ''}
              className="pz-business-contact-form__problem">
              <Textarea id={`${prefix}-description`} name="description" rows={compact ? 2 : 4} maxLength={FIELD_LIMITS.description} value={values.description}
                placeholder={placeholder.description}
                hasError={Boolean(state.errors.description)} onChange={(event) => change('description', event.currentTarget.value)} />
              {values.description.length >= FIELD_LIMITS.description * 0.8 && <span className="pz-business-contact-form__count">
                {values.description.length}/{FIELD_LIMITS.description}</span>}
            </Field>
          </div>
          <div className="pz-business-contact-form__footer">
            <div className="pz-business-contact-form__consent">
              <Checkbox id={`${prefix}-consent`} name="consent" required checked={values.consent}
                aria-invalid={Boolean(state.errors.consent)}
                aria-describedby={[`${prefix}-consent-disclosure`, state.errors.consent && `${prefix}-consent-error`].filter(Boolean).join(' ')}
                onChange={(event) => change('consent', event.currentTarget.checked)}>
                <span>{label.consent} <span aria-hidden="true">*</span></span>
              </Checkbox>
              <p id={`${prefix}-consent-disclosure`} className="pz-business-contact-form__disclosure">{consentText}</p>
              {state.errors.consent && <p id={`${prefix}-consent-error`} role="alert" className="pz-business-contact-form__consent-error">{state.errors.consent}</p>}
            </div>
            <div className="pz-business-contact-form__actions">
              <Button type="submit" variant="primary" loading={busy} disabled={disabled} className="pz-business-contact-form__submit">
                <span>{state.phase === 'validating' ? validatingLabel : busy ? submittingLabel : submitLabel}</span>
                {!busy && !disabled && <ArrowRight size={18} aria-hidden="true" />}
              </Button>
              <span role="status" aria-live="polite" className="pz-business-contact-form__legend">{busy ? state.phase === 'validating' ? validatingLabel : submittingLabel : ''}</span>
              {privacyHref && <a className="pz-business-contact-form__privacy" href={privacyHref}
                target={privacyPolicy?.newTab ? '_blank' : undefined} rel={privacyPolicy?.newTab ? 'noopener noreferrer' : undefined}>
                {privacyPolicy?.label?.trim() || 'Privacy policy'}
              </a>}
            </div>
          </div>
        </fieldset>
      </form>}
    </div>
  </section>
}

BusinessSiteContactForm.displayName = 'BusinessSiteContactForm'
