import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { BusinessSiteAreas } from './BusinessSiteAreas'

describe('BusinessSiteAreas', () => {
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
    expect(html).toContain('Cities served')
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
    expect(html).toContain('City served')
    expect(html).toContain('data-density="compact"')
    expect(html).toContain('--pz-business-areas-background:#101820')
    expect(html).toContain('--pz-business-areas-text:#ffffff')
    expect(html).toContain('--pz-business-areas-accent:#8cc4ff')
  })
})
