import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { fireEvent, render as mount, screen } from '@testing-library/react'
import { BusinessSiteValueShowcase } from './BusinessSiteValueShowcase'
import type { BusinessSiteValueShowcaseProps } from './helpers/types'

const base: BusinessSiteValueShowcaseProps = {
  title: 'Dallas-Fort Worth’s most-hired AC, plumbing & electrical pros',
  lead: 'From HVAC maintenance to water heaters, you’re calling the crew voted Best in DFW People’s Choice, Gold, every year since 2022.',
  seal: { text: 'One of DFW’s most-reviewed pros', iconName: 'award', stars: true },
  highlights: [
    { iconName: 'award', title: 'Best in DFW People’s Choice 2025, Gold', detail: 'Gold every year since 2022' },
    { iconName: 'award', title: 'Consumer Choice Award 2025' },
  ],
  items: [
    { id: 'hvac', iconName: 'thermometer', label: 'Leader', name: 'HVAC maintenance and tune-ups', standing: 'Out of 200+ businesses', proof: 'Backed by 1,700+ DFW reviews' },
    { id: 'elec', iconName: 'bolt', label: 'Leader', name: 'Electrical repair', standing: 'Out of 60+ businesses', proof: 'Trusted in 400+ DFW reviews' },
  ],
  note: 'Grades compare Milestone with Dallas-Fort Worth home service pros, based on homeowner reviews and the jobs they mention.',
}

const render = (props: Partial<BusinessSiteValueShowcaseProps> = {}) => renderToStaticMarkup(<BusinessSiteValueShowcase {...base} {...props} />)

describe('BusinessSiteValueShowcase', () => {
  it('renders one h2, an h3 per card and every part of the section', () => {
    const html = render()
    expect(html.match(/<h2/g)).toHaveLength(1)
    expect(html.match(/<h3/g)).toHaveLength(2)
    expect(html).not.toContain('<h1')
    for (const text of ['One of DFW’s most-reviewed pros', 'Gold every year since 2022', 'Out of 200+ businesses', 'Backed by 1,700+ DFW reviews', 'Leader', 'Grades compare Milestone']) {
      expect(html).toContain(text.replace(/&/g, '&amp;'))
    }
  })

  it('renders nothing without a title, or without any cards and highlights', () => {
    expect(render({ title: ' ' })).toBe('')
    expect(render({ items: [], highlights: [] })).toBe('')
  })

  it('renders highlights only and cards only', () => {
    expect(render({ items: [] })).toContain('__highlights')
    const cardsOnly = render({ highlights: [] })
    expect(cardsOnly).toContain('__cards')
    expect(cardsOnly).not.toContain('__highlights')
  })

  it('drops optional parts cleanly', () => {
    const html = renderToStaticMarkup(<BusinessSiteValueShowcase title={base.title} items={base.items!} />)
    expect(html).toContain('data-seal="false"')
    for (const part of ['__lead', '__seal-text', '__note', 'aria-label="']) expect(html).not.toContain(part)
  })

  it('omits the label badge when an item has none', () => {
    const html = render({ items: [{ id: 'a', name: 'AC repair', standing: 'In top 6%' }] })
    expect(html).not.toContain('__label')
    expect(html).not.toContain('__proof')
  })

  it('keeps the seal text readable and hides only decoration', () => {
    const html = render()
    expect(html).toMatch(/<p class="pz-business-value-showcase__seal"[^>]*>/)
    expect(html).toContain('class="pz-business-value-showcase__seal-stars" aria-hidden="true"')
    expect(render({ seal: { text: 'x', stars: false } })).not.toContain('__seal-stars')
    expect(render({ seal: { text: 'x' } })).not.toContain('__seal-stars')
  })

  it('adds no copy or icon the payload did not send', () => {
    const html = renderToStaticMarkup(<BusinessSiteValueShowcase title="t" seal={{ text: 'Seal' }} highlights={[{ title: 'Award' }]} items={[{ id: 'a', name: 'AC repair', proof: 'p' }]} />)
    for (const part of ['__seal-icon', '__seal-stars', '__highlight-icon', '__medallion', 'aria-label="', 'lucide']) expect(html).not.toContain(part)
    expect(html).not.toContain('data-icon')
    expect(html).not.toContain('data-motion')
    expect(render({ highlightsLabel: 'Awards', itemsLabel: 'Services' })).toMatch(/aria-label="Awards"[\s\S]*aria-label="Services"/)
  })

  it('shifts headings for a nested section', () => {
    const html = render({ headingLevel: 3 })
    expect(html).not.toContain('<h2')
    expect(html.match(/<h4/g)).toHaveLength(2)
  })

  it('maps design-system icon names to Lucide icons', () => {
    const html = render()
    expect(html).toContain('lucide-thermometer')
    expect(html).toContain('lucide-zap')
  })

  it('renders any number of cards and reports the count', () => {
    const items = Array.from({ length: 7 }, (_, index) => ({ id: String(index), name: `Service ${index}`, proof: 'p' }))
    expect(render({ items })).toContain('data-count="7"')
    expect(render({ items: items.slice(0, 1) })).toContain('data-count="1"')
  })

  describe('"View all" in narrow containers', () => {
    const many = Array.from({ length: 6 }, (_, index) => ({ id: `s${index}`, name: `Service ${index}`, standing: 'In top 6%' }))

    it('keeps every card in the page, marks the ones past the visible count, and shows a button', () => {
      mount(<BusinessSiteValueShowcase title="t" items={many} />)
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(6)
      const list = screen.getByRole('list')
      expect(list.querySelectorAll('li[data-collapsible="true"]')).toHaveLength(3)
      expect(list.getAttribute('data-expanded')).toBe('false')
      const button = screen.getByRole('button', { name: 'Show 3 more' })
      expect(button.getAttribute('aria-expanded')).toBe('false')
      expect(button.getAttribute('aria-controls')).toBe(list.id)
    })

    it('toggles between collapsed and expanded', () => {
      mount(<BusinessSiteValueShowcase title="t" items={many} />)
      fireEvent.click(screen.getByRole('button', { name: 'Show 3 more' }))
      expect(screen.getByRole('list').getAttribute('data-expanded')).toBe('true')
      const button = screen.getByRole('button', { name: 'Show fewer' })
      expect(button.getAttribute('aria-expanded')).toBe('true')
      fireEvent.click(button)
      expect(screen.getByRole('list').getAttribute('data-expanded')).toBe('false')
    })

    it('has no button when every card fits, or when the visible count covers them all', () => {
      mount(<BusinessSiteValueShowcase title="t" items={many.slice(0, 3)} />)
      expect(screen.queryByRole('button')).toBeNull()
    })

    it('counts the hidden cards in the default text, not the total', () => {
      mount(<BusinessSiteValueShowcase title="t" items={many} mobileVisibleItems={5} />)
      expect(screen.getByRole('button', { name: 'Show 1 more' })).toBeTruthy()
    })

    it('takes the visible count and button labels from props', () => {
      mount(<BusinessSiteValueShowcase title="t" items={many} mobileVisibleItems={2} showMoreLabel="See {count} more services" showLessLabel="Less" />)
      expect(screen.getByRole('list').querySelectorAll('li[data-collapsible="true"]')).toHaveLength(4)
      fireEvent.click(screen.getByRole('button', { name: 'See 4 more services' }))
      expect(screen.getByRole('button', { name: 'Less' })).toBeTruthy()
    })
  })

  it('sets divider and density from appearance', () => {
    expect(render({ appearance: { divider: false, density: 'compact' } })).toMatch(/data-density="compact"[^>]*data-divider="false"/)
  })
})
