import { renderToStaticMarkup } from 'react-dom/server'
import { render, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BusinessSiteHeader } from '../components/BusinessSiteHeader'
import { BusinessSiteHero, type BusinessSiteHeroAction } from '../components/BusinessSiteHero'
import { BusinessSiteCta } from '../components/BusinessSiteCta'
import { BusinessSiteFaq } from '../components/BusinessSiteFaq'
import { BusinessSiteServiceDetail } from '../components/BusinessSiteServiceDetail'
import { BusinessSiteActionLabel, businessSiteActionAriaLabel } from './BusinessSiteActionLabel'

const phone = '(512) 555-0188'
const actions: BusinessSiteHeroAction[] = [
  { id: 'book', label: 'Book online', href: 'https://booking.example/', type: 'secondary', iconName: 'calendar', newTab: true },
  { id: 'call', label: 'Call now', desktopLabel: phone, href: 'tel:5125550188', type: 'primary', iconName: 'phone', newTab: true },
]
const views = [
  ['header', (links: BusinessSiteHeroAction[]) => <BusinessSiteHeader logo={{ src: '', alt: 'Business', homeHref: '/', width: 100, height: 44 }} menu={[]} actions={links} />],
  ['hero', (links: BusinessSiteHeroAction[]) => <BusinessSiteHero headline="Home services" actions={links} />],
  ['direct line', (links: BusinessSiteHeroAction[]) => <BusinessSiteCta title="Contact our team" variant="direct-line" actions={links} />],
  ['invitation', (links: BusinessSiteHeroAction[]) => <BusinessSiteCta title="Contact our team" variant="invitation" actions={links} />],
  ['service desk', (links: BusinessSiteHeroAction[]) => <BusinessSiteCta title="Contact our team" variant="service-desk" actions={links} />],
  ['FAQ', (links: BusinessSiteHeroAction[]) => <BusinessSiteFaq items={[{ id: 'help', question: 'Can you help?', answer: 'Yes.' }]} contact={{ title: 'Questions?', actions: links }} />],
  ['service detail', (links: BusinessSiteHeroAction[]) => <BusinessSiteServiceDetail headline="Plumbing" actions={links} />],
] as const

describe('responsive business contact labels', () => {
  it.each(views)('keeps one dialing destination per rendered action, including both labels for accessibility, in %s', (_name, view) => {
    const { container } = render(view(actions))
    const calls = within(container).getAllByRole('link', { name: 'Call now ' + phone, hidden: true })
    for (const call of calls) {
      expect(call).toHaveAttribute('href', 'tel:5125550188')
      expect(call).toHaveAttribute('data-action-id', 'call')
      expect(call).not.toHaveAttribute('target')
      expect(call.querySelector('.pz-business-action-label__mobile')).toHaveTextContent('Call now')
      expect(call.querySelector('.pz-business-action-label__desktop')).toHaveTextContent(phone)
    }
    for (const book of within(container).getAllByRole('link', { name: 'Book online', hidden: true })) {
      expect(book).toHaveAttribute('target', '_blank')
      expect(book).toHaveAttribute('rel', 'noopener noreferrer')
      expect(book.querySelector('.pz-business-action-label__desktop')).toBeNull()
    }
  })

  it.each(views)('server-renders the API number and mobile copy without JavaScript in %s', (_name, view) => {
    const html = renderToStaticMarkup(view(actions))
    expect(html).toContain(phone)
    expect(html).toContain('>Call now</span>')
    expect(html).toContain('href="tel:5125550188"')
  })

  it.each([undefined, '', '  ', 'Call now'])('preserves existing labels when desktopLabel is %s', (desktopLabel) => {
    expect(renderToStaticMarkup(<BusinessSiteActionLabel label="Call now" desktopLabel={desktopLabel} />)).toBe('Call now')
    expect(businessSiteActionAriaLabel({ label: 'Call now', desktopLabel })).toBeUndefined()
  })

  it('escapes supplied label text and trims only surrounding whitespace', () => {
    const html = renderToStaticMarkup(<BusinessSiteActionLabel label="Call now" desktopLabel={'  <script>bad()</script>  '} />)
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;bad()&lt;/script&gt;')
    expect(businessSiteActionAriaLabel({ label: 'Call now', desktopLabel: '  +44 20 7946 0958  ' })).toBe('Call now +44 20 7946 0958')
  })
})
