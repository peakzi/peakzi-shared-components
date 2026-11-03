# BusinessSiteContactForm

A standalone homeowner service-request form for React and Next.js. Use it in a
page/section, a `BusinessSiteHero` aside, or a consumer-owned modal. It supplies
no router, dialog, API URL, credentials, business ID or third-party SDK.

Fields: `fullName` and `phone` are required. `email`, `address` and `description`
are optional. The default labels are Full name, Phone number, Email address,
Service address and How can we help? Override labels/hints through props.
Labels use an asterisk for mandatory fields, without optional annotations.
Compact mode does not render email and passes `email: ''` to validation/submission,
including when initial values contain an email address.
A separate mandatory consent checkbox is always initially unchecked. Supply the
business's approved TCPA disclosure through the required `consentText` prop.
The package does not invent business identity or legal disclosure wording.

## Consumer integration

```tsx
'use client' // Required on this integration component in Next.js.

import { BusinessSiteContactForm } from '@peakzi/components/BusinessSiteContactForm'
import type {
  BusinessSiteContactFormProps,
} from '@peakzi/components/BusinessSiteContactForm'
import '@peakzi/components/styles'

// Implement this adapter in the consuming app using its API client and business identity.
// Return { success: true } only when the backend has accepted the request.
const submitRequest: BusinessSiteContactFormProps['onSubmit'] = async (values, { signal, consentText }) => {
  const response = await submitToYourBackend({ ...values, consentText }, { signal })
  return response
}

export function ContactSection() {
  return <BusinessSiteContactForm
    onSubmit={submitRequest}
    consentText={businessApprovedDisclosure}
    privacyPolicy={privacyPolicyUrl ? { href: privacyPolicyUrl } : undefined}
    placement="contact-page"
    appearance={{
      font: 'Outfit', headingFont: 'Outfit', backgroundColor: '#ffffff',
      textColor: '#12171c', accentColor: '#1d4f8c', buttonRadius: '8px',
      density: 'comfortable', motion: 'none',
    }}
  />
}
```

`submitToYourBackend`, `businessApprovedDisclosure` and `privacyPolicyUrl` represent
the app's adapter/configuration, not exports from this package.
Callbacks receive trimmed strings for the five text fields and `consent: true`;
unused optional text values are empty strings. The callback context also includes
`consentText`, the exact trimmed disclosure displayed for the request, so the
consumer backend can record the acknowledgement with its own timestamp and audit
metadata. Consent must also be enforced by the backend. Successful callbacks may return `void` or
`{ success: true, message?: string }`. Failures can return:

```ts
{ success: false, message: 'Please check your details.', fieldErrors: {
  phone: 'Please enter a number we can reach you on.',
  email: 'Please check this email address.',
  address: 'Please include your city and ZIP code.',
} }
```

The consumer's backend performs Twilio phone/email validation and Google address
validation. If validation uses a separate endpoint, pass `onValidate(values,
{ signal })`, returning field errors or nothing when valid. Submission waits for
validation and is blocked on validation errors or a rejected validation request.
If one backend endpoint validates and submits, use `onSubmit` alone and return its
field errors. The backend remains authoritative; the form only checks required
name/phone presence locally and does not impose a US-only phone format.

Consent is required before either callback runs, is never prefilled by
`initialValues`, and resets to unchecked for each new request or changed
disclosure. The footer shows a
Privacy policy link only when `privacyPolicy.href` is a safe absolute HTTP(S) or
root-relative URL; no destination is fabricated when a policy is unavailable.

Inputs lock during validation/submission, duplicate submits are suppressed,
drafts remain after failure, and the first invalid field receives focus. Pending
callbacks receive an aborted signal on unmount; forward it to backend requests.
An error thrown by a callback displays a generic retry message. Return a
structured result for homeowner-facing messages rather than throwing server
diagnostics. Success displays confirmation and a Send another request action.

## Address search

Pass a consumer-owned backend adapter to turn Service address into a searchable
combobox. Map the API response to `{ id, label, description? }`; `label` must be the
complete address text to submit. For example:

```tsx
<BusinessSiteContactForm
  consentText={businessApprovedDisclosure}
  onSubmit={submitRequest}
  addressSearch={{
    search: async (query, { signal }) => searchAddressesOnYourBackend(query, { signal }),
    onSelect: (suggestion) => rememberSelectedPlace(suggestion.id), // optional
    minLength: 3,
    debounceMs: 250,
  }}
/>
```

The adapter owns the actual Google/backend response shape and credentials.
The shared form debounces requests, cancels outdated queries, ignores stale
responses, and supports Arrow Up/Down, Enter, Escape and pointer selection.
Selecting an address does not submit the form. Loading, empty and lookup-failure
feedback is provided; manual entry stays available. The backend still validates
the submitted address. Without `addressSearch`, Service address is a normal text
field. `onSelect` is a notification for consumer-owned place metadata; the form
payload continues to contain the address string.

## Placement and appearance

- **Hero:** `<BusinessSiteHero layout="split" aside={<BusinessSiteContactForm ... />} />`.
  Explicitly use split when there are no photos. Background heroes also support
  an aside when background photos are present. Flat heroes do not display asides.
- **Page/section:** render directly; the host controls the outer width and margins.
- **Modal:** place inside the host's modal/dialog; the host owns opening, closing,
  focus trapping and dismissal. The form does not contain another modal.
- **Compact:** no email field, shorter heading/copy, a two-row description box,
  tighter gaps and full-width submit button. Name/phone share a row from a 22rem
  container width; narrower hosts stack. Address and description span the width.
  Full consent wording remains visible. Suitable for hero columns and modal bodies.
- **Comfortable:** paired fields from a 32rem container width, and a side
  introduction from 48rem. Narrow hosts stack automatically, regardless of the
  viewport size.

Appearance accepts fonts, surface/text colors, accent/button color, separate
input surface/text colors, error color, radius, density and motion. Colors/fonts
are sanitized and text contrast is resolved locally, without changing global
theme variables. Reduced-motion preferences are respected.
Every field supports backend validation errors with linked messages, visible
invalid borders/backgrounds and first-error focus. Disabled/pending controls use
muted surfaces, dashed input borders and distinct button colors.

Multiple instances get distinct generated label/input IDs. An explicit `id`
must be unique. `initialValues` is read on mount/reset; new props do not overwrite
a homeowner's draft. The form must not be nested inside another HTML form.
