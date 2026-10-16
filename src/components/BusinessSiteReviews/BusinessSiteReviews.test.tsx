import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { render, screen } from '@testing-library/react'
import { BusinessSiteReviews } from './BusinessSiteReviews'
import type { BusinessSiteReview } from './helpers/types'

const items: BusinessSiteReview[] = [
  { id: 'alex', reviewerName: 'Alex Morgan', text: 'Clear communication throughout the repair.', rating: 4.5, reviewDate: '2026-09-20' },
  { id: 'sam', reviewerName: 'Sam Rivera', text: 'A helpful explanation of our options.', rating: 4, reviewDate: '2026-09-18' },
]

describe('BusinessSiteReviews', () => {
  it('renders every review in semantic server HTML without duplicating the featured review', () => {
    const html = renderToStaticMarkup(<BusinessSiteReviews items={items} />)
    expect(html.match(/<blockquote>/g)).toHaveLength(2)
    expect(html.match(/Clear communication throughout the repair\./g)).toHaveLength(1)
    expect(html).toContain('A helpful explanation of our options.')
    expect(html).toContain('<figcaption>')
    expect(html).toContain('<time dateTime="2026-09-20">Sep 20, 2026</time>')
    expect(html).toContain('aria-label="4.5 out of 5 stars"')
    expect(html).not.toContain('<h1')
    expect(html).not.toContain('Google')
  })

  it('removes duplicate IDs and identical reviews with different IDs or whitespace', () => {
    const html = renderToStaticMarkup(<BusinessSiteReviews items={[
      ...items,
      { ...items[0]!, id: 'clone', text: ' Clear  communication throughout the repair. ', reviewerName: ' alex MORGAN ' },
      { ...items[1]!, text: 'Updated duplicate record.' },
    ]} />)
    expect(html.match(/<blockquote>/g)).toHaveLength(2)
    expect(html).not.toContain('Updated duplicate record.')
  })

  it('does not combine different reviewers just because their review text matches', () => {
    const html = renderToStaticMarkup(<BusinessSiteReviews items={[
      items[0]!, { ...items[0]!, id: 'different-author', reviewerName: 'Another customer' },
    ]} />)
    expect(html.match(/<blockquote>/g)).toHaveLength(2)
  })

  it('omits empty sections and blank reviews', () => {
    expect(renderToStaticMarkup(<BusinessSiteReviews items={[]} />)).toBe('')
    expect(renderToStaticMarkup(<BusinessSiteReviews items={[{ id: 'blank', text: ' ' }]} />)).toBe('')
  })

  it('keeps a single review full-width without empty cards', () => {
    const html = renderToStaticMarkup(<BusinessSiteReviews items={[items[0]!]} />)
    expect(html).toContain('data-single="true"')
    expect(html.match(/<li>/g)).toHaveLength(1)
  })

  it('uses matching list rows rather than a large featured quote in compact density', () => {
    const html = renderToStaticMarkup(<BusinessSiteReviews items={items} appearance={{ density: 'compact' }} />)
    expect(html).not.toContain('pz-business-reviews__featured')
    expect(html).not.toContain('pz-business-reviews__avatar')
    expect(html.match(/<blockquote>/g)).toHaveLength(2)
  })

  it('uses backend totals rather than the number of displayed reviews', () => {
    render(<BusinessSiteReviews items={items} summary={{ rating: 4.9, reviewCount: 1200 }} />)
    expect(screen.getByText('1,200 reviews')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '4.9 out of 5 stars' })).toBeInTheDocument()
  })

  it('supports count-only, rating-only and known-source summaries', () => {
    expect(renderToStaticMarkup(<BusinessSiteReviews items={items} summary={{ reviewCount: 1 }} />)).toContain('1 review')
    expect(renderToStaticMarkup(<BusinessSiteReviews items={items} summary={{ rating: 0 }} />)).toContain('0 out of 5 stars')
    expect(renderToStaticMarkup(<BusinessSiteReviews items={items} summary={{ reviewCount: 10, label: 'Google reviews' }} />)).toContain('10 Google reviews')
  })

  it('omits fabricated or invalid summary values', () => {
    const html = renderToStaticMarkup(<BusinessSiteReviews items={items} summary={{ rating: NaN, reviewCount: -1 }} />)
    expect(html).not.toContain('pz-business-reviews__summary')
    expect(html).not.toContain('NaN')
  })

  it('does not invent missing reviewer names, ratings or dates', () => {
    const html = renderToStaticMarkup(<BusinessSiteReviews items={[{ id: 'unknown', text: 'A genuine review.' }]} />)
    expect(html).toContain('A genuine review.')
    expect(html).not.toContain('out of 5 stars')
    expect(html).not.toContain('<time')
    expect(html).not.toContain('Anonymous')
    expect(html).not.toContain('pz-business-reviews__avatar')
  })

  it.each(['invalid', '2026-02-30', '2030-13-01'])('omits invalid dates %s without removing the review', (reviewDate) => {
    const html = renderToStaticMarkup(<BusinessSiteReviews items={[{ ...items[0]!, reviewDate }]} />)
    expect(html).toContain(items[0]!.text)
    expect(html).not.toContain('<time')
  })

  it('formats ISO timestamps consistently without depending on the server timezone', () => {
    const html = renderToStaticMarkup(<BusinessSiteReviews items={[{ ...items[0]!, reviewDate: '2026-09-20T23:30:00-07:00' }]} />)
    expect(html).toContain('<time dateTime="2026-09-20">Sep 20, 2026</time>')
  })

  it('labels multiple sections independently and supports caller titles and IDs', () => {
    const { container } = render(<>
      <BusinessSiteReviews items={items} title="Customer feedback" sectionId="reviews" />
      <BusinessSiteReviews items={items} title=" " />
    </>)
    const sections = [...container.querySelectorAll('section')]
    expect(sections[0]).toHaveAttribute('id', 'reviews')
    expect(sections[0]!.getAttribute('aria-labelledby')).not.toBe(sections[1]!.getAttribute('aria-labelledby'))
    for (const section of sections) expect(document.getElementById(section.getAttribute('aria-labelledby')!)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'What our customers say' })).toBeInTheDocument()
  })

  it('escapes API review text instead of executing HTML', () => {
    const html = renderToStaticMarkup(<BusinessSiteReviews items={[{ id: 'unsafe', text: '<script>alert(1)</script>', reviewerName: '<img src=x onerror=alert(1)>' }]} />)
    expect(html).toContain('&lt;script&gt;')
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<img')
  })

  it('highlights supplied phrases without changing the text, casing or punctuation', () => {
    render(<BusinessSiteReviews items={[{ ...items[0]!, highlightedPhrases: ['clear communication', 'repair', 'not in this review'] }]} />)
    const quote = screen.getByText('Clear communication', { selector: 'mark' }).closest('blockquote')!
    expect(quote.textContent).toBe(items[0]!.text)
    expect([...quote.querySelectorAll('mark')].map((mark) => mark.textContent)).toEqual(['Clear communication', 'repair'])
  })

  it('keeps highlights in compact density and never interprets highlighted HTML', () => {
    const html = renderToStaticMarkup(<BusinessSiteReviews items={[{ id: 'unsafe', text: '<img src=x> is literal review copy.', highlightedPhrases: ['<img src=x>'] }]} appearance={{ density: 'compact' }} />)
    expect(html).toContain('<mark>&lt;img src=x&gt;</mark>')
    expect(html).not.toContain('<img')
    expect(html).not.toContain('pz-business-reviews__featured')
  })

  it('counts tags once per unique displayed review, not against the overall total', () => {
    const review = { ...items[0]!, tags: ['Service', ' service ', 'Quality of Work'] }
    render(<BusinessSiteReviews items={[review, { ...review, id: 'duplicate' }, { ...items[1]!, tags: ['Service'] }]} summary={{ reviewCount: 1200 }} />)
    const mentions = screen.getByRole('list', { name: 'Customer mentions' })
    expect([...mentions.querySelectorAll('li')].map((item) => item.textContent)).toEqual(['Service2', 'Quality of Work1'])
    expect(screen.getByText('Based on the reviews shown here.')).toBeInTheDocument()
    expect(screen.getByText('1,200 reviews')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Customer reviews' }).children).toHaveLength(2)
  })

  it('uses all supplied aggregate metrics instead of counting the displayed review tags', () => {
    render(<BusinessSiteReviews items={[{ ...items[0]!, tags: ['Service', 'Service', 'Displayed only'] }]} summary={{
      mentionCounts: {
        'Overall experience': 934,
        Professionalism: 2345,
        Service: 1872,
        'Quality of Work': 1851,
        'Brand Loyalty': 1325,
        Punctuality: 935,
      },
    }} />)
    const mentions = screen.getByRole('list', { name: 'Customer mentions' })
    expect([...mentions.querySelectorAll('li')].map((item) => item.textContent)).toEqual([
      'Professionalism2345', 'Service1872', 'Quality of Work1851',
      'Brand Loyalty1325', 'Punctuality935', 'Overall experience934',
    ])
    expect(screen.getByText('Based on all customer reviews.')).toBeInTheDocument()
    expect(screen.queryByText('Based on the reviews shown here.')).not.toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Customer reviews' }).children).toHaveLength(1)
  })

  it.each([{}, { ' ': 20, Zero: 0, Negative: -1, Fraction: 1.5, Invalid: NaN }])(
    'does not fall back to displayed tags when supplied aggregate metrics are empty or invalid', (mentionCounts) => {
      render(<BusinessSiteReviews items={[{ ...items[0]!, tags: ['Service'] }]} summary={{ mentionCounts }} />)
      expect(screen.queryByRole('list', { name: 'Customer mentions' })).not.toBeInTheDocument()
    },
  )

  it('omits customer mentions when no nonblank tags are supplied', () => {
    const html = renderToStaticMarkup(<BusinessSiteReviews items={[{ ...items[0]!, tags: [' ', ''] }]} />)
    expect(html).not.toContain('Customers mention')
    expect(html).not.toContain('Customer mentions')
    expect(html).toContain(items[0]!.text)
  })

  it('escapes tag labels instead of creating links or HTML', () => {
    const html = renderToStaticMarkup(<BusinessSiteReviews items={[{ ...items[0]!, tags: ['<script>unsafe</script>'] }]} />)
    expect(html).toContain('&lt;script&gt;unsafe&lt;/script&gt;')
    expect(html).not.toContain('<script>')
  })

  it('puts the heading, totals, mentions and action in the summary panel', () => {
    const { container } = render(<BusinessSiteReviews items={[{ ...items[0]!, tags: ['Service'] }]} title="Recent customer reviews" summary={{ rating: 4.9, reviewCount: 1200 }} viewAll={{ label: 'See all reviews', href: '/reviews' }} />)
    const aside = container.querySelector('.pz-business-reviews__aside')!
    expect(aside.querySelector('h2')?.textContent).toBe('Recent customer reviews')
    expect(aside).toContainElement(screen.getByRole('img', { name: '4.9 out of 5 stars' }))
    expect(aside).toContainElement(screen.getByRole('list', { name: 'Customer mentions' }))
    expect(aside).toContainElement(screen.getByRole('link', { name: 'See all reviews' }))
    expect(container.querySelectorAll('.pz-business-reviews__featured')).toHaveLength(1)
  })

  it('validates optional review links and secures new tabs', () => {
    render(<BusinessSiteReviews items={items} viewAll={{ label: 'Read more reviews', href: 'https://example.com/reviews', newTab: true }} />)
    const link = screen.getByRole('link', { name: 'Read more reviews' })
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveAttribute('target', '_blank')
    expect(renderToStaticMarkup(<BusinessSiteReviews items={items} viewAll={{ label: 'Unsafe', href: 'javascript:alert(1)' }} />)).not.toContain('pz-business-reviews__view-all')
    expect(renderToStaticMarkup(<BusinessSiteReviews items={items} viewAll={{ label: ' ', href: '/reviews' }} />)).not.toContain('<a')
  })

  it('passes website colors, fonts, radius, density and motion to the section', () => {
    const html = renderToStaticMarkup(<BusinessSiteReviews items={items} appearance={{
      font: 'Nunito Sans', headingFont: 'Archivo', backgroundColor: '#ffffff', gradientStartColor: '#12171c',
      gradientEndColor: '#716a64', buttonRadius: '32px', density: 'compact', motion: 'subtle',
    }} />)
    expect(html).toContain('--pz-business-reviews-background:#ffffff')
    expect(html).toContain('--pz-business-reviews-text:#12171c')
    expect(html).toContain('--pz-business-reviews-gradient-end:#716a64')
    expect(html).toContain('--pz-business-reviews-radius:32px')
    expect(html).toContain('Nunito Sans')
    expect(html).toContain('data-density="compact"')
    expect(html).toContain('data-motion="subtle"')
  })

  it.each(['comfortable', 'compact'] as const)('keeps complete server HTML when motion is enabled in %s density', (density) => {
    const props = {
      items: [{ ...items[0]!, text: items[0]!.text.repeat(12), tags: ['Communication'] }],
      summary: { rating: 4.9, reviewCount: 125 },
      viewAll: { label: 'See all reviews', href: '/reviews' },
    }
    const animated = renderToStaticMarkup(<BusinessSiteReviews {...props} appearance={{ density, motion: 'subtle' }} />)
    const staticHtml = renderToStaticMarkup(<BusinessSiteReviews {...props} appearance={{ density, motion: 'none' }} />)
    expect(animated.replace('data-motion="subtle"', 'data-motion="none"')).toBe(staticHtml)
    expect(animated).toContain(props.items[0]!.text)
    expect(animated).toContain('href="/reviews"')
  })

  it.each(['comfortable', 'compact'] as const)('keeps summary and review content server-rendered with a three-color palette in %s density', (density) => {
    const html = renderToStaticMarkup(<BusinessSiteReviews
      items={[{ ...items[0]!, tags: ['Communication'] }]}
      title="Recent customer reviews"
      summary={{ rating: 4.9, reviewCount: 1200 }}
      viewAll={{ label: 'See all reviews', href: '/reviews' }}
      appearance={{ density, backgroundColor: '#ffffff', gradientStartColor: '#12171c', gradientEndColor: '#716a64' }}
    />)
    expect(html).toContain('--pz-business-reviews-summary-fill:linear-gradient(135deg, #12171c, #716a64)')
    expect(html).toContain('--pz-business-reviews-background:#ffffff')
    expect(html).toContain('Customers mention')
    expect(html).toContain('Recent customer reviews')
    expect(html).toContain('1,200 reviews')
    expect(html).toContain(items[0]!.text)
    expect(html).toContain('href="/reviews"')
  })

  it('falls back from unsafe appearance input and uses readable avatar text', () => {
    const html = renderToStaticMarkup(<BusinessSiteReviews items={items} appearance={{ backgroundColor: 'url(unsafe)', font: 'bad; font', gradientStartColor: '#ffffff' }} />)
    expect(html).not.toContain('unsafe')
    expect(html).not.toContain('bad; font')
    expect(html).toContain('--pz-business-reviews-avatar-text:#000000')
    expect(html).toContain('data-motion="none"')
  })
})
