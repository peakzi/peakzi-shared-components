import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BusinessSiteServices } from './BusinessSiteServices'
import type { BusinessSiteServiceGroup } from './helpers/types'

const groups: BusinessSiteServiceGroup[] = [{
  id: 'plumbing',
  trade: 'Plumbing',
  services: [
    { id: 'drains', title: 'Drain cleaning', summary: 'Clear blocked drains.', href: '/services/drains', iconName: 'Waves', actionLabel: 'Explore service' },
    { id: 'heaters', title: 'Water heater repair', href: '/services/heaters' },
  ],
}]

describe('BusinessSiteServices', () => {
  it.each([undefined, 'none', 'subtle'] as const)('uses the site motion setting %s without hiding services', (motion) => {
    const html = renderToStaticMarkup(<BusinessSiteServices groups={groups} appearance={{ motion }} />)
    expect(html).toContain(`data-motion="${motion ?? 'none'}"`)
    expect(html).toContain('href="/services/drains"')
  })

  it('renders trade, count, card headings, copy, and crawlable links in initial HTML', () => {
    const html = renderToStaticMarkup(<BusinessSiteServices groups={groups} title="Our services" viewAll={{ label: 'All services', href: '/services' }} />)
    expect(html).toContain('<h2 class="pz-business-services__title">Our services</h2>')
    expect(html).toContain('<h3>Plumbing</h3>')
    expect(html).toContain('<h4 class="pz-business-services__card-title">Drain cleaning</h4>')
    expect(html).toContain('2 services')
    expect(html).toContain('Clear blocked drains.')
    expect(html).toContain('href="/services/drains"')
    expect(html).toContain('href="/services"')
    expect(html).not.toContain('Example range')
  })

  it('uses h2 trade and h3 service headings when no section title is supplied', () => {
    const html = renderToStaticMarkup(<BusinessSiteServices groups={groups} />)
    expect(html).toContain('<h2>Plumbing</h2>')
    expect(html).toContain('<h3 class="pz-business-services__card-title">Drain cleaning</h3>')
  })

  it('can remove a repeated single trade heading while preserving service heading levels', () => {
    const html = renderToStaticMarkup(<BusinessSiteServices
      groups={groups}
      title="Our Plumbing services in Austin"
      hideSingleGroupHeading
    />)
    expect(html).toContain('data-single-group-heading="hidden"')
    expect(html).not.toContain('<h3>Plumbing</h3>')
    expect(html).toContain('<h3 class="pz-business-services__card-title">Drain cleaning</h3>')

    const multiTrade = renderToStaticMarkup(<BusinessSiteServices
      groups={[...groups, { ...groups[0]!, id: 'hvac', trade: 'HVAC' }]}
      title="Our services in Austin"
      hideSingleGroupHeading
    />)
    expect(multiTrade).toContain('<h3>Plumbing</h3>')
    expect(multiTrade).toContain('<h3>HVAC</h3>')
  })

  it('uses the singular count for a single service', () => {
    const html = renderToStaticMarkup(<BusinessSiteServices groups={[{
      id: 'plumbing', trade: 'Plumbing', services: [groups[0]!.services[0]!],
    }]} />)
    expect(html).toContain('1 service</span>')
  })

  it('can show the full service count when the home page previews fewer cards', () => {
    const html = renderToStaticMarkup(<BusinessSiteServices groups={[{
      id: 'plumbing', trade: 'Plumbing', services: [groups[0]!.services[0]!], totalCount: 7,
    }]} />)
    expect(html).toContain('7 services</span>')
    expect(html).not.toContain('Water heater repair')
  })

  it('omits empty groups and never invents links for unlinked or unsafe services', () => {
    const testGroups: BusinessSiteServiceGroup[] = [
      { id: 'empty', trade: 'Electrical', services: [{ id: 'blank', title: ' ' }] },
      { id: 'real', trade: 'Plumbing', services: [
        { id: 'one', title: 'Leak repair' },
        { id: 'two', title: 'Pipe repair', href: 'javascript:alert(1)', actionLabel: 'Explore' },
      ] },
    ]
    const { container } = render(<BusinessSiteServices groups={testGroups} viewAll={{ label: 'Unsafe', href: 'javascript:alert(1)' }} />)
    expect(screen.queryByText('Electrical')).toBeNull()
    expect(screen.queryByText('1 service')).toBeNull()
    expect(screen.getByText('2 services')).toBeInTheDocument()
    expect(screen.queryByRole('link')).toBeNull()
    expect(container.querySelectorAll('article.pz-business-services__card')).toHaveLength(2)
  })

  it('returns no section when there are no visible services', () => {
    const { container } = render(<BusinessSiteServices groups={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders optional photos and prices only with valid data', () => {
    const html = renderToStaticMarkup(<BusinessSiteServices groups={[{
      id: 'one', trade: 'Plumbing', services: [{
        id: 'heater', title: 'Water heater repair',
        image: { src: '/heater.jpg', alt: 'Water heater in a home', width: 800, height: 500 },
        tiers: [{ label: 'Repair', value: '$150–$300' }, { label: '', value: '$0' }],
      }],
    }]} />)
    expect(html).toContain('src="/heater.jpg"')
    expect(html).toContain('alt="Water heater in a home"')
    expect(html).toContain('$150–$300')
    expect(html).not.toContain('$0')

    const unsafe = renderToStaticMarkup(<BusinessSiteServices groups={[{
      id: 'one', trade: 'Plumbing', services: [{
        id: 'heater', title: 'Water heater repair',
        image: { src: 'javascript:alert(1)', alt: 'Bad', width: 800, height: 500 },
      }],
    }]} />)
    expect(unsafe).not.toContain('<img')
  })

  it('uses site appearance tokens and compact density', () => {
    const { container } = render(<BusinessSiteServices groups={groups} appearance={{
      backgroundColor: '#102030', textColor: '#ffffff', accentColor: '#ff7700', buttonRadius: '16px', density: 'compact',
    }} />)
    const section = container.querySelector('section')!
    expect(section).toHaveAttribute('data-density', 'compact')
    expect(section.getAttribute('style')).toContain('--pz-business-services-background: #102030')
    expect(section.getAttribute('style')).toContain('--pz-business-services-accent: #ff7700')
    expect(section.getAttribute('style')).toContain('--pz-business-services-radius: 16px')
  })
})
