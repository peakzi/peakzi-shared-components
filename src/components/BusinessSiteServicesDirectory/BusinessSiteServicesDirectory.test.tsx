import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BusinessSiteServicesDirectory } from './BusinessSiteServicesDirectory'
import type { BusinessSiteServiceGroup } from '../BusinessSiteServices/helpers/types'

const groups: BusinessSiteServiceGroup[] = [
  { id: 'plumbing', trade: 'Plumbing', title: 'Our Plumbing services in Roanoke', services: [
    { id: 'water', title: 'Water heater', href: '/services/Plumbing/Water-Heater?domain=client.example', tiers: [{ label: 'Repair', value: '$99' }] },
    { id: 'drain', title: 'Drain cleaning', href: '/services/Plumbing/Drain-Cleaning' },
  ] },
  { id: 'hvac', trade: 'HVAC', title: 'Our HVAC services in Roanoke', services: [
    { id: 'ac', title: 'AC repair', href: '/services/HVAC/AC-Repair' },
    { id: 'vent', title: 'Ventilación', href: '/services/HVAC/Ventilation' },
  ] },
]

describe('BusinessSiteServicesDirectory', () => {
  it('renders all service links, API titles and semantic headings before hydration', () => {
    const html = renderToStaticMarkup(<BusinessSiteServicesDirectory groups={groups} title="Our services" headingLevel="h1" sectionId="directory" />)
    expect(html).toContain('<h1 id="directory-heading">Our services</h1>')
    expect(html).toContain('<h2 id="directory-trade-1-heading">Our Plumbing services in Roanoke</h2>')
    expect(html).toContain('<h3>Water heater</h3>')
    expect(html).toContain('href="/services/Plumbing/Water-Heater?domain=client.example"')
    expect(html).toContain('href="/services/HVAC/AC-Repair"')
    expect(html).toContain('4 services'); expect(html).not.toContain('$99'); expect(html).not.toContain('<table')
    expect(html).not.toMatch(/\shidden=/)
  })
  it('provides stable anchors for each trade and omits navigation for a single trade', () => {
    const { rerender } = render(<BusinessSiteServicesDirectory groups={groups} sectionId="directory" />)
    const nav = screen.getByRole('navigation', { name: 'Browse service trades' })
    expect(within(nav).getByRole('link', { name: 'Plumbing 2' })).toHaveAttribute('href', '#directory-trade-1')
    expect(document.getElementById('directory-trade-1')).toBeInTheDocument()
    rerender(<BusinessSiteServicesDirectory groups={[groups[0]!]} />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
  it.each(['comfortable', 'compact'] as const)('keeps the icon, full API title and count without repeated labels or ordinals in %s', (density) => {
    const title = 'Our Plumbing services in Denver-Aurora-Centennial'
    render(<BusinessSiteServicesDirectory groups={[{ ...groups[0]!, title }]} headingLevel="h1" appearance={{ density }} />)
    const trade = screen.getByRole('region', { name: title })
    expect(within(trade).getByRole('heading', { level: 2, name: title })).toBeInTheDocument()
    expect(within(trade).getByText('2')).toBeInTheDocument()
    expect(trade.querySelector('.pz-services-directory__trade-icon svg')).toBeInTheDocument()
    expect(within(trade).queryByText('Plumbing', { exact: true })).not.toBeInTheDocument()
    expect(trade.querySelector('.pz-services-directory__ordinal')).not.toBeInTheDocument()
    expect(trade.querySelector('.pz-services-directory__trade-label')).not.toBeInTheDocument()
  })
  it('filters individual services without changing their original URL or the input focus', () => {
    render(<BusinessSiteServicesDirectory groups={groups} />)
    const search = screen.getByRole('searchbox', { name: 'Search services' })
    search.focus(); fireEvent.change(search, { target: { value: '  WATER   ' } })
    expect(screen.getByRole('link', { name: 'Water heater' })).toHaveAttribute('href', '/services/Plumbing/Water-Heater?domain=client.example')
    expect(screen.queryByRole('link', { name: 'AC repair' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('1 of 4 services match your search')
    expect(screen.getByRole('region', { name: 'Our Plumbing services in Roanoke' })).toHaveAttribute('data-filtered', 'true')
    expect(search).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: 'Clear service search' }))
    expect(search).toHaveValue(''); expect(search).toHaveFocus()
    expect(screen.getByRole('region', { name: 'Our Plumbing services in Roanoke' })).not.toHaveAttribute('data-filtered')
    expect(screen.getByRole('link', { name: 'AC repair' })).toBeInTheDocument()
  })
  it.each(['HVAC', 'hvac ac', 'ventilacion'])('matches trade names, multiple words and normalized accents: %s', (query) => {
    render(<BusinessSiteServicesDirectory groups={groups} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: query } })
    expect(screen.queryByRole('link', { name: 'Water heater' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0)
    expect(screen.queryByText('No matching services')).not.toBeInTheDocument()
  })
  it('shows a useful no-results state and supports Escape and Clear search', () => {
    render(<BusinessSiteServicesDirectory groups={groups} />)
    const search = screen.getByRole('searchbox')
    fireEvent.change(search, { target: { value: 'does not exist' } })
    expect(screen.getByText('No matching services')).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    fireEvent.keyDown(search, { key: 'Escape' })
    expect(search).toHaveValue(''); expect(screen.getByRole('link', { name: 'AC repair' })).toBeInTheDocument()
    fireEvent.change(search, { target: { value: 'still absent' } })
    fireEvent.click(screen.getByRole('button', { name: 'Clear search', exact: true }))
    expect(search).toHaveValue('')
  })
  it('excludes empty groups and retains a factual empty state', () => {
    const { rerender } = render(<BusinessSiteServicesDirectory groups={[{ id: 'empty', trade: 'Electrical', services: [] }, groups[0]!]} />)
    expect(screen.queryByText('Electrical')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    rerender(<BusinessSiteServicesDirectory groups={[]} headingLevel="h1" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Our services' })).toBeInTheDocument()
    expect(screen.getByText('No services to display')).toBeInTheDocument()
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
  })
  it('escapes backend titles and renders unsafe service URLs as noninteractive content', () => {
    const html = renderToStaticMarkup(<BusinessSiteServicesDirectory groups={[{ id: 'x', trade: 'Other', title: '<script>Trade</script>',
      services: [{ id: 's', title: '<script>Service</script>', href: 'javascript:alert(1)' }] }]} />)
    expect(html).toContain('&lt;script&gt;Trade&lt;/script&gt;'); expect(html).not.toContain('<script>')
    expect(html).not.toContain('href="javascript:'); expect(html).toContain('<article class="pz-services-directory__service">')
  })
  it.each(['comfortable', 'compact'] as const)('uses website appearance settings for %s, not a fixed brand palette', (density) => {
    const html = renderToStaticMarkup(<BusinessSiteServicesDirectory groups={groups} appearance={{ density, motion: 'subtle',
      backgroundColor: '#fff8ee', gradientStartColor: '#123456', gradientEndColor: '#456789', font: 'Nunito Sans', headingFont: 'Open Sans', buttonRadius: '16px' }} />)
    expect(html).toContain(`data-density="${density}"`); expect(html).toContain('data-motion="subtle"')
    expect(html).toContain('--pz-business-services-background:#fff8ee')
    expect(html).toContain('linear-gradient(135deg, #123456, #456789)'); expect(html).toContain('--pz-business-services-radius:16px')
    expect(html).toContain('&quot;Nunito Sans&quot;'); expect(html).toContain('&quot;Open Sans&quot;')
  })
})
