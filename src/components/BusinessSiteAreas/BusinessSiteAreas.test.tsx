import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { BusinessSiteAreas } from './BusinessSiteAreas'

describe('BusinessSiteAreas', () => {
  it.each(['comfortable', 'compact'] as const)('renders cities without URLs as plain labels in %s sections', (density) => {
    const html = renderToStaticMarkup(<BusinessSiteAreas areas={[
      { id: 'allen', label: 'Allen, TX', favorite: true }, { id: 'plano', label: 'Plano, TX' },
    ]} appearance={{ density }} map={<div>Map island</div>} totalCount={20}
      viewAll={{ label: 'View all service areas', href: '/cities' }} />)
    expect(html).toContain('<span class="pz-business-areas__tile" data-area-id="allen">')
    expect(html).toContain('<strong>Allen, TX</strong>')
    expect(html).toContain('<span>Plano, TX</span>')
    expect(html).toContain('<strong>20</strong>')
    expect(html).not.toContain('<button')
    expect(html).not.toContain('href="/cities/')
    expect(html).toContain('href="/cities"')
    expect(html).toContain('Map island')
  })

  it('retains map-selection buttons for directory cities without URLs', () => {
    const html = renderToStaticMarkup(<BusinessSiteAreas variant="directory" areas={[{ id: 'allen', label: 'Allen, TX' }]} />)
    expect(html).toContain('<button type="button" class="pz-business-areas__tile" data-area-id="allen">')
    expect(html).not.toContain('<a ')
  })

  const previewAreas = [{ id: 'allen', label: 'Allen, TX', href: '/cities/allen-tx' }]

  it('shows the full coverage count and a crawlable footer after the preview list', () => {
    const html = renderToStaticMarkup(<BusinessSiteAreas areas={previewAreas} totalCount={34}
      viewAll={{ label: 'View all service areas', href: '/cities?domain=www.client.example' }} />)
    expect(html).toContain('<strong>34</strong>')
    expect(html).toContain('<span>cities</span>')
    expect(html).toContain('href="/cities?domain=www.client.example"')
    expect(html).toContain('View all service areas')
    expect(html.indexOf('View all service areas')).toBeGreaterThan(html.indexOf('</ul>'))
    expect(html).toContain('href="/cities/allen-tx"')
  })

  it.each([undefined, NaN, Infinity, -1, 0])('falls back to the listed count for an invalid total: %s', (totalCount) => {
    const html = renderToStaticMarkup(<BusinessSiteAreas areas={previewAreas} totalCount={totalCount} />)
    expect(html).toContain('<strong>1</strong>')
    expect(html).toContain('<span>city</span>')
    expect(html).not.toContain('pz-business-areas__view-all')
  })

  it('does not undercount listed cities and uses an integer total', () => {
    expect(renderToStaticMarkup(<BusinessSiteAreas areas={previewAreas} totalCount={12.7} />)).toContain('<strong>12</strong>')
    expect(renderToStaticMarkup(<BusinessSiteAreas areas={previewAreas} totalCount={0.7} />)).toContain('<strong>1</strong>')
  })

  it.each([
    { label: 'View all service areas', href: 'javascript:alert(1)' },
    { label: ' ', href: '/cities' },
    { label: 'View all service areas', href: '' },
  ])('omits unsafe or empty footer links: %j', (viewAll) => {
    const html = renderToStaticMarkup(<BusinessSiteAreas areas={previewAreas} viewAll={viewAll} />)
    expect(html).not.toContain('pz-business-areas__view-all')
    expect(html).not.toContain('javascript:')
  })

  it('keeps empty homepage sections omitted even with a total and footer', () => {
    expect(renderToStaticMarkup(<BusinessSiteAreas areas={[]} totalCount={34}
      viewAll={{ label: 'View all service areas', href: '/cities' }} />)).toBe('')
  })

  it.each([undefined, 'none', 'subtle'] as const)('uses the site motion setting %s without hiding cities', (motion) => {
    const html = renderToStaticMarkup(<BusinessSiteAreas
      areas={[{ id: 'allen', label: 'Allen, TX', href: '/cities/allen-tx' }]}
      appearance={{ motion }}
    />)
    expect(html).toContain(`data-motion="${motion ?? 'none'}"`)
    expect(html).toContain('href="/cities/allen-tx"')
  })

  it('renders every valid area as a crawlable link in the initial HTML', () => {
    const html = renderToStaticMarkup(<BusinessSiteAreas areas={[
      { id: 'allen', label: 'Allen, TX', href: '/cities/allen-tx' },
      { id: 'plano', label: 'Plano, TX', href: '/cities/plano-tx' },
    ]} />)

    expect(html).toContain('<h2>Areas we serve</h2>')
    expect(html).toContain('<strong>2</strong>')
    expect(html).toContain('<span>cities</span>')
    expect(html).toContain('href="/cities/allen-tx"')
    expect(html).toContain('href="/cities/plano-tx"')
    expect(html).toContain('Allen, TX')
  })

  it('renders a gradient background when an end color is given', () => {
    const html = renderToStaticMarkup(<BusinessSiteAreas
      areas={[{ id: 'allen', label: 'Allen, TX', href: '/cities/allen-tx' }]}
      appearance={{ backgroundColor: '#003c3c', gradientEndColor: '#0a1f2e', gradientAngle: 160 }}
    />)

    expect(html).toContain('linear-gradient(160deg, #003c3c, #0a1f2e)')
    expect(html).toContain('data-surface="gradient"')
  })

  it('themes the directory heading separately from the light city panel', () => {
    const html = renderToStaticMarkup(<BusinessSiteAreas
      variant="directory" headingLevel="h1" areas={[{ id: 'allen', label: 'Allen, TX' }]}
      appearance={{ backgroundColor: '#ffffff', textColor: '#12171c', headingBackgroundColor: '#001122',
        headingGradientEndColor: '#234567', headingTextColor: '#ffffff', gradientAngle: 150 }}
    />)
    expect(html).toContain('--pz-business-areas-fill:#ffffff')
    expect(html).toContain('--pz-business-areas-text:#12171c')
    expect(html).toContain('--pz-business-areas-heading-background:#001122')
    expect(html).toContain('--pz-business-areas-heading-fill:linear-gradient(150deg, #001122, #234567)')
    expect(html).toContain('--pz-business-areas-heading-text:#ffffff')
    expect(html).toContain('<h1>Areas we serve</h1>')
    expect(html).toContain('Allen, TX')
  })

  it('falls back to the main palette for missing or unsafe directory heading colors', () => {
    const areas = [{ id: 'allen', label: 'Allen, TX' }]
    const fallback = { backgroundColor: '#eeeeee', textColor: '#112233' }
    const defaults = renderToStaticMarkup(<BusinessSiteAreas variant="directory" areas={areas} appearance={fallback} />)
    const unsafe = renderToStaticMarkup(<BusinessSiteAreas variant="directory" areas={areas}
      appearance={{ ...fallback, headingBackgroundColor: 'url(//evil.example/x)',
        headingGradientEndColor: 'red; color: red', headingTextColor: 'url(//evil.example/y)' }} />)
    for (const html of [defaults, unsafe]) {
      expect(html).toContain('--pz-business-areas-heading-fill:#eeeeee')
      expect(html).toContain('--pz-business-areas-heading-text:#112233')
      expect(html).not.toContain('evil.example')
      expect(html).not.toContain('linear-gradient')
    }
  })

  it('does not apply directory heading colors to the homepage section', () => {
    const html = renderToStaticMarkup(<BusinessSiteAreas
      areas={[{ id: 'allen', label: 'Allen, TX', href: '/cities/allen-tx' }]}
      appearance={{ backgroundColor: '#ffffff', textColor: '#12171c', headingBackgroundColor: '#001122',
        headingGradientEndColor: '#234567', headingTextColor: '#ffffff' }}
    />)
    expect(html).not.toContain('--pz-business-areas-heading-fill:')
    expect(html).not.toContain('--pz-business-areas-heading-background:')
    expect(html).not.toContain('--pz-business-areas-heading-text:')
    expect(html).toContain('--pz-business-areas-fill:#ffffff')
  })

  it('stays a solid color without a gradient end, or with an unsafe one', () => {
    const areas = [{ id: 'allen', label: 'Allen, TX', href: '/cities/allen-tx' }]
    const solid = renderToStaticMarkup(<BusinessSiteAreas areas={areas} appearance={{ backgroundColor: '#003c3c' }} />)
    const unsafe = renderToStaticMarkup(<BusinessSiteAreas
      areas={areas}
      appearance={{ backgroundColor: '#003c3c', gradientEndColor: 'red; background: url(//evil.example/x)' }}
    />)

    expect(solid).not.toContain('linear-gradient')
    expect(solid).toContain('data-surface="solid"')
    expect(unsafe).not.toContain('linear-gradient')
    expect(unsafe).toContain('data-surface="solid"')
    expect(unsafe).not.toContain('evil.example')
  })

  it('does not render an empty section or unsafe links', () => {
    expect(renderToStaticMarkup(<BusinessSiteAreas areas={[]} />)).toBe('')
    expect(renderToStaticMarkup(<BusinessSiteAreas areas={[
      { id: 'unsafe', label: 'Unsafe', href: 'javascript:alert(1)' },
      { id: 'blank', label: ' ', href: '/cities/blank' },
    ]} />)).toBe('')
  })

  it('uses the site appearance and singular city count', () => {
    const html = renderToStaticMarkup(<BusinessSiteAreas
      areas={[{ id: 'allen', label: 'Allen, TX', href: '/cities/allen-tx' }]}
      title="Our service area"
      appearance={{ backgroundColor: '#101820', textColor: '#ffffff', accentColor: '#8cc4ff', density: 'compact' }}
    />)

    expect(html).toContain('<h2>Our service area</h2>')
    expect(html).toContain('<strong>1</strong>')
    expect(html).toContain('<span>city</span>')
    expect(html).toContain('data-density="compact"')
    expect(html).toContain('--pz-business-areas-background:#101820')
    expect(html).toContain('--pz-business-areas-text:#ffffff')
    expect(html).toContain('--pz-business-areas-accent:#8cc4ff')
  })

  it('renders the map slot without moving city links out of the initial HTML', () => {
    const html = renderToStaticMarkup(<BusinessSiteAreas
      areas={[{ id: 'allen', label: 'Allen, TX', href: '/cities/allen-tx' }]}
      map={<div>Map island</div>}
    />)
    expect(html).toContain('data-layout="map"')
    expect(html).toContain('class="pz-business-areas__panel"')
    expect(html).toContain('aria-label="Cities served"')
    expect(html).toContain('data-area-id="allen"')
    expect(html).toContain('href="/cities/allen-tx"')
    expect(html).toContain('Map island')
    expect(html.indexOf('Allen, TX')).toBeLessThan(html.indexOf('Map island'))
    expect(html).not.toContain('class="pz-business-areas__cities"')
  })

  it('uses the list-only layout without a map and supports custom count/eyebrow labels', () => {
    const html = renderToStaticMarkup(<BusinessSiteAreas
      areas={[{ id: 'allen', label: 'Allen, TX', href: '/cities/allen-tx' }]}
      countLabel="locations" eyebrow="Our coverage"
    />)
    expect(html).toContain('data-layout="list"')
    expect(html).not.toContain('class="pz-business-areas__map"')
    expect(html).toContain('Our coverage')
    expect(html).toContain('<span>locations</span>')
  })
})
