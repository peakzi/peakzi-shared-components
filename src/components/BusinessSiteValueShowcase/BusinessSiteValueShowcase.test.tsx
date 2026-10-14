import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { fireEvent, render, screen } from '@testing-library/react'
import { BusinessSiteValueShowcase } from './BusinessSiteValueShowcase'
import type { BusinessSiteValueShowcaseProps } from './helpers/types'

const base: BusinessSiteValueShowcaseProps = {
  title: 'Baker Brothers Plumbing, Air & Electric has more homeowner reviews than any other Dallas-Fort Worth home service pro.',
  methodHref: '/how-we-measure',
  gradeChip: 'Elite in 5 Dallas-Fort Worth services',
  trustSignals: [{ label: 'Financing available', kind: 'financing' }],
  summary: { rating: 4.8, reviewCount: 24619, position: '#1 of 377 Dallas-Fort Worth home service pros for review volume' },
  praise: [{ count: 634, text: 'positive reviews praise their quality of work' }, { count: 297, text: 'positive reviews praise their expertise' }],
  action: { label: 'Book online', href: 'https://example.com/book', iconName: 'calendar' },
  items: [
    { id: 'gp', name: 'General plumbing', rank: 'Top 3', badge: 'Elite', proof: '216 homeowner reviews rate this work.' },
    { id: 'wh', name: 'Water heater', rank: 'Top 3', badge: 'Elite', proof: '196 homeowner reviews rate this work.' },
    { id: 'lr', name: 'Leak repair', rank: 'Top 3', badge: 'Elite', proof: '135 homeowner reviews rate this work.' },
    { id: 'tr', name: 'Toilet repairs', rank: 'Top 3', badge: 'Elite', proof: '100 homeowner reviews rate this work.' },
  ],
  note: 'Peakzi compared this business with its peers as of October 2026. The business has no say in the grades.',
}

describe('BusinessSiteValueShowcase', () => {
  it('renders one h2, an h3 per tile and the rating as text', () => {
    const html = renderToStaticMarkup(<BusinessSiteValueShowcase {...base} />)
    expect(html.match(/<h2/g)).toHaveLength(1)
    expect(html.match(/<h3>/g)).toHaveLength(4)
    expect(html).toContain('aria-label="4.8 out of 5 stars"')
    expect(html).toContain('out of 5')
    expect(html).toContain('24,619 homeowner reviews')
    expect(html).not.toContain('<h1')
  })

  it('renders nothing without a title or without any tiles and rating', () => {
    expect(renderToStaticMarkup(<BusinessSiteValueShowcase {...base} title=" " />)).toBe('')
    expect(renderToStaticMarkup(<BusinessSiteValueShowcase {...base} items={[]} summary={{}} />)).toBe('')
  })

  it('never defaults an invalid rating', () => {
    const html = renderToStaticMarkup(<BusinessSiteValueShowcase {...base} summary={{ rating: 7, reviewCount: 10 }} />)
    expect(html).not.toContain('out of 5 stars')
    expect(html).toContain('10 homeowner reviews')
  })

  it('keeps Verified #1 on a #1', () => {
    const html = renderToStaticMarkup(<BusinessSiteValueShowcase {...base} items={[{ id: 'a', name: 'HVAC maintenance', rank: '#1', badge: 'Verified #1', proof: '1,728 homeowner reviews.' }]} />)
    expect(html).toContain('Verified #1')
  })

  it('shows any other badge label as given, including on a #1', () => {
    const html = renderToStaticMarkup(<BusinessSiteValueShowcase {...base} items={[
      { id: 'a', name: 'HVAC maintenance', rank: '#1', badge: 'Most reviewed', proof: '1,728 homeowner reviews.' },
      { id: 'b', name: 'AC repair', rank: 'Top 4', badge: 'Fastest growing', proof: '558 homeowner reviews.' },
    ]} />)
    expect(html).toContain('Most reviewed')
    expect(html).toContain('Fastest growing')
  })

  it('renders a grade badge on a #1 as sent', () => {
    const html = renderToStaticMarkup(<BusinessSiteValueShowcase {...base} items={[{ id: 'a', name: 'HVAC maintenance', rank: '#1', badge: 'Elite', proof: '1,728 homeowner reviews.' }]} />)
    expect(html).toContain('pz-business-value-showcase__badge')
  })

  it('renders zero, one or two praise entries', () => {
    expect(renderToStaticMarkup(<BusinessSiteValueShowcase {...base} praise={[]} />)).not.toContain('__praise')
    expect(renderToStaticMarkup(<BusinessSiteValueShowcase {...base} praise={[base.praise![0]!]} />)).toContain('data-count="1"')
    expect(renderToStaticMarkup(<BusinessSiteValueShowcase {...base} praise={[...base.praise!, { count: 1, text: 'extra' }]} />)).not.toContain('extra')
  })

  it('rejects unsafe action links and adds rel for new tabs', () => {
    expect(renderToStaticMarkup(<BusinessSiteValueShowcase {...base} action={{ label: 'Book', href: 'javascript:alert(1)' }} />)).not.toContain('__action')
    expect(renderToStaticMarkup(<BusinessSiteValueShowcase {...base} action={{ ...base.action!, newTab: true }} />)).toContain('rel="noopener noreferrer"')
  })

  it('keeps every tile in the DOM and toggles the expander', () => {
    render(<BusinessSiteValueShowcase {...base} />)
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4)
    const button = screen.getByRole('button', { name: 'Show 1 more service' })
    expect(button.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('list', { name: 'Graded services' }).getAttribute('data-expanded')).toBe('true')
  })

  it('marks the tile count for the column rules', () => {
    for (const n of [1, 2, 3, 4]) {
      expect(renderToStaticMarkup(<BusinessSiteValueShowcase {...base} items={base.items.slice(0, n)} />)).toContain(`aria-label="Graded services" data-count="${n}"`)
    }
  })

  it('collapses the band to one column when the proof card is empty', () => {
    const html = renderToStaticMarkup(<BusinessSiteValueShowcase {...base} summary={{}} praise={[]} action={undefined} />)
    expect(html).toContain('data-proof="false"')
    expect(html).not.toContain('__proof')
  })

  it('renders up to two actions, first primary and rest secondary, ignoring the deprecated singular action', () => {
    const html = renderToStaticMarkup(<BusinessSiteValueShowcase {...base} action={undefined} actions={[
      { label: 'Book online', href: 'https://example.com/book', iconName: 'calendar', newTab: true },
      { label: 'Call now', href: 'tel:+14692420494', iconName: 'phone' },
      { label: 'Extra', href: 'https://example.com/extra' },
    ]} />)
    expect(html).toContain('__action--primary')
    expect(html).toContain('__action--secondary')
    expect(html).not.toContain('Extra')
  })

  it('renders every trust signal as sent and gives each chip an icon', () => {
    const html = renderToStaticMarkup(<BusinessSiteValueShowcase {...base} trustSignals={[
      { label: 'Financing available', kind: 'financing' },
      { label: 'Book online', kind: 'booking' },
      { label: 'Members save 10%', kind: 'loyalty' },
    ]} />)
    const chips = html.split('aria-label="Grades and trust signals"')[1]!.split('</ul>')[0]!
    expect(chips).toContain('Book online')
    expect(chips.match(/<li>/g)).toHaveLength(4)
    expect(chips.match(/<svg/g)).toHaveLength(4)
  })

  it('omits the expander when every tile fits', () => {
    render(<BusinessSiteValueShowcase {...base} items={base.items.slice(0, 3)} />)
    expect(screen.queryByRole('button')).toBeNull()
  })
})
