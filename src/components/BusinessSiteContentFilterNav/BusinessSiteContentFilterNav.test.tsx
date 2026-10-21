import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BusinessSiteContentFilterNav } from './BusinessSiteContentFilterNav'
import type { BusinessSiteContentFilterNavTrade } from './helpers/types'

const trades: BusinessSiteContentFilterNavTrade[] = [
  { key: 'plumbing', label: 'Plumbing', services: ['Water Filtration', 'Drain Cleaning'] },
  { key: 'hvac', label: 'HVAC', services: ['AC Repair', 'Heat Pump'] },
]

const buildHref = (trade: string, service?: string | null) =>
  service ? `/blogs/${trade}/${service.toLowerCase().replace(/\s+/g, '-')}` : `/blogs/${trade}`

describe('BusinessSiteContentFilterNav', () => {
  it('renders trade tabs and service chips with crawlable links in initial HTML', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteContentFilterNav trades={trades} activeTrade="plumbing" activeService="Water Filtration" buildHref={buildHref} />
    )
    // A trade tab links to that trade's first service — there is no "all services" page.
    expect(html).toContain('href="/blogs/plumbing/water-filtration"')
    expect(html).toContain('href="/blogs/hvac/ac-repair"')
    expect(html).toContain('href="/blogs/plumbing/drain-cleaning"')
    expect(html).not.toContain('All ')
  })

  it('marks the active trade tab and the active chip with aria-current', () => {
    const { container } = render(
      <BusinessSiteContentFilterNav trades={trades} activeTrade="hvac" activeService="AC Repair" buildHref={buildHref} />
    )
    const activeTab = container.querySelector('.pz-business-content-filter-nav__tab[aria-current="page"]')
    expect(activeTab).toHaveTextContent('HVAC')
    const activeChip = container.querySelector('.pz-business-content-filter-nav__chip[aria-current="page"]')
    expect(activeChip).toHaveTextContent('AC Repair')
  })

  it('leaves no chip active when activeService matches nothing', () => {
    const { container } = render(
      <BusinessSiteContentFilterNav trades={trades} activeTrade="plumbing" activeService={null} buildHref={buildHref} />
    )
    expect(container.querySelector('.pz-business-content-filter-nav__chip[aria-current="page"]')).toBeNull()
  })

  it('falls back to the first trade when activeTrade matches nothing', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteContentFilterNav trades={trades} activeTrade="electrical" buildHref={buildHref} />
    )
    expect(html).toContain('href="/blogs/plumbing/water-filtration"')
  })

  it('drops a trade with no usable services, since there is no "view all" page to link it to', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteContentFilterNav
        trades={[...trades, { key: 'roofing', label: 'Roofing', services: [] }]}
        activeTrade="plumbing"
        buildHref={buildHref}
      />
    )
    expect(html).not.toContain('Roofing')
  })

  it('returns no nav when there are no usable trades', () => {
    const { container } = render(<BusinessSiteContentFilterNav trades={[]} activeTrade="plumbing" buildHref={buildHref} />)
    expect(container).toBeEmptyDOMElement()

    const blank = render(
      <BusinessSiteContentFilterNav trades={[{ key: '', label: '', services: [] }]} activeTrade="plumbing" buildHref={buildHref} />
    )
    expect(blank.container).toBeEmptyDOMElement()
  })

  it('uses the supplied buildHref for every link, with no built-in routing scheme of its own', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteContentFilterNav
        trades={trades}
        activeTrade="plumbing"
        buildHref={(trade, service) => (service ? `/custom/${trade}/${service}` : `/custom/${trade}`)}
      />
    )
    expect(html).toContain('href="/custom/plumbing/Water Filtration"')
    expect(html).not.toContain('/blogs/')
  })

  it('never renders a link built from an unsafe buildHref result', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteContentFilterNav trades={trades} activeTrade="plumbing" buildHref={() => 'javascript:alert(1)'} />
    )
    expect(html).not.toContain('<a')
  })

  it('applies appearance tokens to the root style', () => {
    const { container } = render(
      <BusinessSiteContentFilterNav
        trades={trades}
        activeTrade="plumbing"
        buildHref={buildHref}
        appearance={{ backgroundColor: '#102030', accentColor: '#ff7700', buttonRadius: '16px' }}
      />
    )
    const style = container.querySelector('nav')!.getAttribute('style')!
    expect(style).toContain('--pz-business-content-filter-nav-background: #102030')
    expect(style).toContain('--pz-business-content-filter-nav-accent: #ff7700')
    expect(style).toContain('--pz-business-content-filter-nav-radius: 16px')
  })

  it('uses a default and custom aria-label on the nav landmark', () => {
    const { container: withDefault } = render(
      <BusinessSiteContentFilterNav trades={trades} activeTrade="plumbing" buildHref={buildHref} />
    )
    expect(withDefault.querySelector('nav')).toHaveAttribute('aria-label', 'Filter by topic')

    const { container: withCustom } = render(
      <BusinessSiteContentFilterNav trades={trades} activeTrade="plumbing" buildHref={buildHref} ariaLabel="Browse by trade" />
    )
    expect(withCustom.querySelector('nav')).toHaveAttribute('aria-label', 'Browse by trade')
  })

  it('renders the mobile trigger with the current trade and active service label', () => {
    const { getByRole } = render(
      <BusinessSiteContentFilterNav trades={trades} activeTrade="hvac" activeService="Heat Pump" buildHref={buildHref} />
    )
    const trigger = getByRole('button', { name: /change/i })
    expect(trigger).toHaveTextContent('HVAC')
    expect(trigger).toHaveTextContent('Heat Pump')
  })

  it('falls back the trigger label to the first service when no activeService is given', () => {
    const { getByRole } = render(
      <BusinessSiteContentFilterNav trades={trades} activeTrade="hvac" activeService={null} buildHref={buildHref} />
    )
    expect(getByRole('button', { name: /change/i })).toHaveTextContent('AC Repair')
  })
})
