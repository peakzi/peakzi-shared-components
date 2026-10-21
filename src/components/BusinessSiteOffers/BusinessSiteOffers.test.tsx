import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { render, screen } from '@testing-library/react'
import { BusinessSiteOffers } from './BusinessSiteOffers'
import type { BusinessSiteOffer } from './helpers/types'

const items: BusinessSiteOffer[] = [{
  id: 'replacement', title: 'System replacement', badge: '$500 OFF', description: 'Save on a qualifying system.',
  features: ['Installation included'], terms: 'One offer per visit.', redemptionInstructions: 'Mention the code when scheduling.',
  code: 'SYSTEM500', expiresOn: '2030-12-31', action: { label: 'Call to claim', href: 'tel:5125550188' },
}]

describe('BusinessSiteOffers', () => {
  it('renders semantic offer content and real links in initial server HTML', () => {
    const html = renderToStaticMarkup(<BusinessSiteOffers items={items} />)
    expect(html).toContain('<article')
    expect(html).toContain('<h2')
    expect(html).toContain('<h3>System replacement</h3>')
    expect(html).toContain('Installation included')
    expect(html).toContain('One offer per visit.')
    expect(html).toContain('Mention the code when scheduling.')
    expect(html).toContain('<strong>SYSTEM500</strong>')
    expect(html).toContain('href="tel:5125550188"')
    expect(html).toContain('data-action-id="offer"')
    expect(html).toContain('<time dateTime="2030-12-31">Dec 31, 2030</time>')
    expect(html).not.toContain('<h1')
    expect(html).not.toContain('Active')
  })

  it('omits empty sections and blank titles', () => {
    expect(renderToStaticMarkup(<BusinessSiteOffers items={[]} />)).toBe('')
    expect(renderToStaticMarkup(<BusinessSiteOffers items={[{ id: 'blank', title: ' ' }]} />)).toBe('')
  })

  it('does not fabricate badges, terms, dates or claim links', () => {
    const html = renderToStaticMarkup(<BusinessSiteOffers items={[{ id: 'minimal', title: 'A real offer' }]} />)
    expect(html).toContain('A real offer')
    expect(html).not.toContain('pz-business-offers__badge')
    expect(html).not.toContain('<time')
    expect(html).not.toContain('<a ')
  })

  it('retains backend offers even when their expiry is in the past', () => {
    const html = renderToStaticMarkup(<BusinessSiteOffers items={[{ ...items[0]!, expiresOn: '2020-01-01' }]} />)
    expect(html).toContain('System replacement')
    expect(html).toContain('Jan 1, 2020')
  })

  it.each(['not-a-date', '2030-02-30', '2030-13-01'])('omits invalid expiry %s without losing content', (expiresOn) => {
    const html = renderToStaticMarkup(<BusinessSiteOffers items={[{ ...items[0]!, expiresOn }]} />)
    expect(html).not.toContain('<time')
    expect(html).toContain('System replacement')
  })

  it('formats timestamps using their supplied calendar day, independent of server timezone', () => {
    const html = renderToStaticMarkup(<BusinessSiteOffers items={[{ ...items[0]!, expiresOn: '2030-12-31T23:30:00-07:00' }]} />)
    expect(html).toContain('dateTime="2030-12-31">Dec 31, 2030')
  })

  it.each(['javascript:alert(1)', 'data:text/html,bad', '//evil.example', '/\\evil.example'])('omits unsafe redemption link %s', (href) => {
    const html = renderToStaticMarkup(<BusinessSiteOffers items={[{ ...items[0]!, action: { label: 'Claim', href } }]} />)
    expect(html).not.toContain('<a ')
    expect(html).toContain('System replacement')
  })

  it('secures external tabs and supports a same-tab internal offer', () => {
    render(<BusinessSiteOffers items={[
      { id: 'external', title: 'External offer', action: { label: 'View external', href: 'https://example.com/offers', newTab: true } },
      { id: 'internal', title: 'Internal offer', action: { label: 'View internal', href: '/offers/one', newTab: true } },
    ]} />)
    expect(screen.getByRole('link', { name: 'View external' })).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByRole('link', { name: 'View external' })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: 'View internal' })).not.toHaveAttribute('target')
  })

  it('validates view-all links and blank action labels', () => {
    const html = renderToStaticMarkup(<BusinessSiteOffers items={[{ ...items[0]!, action: { label: ' ', href: '/offers' } }]} viewAll={{ label: 'View all offers', href: 'javascript:alert(1)' }} />)
    expect(html).not.toContain('<a ')
    const valid = renderToStaticMarkup(<BusinessSiteOffers items={items} viewAll={{ label: 'More offers', href: 'https://example.com/offers', newTab: true }} />)
    expect(valid).toContain('target="_blank" rel="noopener noreferrer"')
  })

  it('supports custom copy and uniquely labels each section', () => {
    const { container } = render(<>
      <BusinessSiteOffers items={items} title="Seasonal offers" eyebrow="" description="Ask about these offers." sectionId="offers" />
      <BusinessSiteOffers items={items} title=" " />
    </>)
    expect(screen.getByRole('heading', { name: 'Seasonal offers' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Offers & savings' })).toBeInTheDocument()
    expect(screen.getByText('Ask about these offers.')).toBeInTheDocument()
    const sections = [...container.querySelectorAll('section')]
    expect(sections[0]).toHaveAttribute('id', 'offers')
    expect(sections[0]!.getAttribute('aria-labelledby')).not.toBe(sections[1]!.getAttribute('aria-labelledby'))
    for (const section of sections) expect(document.getElementById(section.getAttribute('aria-labelledby')!)).toBeInTheDocument()
  })

  it('escapes all supplied copy instead of executing HTML', () => {
    const html = renderToStaticMarkup(<BusinessSiteOffers items={[{ id: 'unsafe', title: '<script>alert(1)</script>', description: '<img src=x onerror=alert(1)>' }]} />)
    expect(html).toContain('&lt;script&gt;')
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<img')
  })

  it('keeps all content and real actions in compact density', () => {
    const html = renderToStaticMarkup(<BusinessSiteOffers items={items} appearance={{ density: 'compact' }} />)
    expect(html).toContain('data-density="compact"')
    expect(html).toContain('System replacement')
    expect(html).toContain('Mention the code when scheduling.')
    expect(html).toContain('href="tel:5125550188"')
    expect(html).not.toContain('pz-business-offers__carousel')
    expect(html).not.toContain('Previous offers')
  })

  it('renders every carousel offer in server HTML, not just the visible cards', () => {
    const html = renderToStaticMarkup(<BusinessSiteOffers items={Array.from({ length: 5 }, (_, index) => ({
      id: `offer-${index}`, title: `Offer ${index + 1}`, description: `Details ${index + 1}`,
    }))} />)
    expect(html.match(/<article/g)).toHaveLength(5)
    expect(html).toContain('pz-business-offers__carousel')
    expect(html).toContain('Offer 5')
    expect(html).toContain('Details 5')
    expect(html).not.toMatch(/<li[^>]*(?:aria-hidden|hidden)/)
    // Controls wait for measured overflow; every offer remains in the server HTML.
    expect(html).not.toContain('Previous offers')
    expect(html).not.toContain('Next offers')
  })

  it('reuses the same cards in a server-rendered grid without carousel controls', () => {
    const html = renderToStaticMarkup(<BusinessSiteOffers layout="grid" items={Array.from({ length: 6 }, (_, index) => ({
      ...items[0]!, id: `grid-${index}`, title: `Grid offer ${index + 1}`,
    }))} />)
    expect(html).toContain('data-layout="grid"')
    expect(html).toContain('data-density="comfortable"')
    expect(html.match(/<article/g)).toHaveLength(6)
    expect(html).toContain('Grid offer 6')
    expect(html).toContain('One offer per visit.')
    expect(html).toContain('href="tel:5125550188"')
    expect(html).not.toContain('pz-business-offers__carousel')
    expect(html).not.toContain('Previous offers')
    expect(html).not.toContain('Next offers')
  })

  it('keeps compact rows when the consumer selects grid layout', () => {
    const html = renderToStaticMarkup(<BusinessSiteOffers items={items} layout="grid" appearance={{ density: 'compact' }} />)
    expect(html).toContain('data-layout="list"')
    expect(html).toContain('data-density="compact"')
    expect(html).toContain('System replacement')
    expect(html).not.toContain('pz-business-offers__carousel')
  })

  it('keeps the homepage carousel default and rejects unknown layout values', () => {
    for (const layout of [undefined, 'unknown' as 'grid']) {
      const html = renderToStaticMarkup(<BusinessSiteOffers items={items} layout={layout} />)
      expect(html).toContain('data-layout="carousel"')
      expect(html).toContain('pz-business-offers__carousel')
    }
    expect(renderToStaticMarkup(<BusinessSiteOffers items={[]} layout="grid" />)).toBe('')
  })

  it('applies site-wide fonts, colors, radius and motion', () => {
    const html = renderToStaticMarkup(<BusinessSiteOffers items={items} appearance={{
      font: 'Nunito Sans', headingFont: 'Archivo', backgroundColor: '#12171c', textColor: '#ffffff',
      accentColor: '#a5c9ee', buttonRadius: '32px', motion: 'subtle',
    }} />)
    expect(html).toContain('--pz-business-offers-background:#12171c')
    expect(html).toContain('--pz-business-offers-text:#ffffff')
    expect(html).toContain('--pz-business-offers-accent:#a5c9ee')
    expect(html).toContain('--pz-business-offers-radius:32px')
    expect(html).toContain('Nunito Sans')
    expect(html).toContain('data-motion="subtle"')
  })

  it('rejects unsafe styles and keeps button text readable on light accents', () => {
    const html = renderToStaticMarkup(<BusinessSiteOffers items={items} appearance={{ backgroundColor: 'url(unsafe)', font: 'bad; font', accentColor: '#ffffff' }} />)
    expect(html).not.toContain('unsafe')
    expect(html).not.toContain('bad; font')
    expect(html).toContain('--pz-business-offers-action-text:#000000')
    expect(html).toContain('data-motion="none"')
  })

  it('supports dark gradient cards independently of a light section', () => {
    const html = renderToStaticMarkup(<BusinessSiteOffers items={items} appearance={{
      backgroundColor: '#ffffff', textColor: '#12171c', accentColor: '#657991',
      cardBackgroundColor: '#12171c', cardGradientEndColor: '#716a64', cardTextColor: '#ffffff', cardAccentColor: '#a5c9ee',
    }} />)
    expect(html).toContain('--pz-business-offers-background:#ffffff')
    expect(html).toContain('--pz-business-offers-text:#12171c')
    expect(html).toContain('--pz-business-offers-accent:#657991')
    expect(html).toContain('--pz-business-offers-card-background:#12171c')
    expect(html).toContain('--pz-business-offers-card-end:#716a64')
    expect(html).toContain('--pz-business-offers-card-text:#ffffff')
    expect(html).toContain('--pz-business-offers-card-accent:#a5c9ee')
    expect(html).toContain('--pz-business-offers-action-text:#000000')
  })

  it('inherits section colors when card colors are omitted or invalid', () => {
    const html = renderToStaticMarkup(<BusinessSiteOffers items={items} appearance={{
      backgroundColor: '#112233', textColor: '#ffffff', accentColor: '#eeeeee',
      cardBackgroundColor: 'url(unsafe)', cardGradientEndColor: 'var(--unsafe)',
      cardTextColor: 'bad; color', cardAccentColor: 'javascript:unsafe',
    }} />)
    expect(html).not.toContain('unsafe')
    expect(html).toContain('--pz-business-offers-card-background:#112233')
    expect(html).toContain('--pz-business-offers-card-end:#112233')
    expect(html).toContain('--pz-business-offers-card-text:#ffffff')
    expect(html).toContain('--pz-business-offers-card-accent:#eeeeee')
  })
})
