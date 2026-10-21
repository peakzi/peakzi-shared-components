import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BusinessSiteServiceDetail } from './BusinessSiteServiceDetail'

const reasons = [{ label: 'Experienced team', proof: 'Evidence from the API.' }, { label: 'Local service' }]
const actions = [
  { id: 'call', label: 'Call now', href: 'tel:5125550188', type: 'primary' as const, iconName: 'phone', newTab: true },
  { id: 'book', label: 'Book online', href: 'https://booking.example/', type: 'secondary' as const, newTab: true, iconName: 'calendar', iconPosition: 'after' as const },
]

describe('BusinessSiteServiceDetail', () => {
  it('server-renders one H1, exact API content, actions, proof and composed sections', () => {
    const html = renderToStaticMarkup(<BusinessSiteServiceDetail headline="Water heater service in our community"
      description="The full API description. No copy is shortened." trade="Plumbing" businessName="Client Business"
      reasons={reasons} reasonsTitle="Our API proof title" actions={actions}
      breadcrumb={<nav aria-label="Breadcrumb"><a href="/services?domain=client.example">Services</a></nav>}
      sections={[{ id: 'photos', label: 'Projects' }, { id: 'questions', label: 'FAQs' }]}>
      <section id="photos"><h2>Real projects</h2></section><section id="questions"><h2>Service questions</h2></section>
    </BusinessSiteServiceDetail>)
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    for (const text of ['Water heater service in our community', 'The full API description. No copy is shortened.', 'Client Business',
      'Our API proof title', 'Evidence from the API.', 'Real projects', 'Service questions']) expect(html).toContain(text)
    expect(html).toContain('href="#service-detail-why"'); expect(html).toContain('id="service-detail-why"')
    expect(html).toContain('href="#photos"'); expect(html).toContain('href="#questions"')
    expect(html).toContain('href="/services?domain=client.example"')
    expect(html).not.toContain('pz-business-hero'); expect(html).not.toContain('pricing')
  })
  it('uses safe action links with icons and only opens HTTP links in a new tab', () => {
    render(<BusinessSiteServiceDetail headline="Service" actions={actions} />)
    const call = screen.getByRole('link', { name: 'Call now' })
    expect(call).toHaveAttribute('href', 'tel:5125550188'); expect(call).not.toHaveAttribute('target')
    expect(call.querySelector('svg')).toBeInTheDocument()
    const book = screen.getByRole('link', { name: 'Book online' })
    expect(book).toHaveAttribute('target', '_blank'); expect(book).toHaveAttribute('rel', 'noopener noreferrer')
    expect(book.lastElementChild?.querySelector('svg')).toBeInTheDocument()
  })
  it('omits absent content and redundant navigation without adding claims or ratings', () => {
    const html = renderToStaticMarkup(<BusinessSiteServiceDetail headline="Service" reasons={[{ label: ' ' }]} sections={[{ id: 'one', label: 'One' }]} />)
    expect(html).toContain('data-has-copy="false"'); expect(html).not.toContain('<nav'); expect(html).not.toContain('__proof')
    expect(html).not.toContain('__copy'); expect(html).not.toContain('__actions'); expect(html).not.toContain('__business')
    expect(html).not.toContain('rating'); expect(html).not.toContain('five-star')
  })
  it('rejects unsafe actions and anchor IDs, deduplicates section links and keeps unknown trades readable', () => {
    render(<BusinessSiteServiceDetail headline="Service" trade="Specialty" sectionId="unsafe id"
      actions={[...actions, { id: 'bad', label: 'Unsafe', href: 'javascript:alert(1)', type: 'primary' }, { id: 'empty', label: ' ', href: '/safe', type: 'secondary' }]}
      sections={[{ id: 'photos', label: 'Photos' }, { id: 'photos', label: 'Projects' }, { id: 'faqs', label: 'FAQs' },
        { id: 'javascript:alert(1)', label: 'Bad anchor' }, { id: 'empty', label: ' ' }]} />)
    expect(screen.queryByRole('link', { name: 'Unsafe' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Bad anchor' })).not.toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'On this page' })
    expect(within(nav).getAllByRole('link')).toHaveLength(2)
    expect(within(nav).getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#photos')
    expect(screen.getByText('Specialty')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute('id', 'service-detail-heading')
  })
  it('escapes API content rather than executing markup', () => {
    const html = renderToStaticMarkup(<BusinessSiteServiceDetail headline="<script>title</script>" description="<script>body</script>"
      reasons={[{ label: '<img onerror=alert(1)>', proof: '<script>proof</script>' }]} />)
    expect(html).not.toContain('<script>'); expect(html).not.toContain('<img')
    expect(html).toContain('&lt;script&gt;body&lt;/script&gt;')
  })
  it.each(['comfortable', 'compact'] as const)('shares website fonts, radius, palette and motion in %s density', (density) => {
    const html = renderToStaticMarkup(<BusinessSiteServiceDetail headline="Service" appearance={{ density, motion: 'subtle',
      backgroundColor: '#fff8ee', gradientStartColor: '#123456', gradientEndColor: '#456789', font: 'Nunito Sans', headingFont: 'Open Sans', buttonRadius: '16px' }} />)
    expect(html).toContain(`data-density="${density}"`); expect(html).toContain('data-motion="subtle"')
    expect(html).toContain('--pz-business-services-background:#fff8ee')
    expect(html).toContain('linear-gradient(135deg, #123456, #456789)'); expect(html).toContain('--pz-business-services-radius:16px')
    expect(html).toContain('&quot;Nunito Sans&quot;'); expect(html).toContain('&quot;Open Sans&quot;')
  })
  it('requires a meaningful page title', () => {
    expect(() => renderToStaticMarkup(<BusinessSiteServiceDetail headline=" " />)).toThrow('non-empty headline')
  })
})
