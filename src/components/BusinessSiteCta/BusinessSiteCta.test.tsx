import { renderToStaticMarkup } from 'react-dom/server'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { BusinessSiteCta } from './BusinessSiteCta'
import type { BusinessSiteCtaAction, BusinessSiteCtaAppearance, BusinessSiteCtaVariant } from './BusinessSiteCta'

const actions: BusinessSiteCtaAction[] = [
  { id: 'call', label: 'Call now', href: 'tel:15550100142', type: 'primary', iconName: 'phone' },
  { id: 'book', label: 'Schedule service', href: 'https://example.com/book', type: 'secondary', iconName: 'calendar', newTab: true },
]
const appearance: BusinessSiteCtaAppearance = {
  font: 'Nunito Sans', headingFont: 'Open Sans', surfaceColor: '#fdfcfb', surfaceTextColor: '#172839', backgroundColor: '#102030', gradientEndColor: '#405060',
  textColor: '#ffffff', accentColor: '#efbf57', buttonRadius: '16px', density: 'compact', motion: 'none',
}
afterEach(cleanup)

describe('BusinessSiteCta', () => {
  it.each<BusinessSiteCtaVariant>(['direct-line', 'invitation', 'service-desk'])('supports the %s layout with the same business copy, actions and theme', (variant) => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="Ready?" description="Ask our team." actions={actions} appearance={appearance} variant={variant} />)
    expect(html).toContain(`data-cta-variant="${variant}"`)
    expect(html).toContain('--pz-business-cta-surface:#fdfcfb')
    expect(html).toContain('--pz-business-cta-surface-text:#172839')
    expect(html).toContain('--pz-business-cta-gradient-end:#405060')
    expect(html).toContain('href="tel:15550100142"')
    expect(html).toContain('href="https://example.com/book"')
    expect(html).toContain('>Ready?</h2>')
    expect(html).toContain('<p>Ask our team.</p>')
    expect(html.match(/data-action-id=/g)).toHaveLength(2)
    expect(html).not.toContain('<button')
    expect(html).not.toContain('<script')
  })
  it('defaults unsupported runtime variants to service desk', () => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="Ready?" actions={actions} variant={'invalid' as BusinessSiteCtaVariant} />)
    expect(html).toContain('data-cta-variant="service-desk"')
  })
  it('renders service-desk contact buttons without the separate floating arrow', () => {
    render(<BusinessSiteCta title="Ready?" actions={actions} variant="service-desk" appearance={appearance} />)
    const call = screen.getByRole('link', { name: 'Call now' })
    const book = screen.getByRole('link', { name: 'Schedule service' })
    expect(call).toHaveClass('pz-business-cta__action--primary', 'pz-btn--primary')
    expect(call).toHaveAttribute('href', actions[0]!.href)
    expect(call.querySelector('.pz-business-cta__icon')).not.toBeNull()
    expect(call.querySelector('.pz-business-cta__arrow')).toBeNull()
    expect(book).toHaveClass('pz-btn--secondary')
    expect(book.querySelector('.pz-business-cta__arrow')).toBeNull()
    expect(book).toHaveAttribute('href', actions[1]!.href)
    expect(book).toHaveAttribute('target', '_blank')
    expect(book).toHaveAttribute('rel', 'noopener noreferrer')
    call.focus()
    expect(call).toHaveFocus()
  })
  it('pairs the direct-line primary action with a plain, accessible scheduling link', () => {
    render(<BusinessSiteCta title="Ready?" actions={actions} variant="direct-line" />)
    const call = screen.getByRole('link', { name: 'Call now' })
    const book = screen.getByRole('link', { name: 'Schedule service' })
    expect(call).toHaveClass('pz-business-cta__action--primary', 'pz-btn--primary')
    expect(call.querySelector('.pz-business-cta__icon')).not.toBeNull()
    expect(book).toHaveClass('pz-business-cta__action--text-link', 'pz-btn--link')
    expect(book).not.toHaveClass('pz-btn--secondary')
    expect(book.querySelector('.pz-business-cta__icon')).toBeNull()
    expect(book.querySelector('.pz-business-cta__arrow')).toHaveAttribute('aria-hidden', 'true')
    expect(book).toHaveAttribute('href', actions[1]!.href)
    expect(book).toHaveAttribute('data-action-id', 'book')
    expect(book).toHaveAttribute('target', '_blank')
    expect(book).toHaveAttribute('rel', 'noopener noreferrer')
    book.focus()
    expect(book).toHaveFocus()
  })
  it('places the formatted phone number and scheduling link beside the direct-line circle', () => {
    render(<BusinessSiteCta title="Ready?" variant="direct-line" actions={[
      { ...actions[0]!, displayValue: ' (555) 010-0142 ', displayLabel: 'Call us' }, actions[1]!,
    ]} />)
    const call = screen.getByRole('link', { name: 'Call now' })
    const phone = screen.getByRole('link', { name: 'Call us (555) 010-0142' })
    const book = screen.getByRole('link', { name: 'Schedule service' })
    const contact = phone.closest('.pz-business-cta__contact')!
    expect(call.parentElement).toHaveAttribute('data-has-contact', 'true')
    expect(contact).toContainElement(book)
    expect(contact).not.toContainElement(call)
    expect(phone).toHaveAttribute('href', actions[0]!.href)
    expect(phone).toHaveAttribute('data-action-id', 'call')
    expect(phone).not.toHaveAttribute('target')
    expect(phone).not.toHaveAttribute('role', 'button')
    phone.focus()
    expect(phone).toHaveFocus()
    expect(book).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getAllByRole('link')).toHaveLength(3)
    expect(screen.queryByText(/text us|call or text/i)).toBeNull()
  })
  it('keeps the phone details without an empty scheduling placeholder for call-only clients', () => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="Ready?" variant="direct-line" actions={[
      { ...actions[0]!, displayValue: '(555) 010-0142', displayLabel: 'Call us' },
    ]} />)
    expect(html).toContain('data-has-contact="true"')
    expect(html.match(/href="tel:15550100142"/g)).toHaveLength(2)
    expect(html).not.toContain('Schedule service')
    expect(html).not.toContain('pz-business-cta__action--text-link')
  })
  it.each(['', '   '])('omits the contact column and label without a phone display value: %j', (displayValue) => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="Ready?" variant="direct-line" actions={[
      { ...actions[0]!, displayValue, displayLabel: 'Call us' }, actions[1]!,
    ]} />)
    expect(html).not.toContain('data-has-contact')
    expect(html).not.toContain('pz-business-cta__contact')
    expect(html).not.toContain('Call us')
    expect(html.match(/<a /g)).toHaveLength(2)
  })
  it('does not present booking-only actions as phone numbers', () => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="Ready?" variant="direct-line" actions={[
      { ...actions[1]!, displayValue: 'Not a phone', displayLabel: 'Call us' },
    ]} />)
    expect(html).not.toContain('data-has-contact')
    expect(html).not.toContain('Not a phone')
    expect(html.match(/<a /g)).toHaveLength(1)
  })
  it.each<BusinessSiteCtaVariant>(['invitation', 'service-desk'])('does not add a phone-details column to %s', (variant) => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="Ready?" variant={variant} actions={[
      { ...actions[0]!, displayValue: '(555) 010-0142', displayLabel: 'Call us' }, actions[1]!,
    ]} />)
    expect(html).not.toContain('pz-business-cta__contact')
    expect(html).not.toContain('(555) 010-0142')
    expect(html.match(/<a /g)).toHaveLength(2)
  })
  it('keeps one circular primary action when a phone action is not first in the input', () => {
    render(<BusinessSiteCta title="Ready?" variant="direct-line" actions={[
      actions[1]!, { ...actions[0]!, displayValue: '(555) 010-0142' },
    ]} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAccessibleName('Call now')
    expect(links.filter(link => link.classList.contains('pz-business-cta__action--primary'))).toHaveLength(1)
    expect(screen.getByRole('link', { name: '(555) 010-0142' })).toHaveAttribute('href', actions[0]!.href)
  })
  it('escapes optional contact display text as plain text', () => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="Ready?" variant="direct-line" actions={[
      { ...actions[0]!, displayValue: '<img src=x>', displayLabel: '<b>Call</b>' },
    ]} />)
    expect(html).toContain('&lt;img src=x&gt;')
    expect(html).not.toContain('<img')
    expect(html).not.toContain('<b>Call</b>')
  })
  it.each<BusinessSiteCtaVariant>(['service-desk', 'invitation'])('keeps the secondary button unchanged in %s', (variant) => {
    render(<BusinessSiteCta title="Ready?" actions={actions} variant={variant} />)
    const book = screen.getByRole('link', { name: 'Schedule service' })
    expect(book).toHaveClass('pz-btn--secondary')
    expect(book).not.toHaveClass('pz-business-cta__action--text-link')
    expect(book.querySelector('.pz-business-cta__icon')).not.toBeNull()
  })
  it.each([actions[0]!, actions[1]!])('keeps a single direct-line action primary without inventing another link: $id', (action) => {
    render(<BusinessSiteCta title="Ready?" actions={[action]} variant="direct-line" />)
    expect(screen.getAllByRole('link')).toHaveLength(1)
    const link = screen.getByRole('link', { name: action.label })
    expect(link).toHaveClass('pz-business-cta__action--primary')
    expect(link).not.toHaveClass('pz-business-cta__action--text-link')
  })
  it('renders semantic server HTML with copy, anchors and no h1 or client script', () => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="Ready to schedule?" description="Speak with our team." actions={actions} />)
    expect(html).toContain('class="pz-business-cta"')
    expect(html).toContain('>Ready to schedule?</h2>')
    expect(html).toContain('<p>Speak with our team.</p>')
    expect(html).toContain('href="tel:15550100142"')
    expect(html).toContain('href="https://example.com/book"')
    expect(html).toContain('data-action-id="call"')
    expect(html).toContain('data-action-id="book"')
    expect(html).toContain('target="_blank" rel="noopener noreferrer"')
    expect(html).not.toContain('<h1')
    expect(html).not.toContain('<button')
    expect(html).not.toContain('<script')
  })

  it('labels the section with its visible heading and supports keyboard-focusable links', () => {
    render(<BusinessSiteCta title="Ready to schedule?" actions={actions} />)
    const region = screen.getByRole('region', { name: 'Ready to schedule?' })
    expect(region).toHaveAttribute('aria-labelledby', screen.getByRole('heading', { level: 2 }).id)
    screen.getByRole('link', { name: 'Call now' }).focus()
    expect(screen.getByRole('link', { name: 'Call now' })).toHaveFocus()
    expect(screen.getByRole('link', { name: 'Schedule service' })).toBeInTheDocument()
  })

  it('keeps heading IDs unique for repeated section instances', () => {
    render(<><BusinessSiteCta title="First" actions={actions} /><BusinessSiteCta title="Second" actions={actions} /></>)
    const headings = screen.getAllByRole('heading', { level: 2 })
    expect(headings[0]!.id).not.toBe(headings[1]!.id)
  })

  it.each(['', ' \n '])('omits empty headings: %j', (title) => {
    expect(renderToStaticMarkup(<BusinessSiteCta title={title} actions={actions} />)).toBe('')
  })
  it('omits missing descriptions without reserving an empty paragraph', () => {
    expect(renderToStaticMarkup(<BusinessSiteCta title="Ready?" description=" " actions={actions} />)).not.toContain('<p>')
  })
  it('omits the section without valid actions and does not invent buttons', () => {
    expect(renderToStaticMarkup(<BusinessSiteCta title="Ready?" actions={[]} />)).toBe('')
    expect(renderToStaticMarkup(<BusinessSiteCta title="Ready?" actions={[{ id: 'bad', label: 'Bad', href: 'javascript:alert(1)' }]} />)).toBe('')
  })
  it.each(['javascript:alert(1)', 'data:text/html,bad', '//example.com', '/\\example.com', 'https://example.com/\nprivate'])('filters unsafe action destinations: %j', (href) => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="Ready?" actions={[actions[0]!, { id: 'bad', label: 'Bad action', href }]} />)
    expect(html).toContain('Call now')
    expect(html).not.toContain('Bad action')
  })
  it('filters blank labels and duplicate action IDs', () => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="Ready?" actions={[actions[0]!, { ...actions[0]!, label: 'Duplicate' },
      { id: 'blank', label: ' ', href: '/book' }, { id: '', label: 'No ID', href: '/book' }]} />)
    expect(html.match(/<a /g)).toHaveLength(1)
    expect(html).not.toContain('Duplicate')
  })
  it('only opens HTTP(S) destinations in a new tab when requested', () => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="Ready?" actions={[{ ...actions[0]!, newTab: true }]} />)
    expect(html).not.toContain('target=')
    expect(html).not.toContain('rel=')
  })
  it('supports internal destinations and custom labels without business assumptions', () => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="Join our team" actions={[{ id: 'apply', label: 'Explore roles', href: '/careers' }]} />)
    expect(html).toContain('href="/careers"')
    expect(html).toContain('Explore roles')
    expect(html).not.toContain('Call now')
  })
  it('promotes a single secondary action and allows only one primary button', () => {
    const single = renderToStaticMarkup(<BusinessSiteCta title="Book" actions={[actions[1]!]} />)
    expect(single.match(/pz-business-cta__action--primary/g)).toHaveLength(1)
    const multiple = renderToStaticMarkup(<BusinessSiteCta title="Book" actions={actions.map((action) => ({ ...action, type: 'primary' }))} />)
    expect(multiple.match(/pz-business-cta__action--primary/g)).toHaveLength(1)
  })
  it('escapes plain-text copy rather than interpreting HTML or Markdown', () => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="<script>bad()</script>" description="**Call** <img src=x>" actions={actions} />)
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('**Call** &lt;img src=x&gt;')
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<img')
  })
  it('applies the supplied business palette, fonts, radius and motion hooks', () => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="Ready?" actions={actions} appearance={appearance} placement="home-services" sectionId="service-cta" className="custom" />)
    for (const value of ['--pz-business-cta-surface:#fdfcfb', '--pz-business-cta-surface-text:#172839', '--pz-business-cta-background:#102030', '--pz-business-cta-gradient-end:#405060', '--pz-business-cta-text:#ffffff',
      '--pz-business-cta-accent:#efbf57', '--pz-business-cta-on-accent:#000000', '--pz-business-cta-radius:16px',
      '--pz-business-cta-font:&quot;Nunito Sans&quot;', '--pz-business-cta-heading-font:&quot;Open Sans&quot;']) expect(html).toContain(value)
    expect(html).toContain('class="pz-business-cta custom"')
    expect(html).toContain('id="service-cta"')
    expect(html).toContain('data-cta-placement="home-services"')
    expect(html).toContain('data-density="compact"')
    expect(html).toContain('data-motion="none"')
    expect(html).toContain('data-motion-section')
    expect(html.match(/data-motion-reveal/g)).toHaveLength(2)
    expect(html).not.toContain('data-site-reveal=')
  })
  it('uses generic font keywords without quotes and white text on dark accents', () => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="Ready?" actions={actions} appearance={{ font: 'cursive', headingFont: 'fantasy', accentColor: '#01173c' }} />)
    expect(html).toContain('--pz-business-cta-font:cursive')
    expect(html).toContain('--pz-business-cta-heading-font:fantasy')
    expect(html).toContain('--pz-business-cta-on-accent:#ffffff')
  })
  it('preserves alpha palette values and computes readable button text after compositing', () => {
    const dark = renderToStaticMarkup(<BusinessSiteCta title="Ready?" actions={actions} appearance={{ backgroundColor: '#000000', accentColor: '#fff0' }} />)
    const light = renderToStaticMarkup(<BusinessSiteCta title="Ready?" actions={actions} appearance={{ backgroundColor: '#ffffff', accentColor: '#00000000' }} />)
    expect(dark).toContain('--pz-business-cta-accent:#fff0')
    expect(dark).toContain('--pz-business-cta-on-accent:#ffffff')
    expect(light).toContain('--pz-business-cta-on-accent:#000000')
  })
  it('composites invitation accents against the light surface rather than the dark gradient', () => {
    const html = renderToStaticMarkup(<BusinessSiteCta title="Ready?" actions={actions} variant="invitation"
      appearance={{ backgroundColor: '#000000', surfaceColor: '#ffffff', accentColor: '#0000' }} />)
    expect(html).toContain('--pz-business-cta-on-accent:#000000')
  })
  it.each<BusinessSiteCtaVariant>(['direct-line', 'invitation', 'service-desk'])('keeps long labels and missing icons accessible in %s', (variant) => {
    const label = 'Schedule a plumbing, heating or electrical service appointment'
    render(<BusinessSiteCta title="A long title without invented promises" actions={[{ id: 'schedule', label, href: '/schedule' }]} variant={variant} />)
    expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', '/schedule')
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })
  it('rejects unsafe appearance values without mutating caller data', () => {
    const input = { backgroundColor: 'url(https://bad.example)', accentColor: 'red; color:white', font: 'x";color:red', buttonRadius: '999px' } as unknown as BusinessSiteCtaAppearance
    const before = { ...input }
    const html = renderToStaticMarkup(<BusinessSiteCta title="Ready?" actions={actions} appearance={input} />)
    expect(html).not.toContain('bad.example')
    expect(html).not.toContain('color:red')
    expect(html).not.toContain('999px')
    expect(input).toEqual(before)
  })
})
