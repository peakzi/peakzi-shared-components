import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BusinessSiteContentList } from './BusinessSiteContentList'
import type { BusinessSiteContentListItem } from './helpers/types'

const items: BusinessSiteContentListItem[] = [
  { id: '1', title: 'How to fix a leaky faucet', href: '/blogs/1', excerpt: 'A step-by-step guide.', category: 'Plumbing', publishedOn: '2026-01-02' },
  { id: '2', title: 'HVAC maintenance tips', href: '/blogs/2' },
]

describe('BusinessSiteContentList', () => {
  it('defaults to comfortable density and switches to compact via appearance.density', () => {
    const { container: comfortableContainer } = render(<BusinessSiteContentList items={items} />)
    expect(comfortableContainer.querySelector('section')).toHaveAttribute('data-density', 'comfortable')

    const { container: compactContainer } = render(
      <BusinessSiteContentList items={items} appearance={{ density: 'compact' }} />
    )
    expect(compactContainer.querySelector('section')).toHaveAttribute('data-density', 'compact')
  })

  it.each([undefined, 'none', 'subtle'] as const)('uses the site motion setting %s without hiding items', (motion) => {
    const html = renderToStaticMarkup(<BusinessSiteContentList items={items} appearance={{ motion }} />)
    expect(html).toContain(`data-motion="${motion ?? 'none'}"`)
    expect(html).toContain('href="/blogs/1"')
  })

  it('renders title, eyebrow, meta, excerpt, and crawlable links in initial HTML', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteContentList items={items} title="Plumbing tips" eyebrow="Guides" viewAll={{ label: 'View all guides', href: '/blogs' }} />
    )
    expect(html).toContain('Guides')
    expect(html).toContain('<h2')
    expect(html).toContain('Plumbing tips')
    expect(html).toContain('How to fix a leaky faucet')
    expect(html).toContain('A step-by-step guide.')
    expect(html).toContain('Plumbing')
    expect(html).toContain('<time class="pz-business-content-list__date" dateTime="2026-01-02">Jan 2, 2026</time>')
    expect(html).toContain('href="/blogs/1"')
    expect(html).toContain('href="/blogs"')
  })

  it('orders category, reading time, and date in the metadata row', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteContentList
        items={[{ id: '1', title: 'Guide', href: '/blogs/1', category: 'Plumbing', readingTime: '9 min read', publishedOn: '2026-10-05' }]}
      />
    )
    const metaMatch = html.match(/<div class="pz-business-content-list__meta">(.*?)<\/div>/)
    expect(metaMatch).not.toBeNull()
    const meta = metaMatch![1]!
    expect(meta.indexOf('Plumbing')).toBeLessThan(meta.indexOf('9 min read'))
    expect(meta.indexOf('9 min read')).toBeLessThan(meta.indexOf('Oct 5, 2026'))
  })

  it('omits invalid calendar dates', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteContentList items={[{ id: '1', title: 'Guide', href: '/blogs/1', publishedOn: 'not-a-date' }]} />
    )
    expect(html).not.toContain('<time')
  })

  it('renders an item image with data-image-kind="cover"', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteContentList
        items={[{ id: '1', title: 'Guide', href: '/blogs/1', image: { src: 'https://example.com/cover.jpg', alt: 'Cover photo' } }]}
      />
    )
    expect(html).toContain('data-image-kind="cover"')
    expect(html).toContain('src="https://example.com/cover.jpg"')
  })

  it('falls back to fallbackImage with data-image-kind="logo" when the item has no image', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteContentList
        items={[{ id: '1', title: 'Guide', href: '/blogs/1' }]}
        fallbackImage={{ src: '/logo.png', alt: 'Company logo' }}
      />
    )
    expect(html).toContain('data-image-kind="logo"')
    expect(html).toContain('src="/logo.png"')
  })

  it('renders no image when neither item image nor fallbackImage is present', () => {
    const html = renderToStaticMarkup(<BusinessSiteContentList items={[{ id: '1', title: 'Guide', href: '/blogs/1' }]} />)
    expect(html).not.toContain('<img')
    expect(html).not.toContain('pz-business-content-list__media')
  })

  it('omits images entirely when showImages is false even with a fallbackImage set', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteContentList
        items={[{ id: '1', title: 'Guide', href: '/blogs/1', image: { src: 'https://example.com/cover.jpg', alt: 'Cover photo' } }]}
        fallbackImage={{ src: '/logo.png', alt: 'Company logo' }}
        showImages={false}
      />
    )
    expect(html).not.toContain('<img')
  })

  it.each(['javascript:alert(1)', '//evil.example/image', 'data:image/svg+xml,evil'])('never renders an unsafe item image src %s', (src) => {
    const html = renderToStaticMarkup(
      <BusinessSiteContentList items={[{ id: '1', title: 'Guide', href: '/blogs/1', image: { src, alt: 'Unsafe' } }]} />
    )
    expect(html).not.toContain('<img')
  })

  it.each(['javascript:alert(1)', '//evil.example/image', 'data:image/svg+xml,evil'])('never renders an unsafe fallbackImage src %s', (src) => {
    const html = renderToStaticMarkup(
      <BusinessSiteContentList items={[{ id: '1', title: 'Guide', href: '/blogs/1' }]} fallbackImage={{ src, alt: 'Unsafe' }} />
    )
    expect(html).not.toContain('<img')
  })

  it('accepts server-rendered rich content as the excerpt', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteContentList items={[{ id: '1', title: 'Rich excerpt', href: '/blogs/1', excerpt: <strong>Bold text</strong> }]} />
    )
    expect(html).toContain('<strong>Bold text</strong>')
  })

  it('drops items with a blank title and never invents links for unsafe hrefs', () => {
    const { container } = render(
      <BusinessSiteContentList
        items={[
          { id: 'blank', title: ' ', href: '/blogs/blank' },
          { id: 'unsafe', title: 'Unsafe link', href: 'javascript:alert(1)' },
        ]}
      />
    )
    expect(screen.queryByText('Unsafe link')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /unsafe link/i })).toBeNull()
    expect(container.querySelectorAll('a.pz-business-content-list__card')).toHaveLength(0)
    expect(container.querySelectorAll('article.pz-business-content-list__card')).toHaveLength(1)
  })

  it('returns no section when there are no items and no empty message', () => {
    const { container } = render(<BusinessSiteContentList items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the empty message when provided and items is empty', () => {
    render(<BusinessSiteContentList items={[]} emptyMessage="No posts in this category yet." />)
    expect(screen.getByText('No posts in this category yet.')).toBeInTheDocument()
  })

  it('shows skeleton placeholders while loading and hides the view-all link', () => {
    const { container } = render(
      <BusinessSiteContentList isLoading items={[]} loadingCount={4} viewAll={{ label: 'View all', href: '/blogs' }} />
    )
    expect(container.querySelectorAll('.pz-business-content-list__skeleton')).toHaveLength(4)
    expect(screen.queryByRole('link', { name: /view all/i })).toBeNull()
  })

  it('uses site appearance tokens', () => {
    const { container } = render(
      <BusinessSiteContentList
        items={items}
        appearance={{ backgroundColor: '#102030', textColor: '#ffffff', accentColor: '#ff7700', buttonRadius: '16px' }}
      />
    )
    const section = container.querySelector('section')!
    expect(section.getAttribute('style')).toContain('--pz-business-content-list-background: #102030')
    expect(section.getAttribute('style')).toContain('--pz-business-content-list-accent: #ff7700')
    expect(section.getAttribute('style')).toContain('--pz-business-content-list-radius: 16px')
  })

  it('derives text, accent, and the view-all fill from a gradient palette', () => {
    const { container } = render(
      <BusinessSiteContentList
        items={items}
        appearance={{ gradientStartColor: '#17392f', gradientEndColor: '#416951' }}
      />
    )
    const style = container.querySelector('section')!.getAttribute('style')!
    expect(style).toContain('--pz-business-content-list-text: #17392f')
    expect(style).toContain('--pz-business-content-list-accent: #17392f')
    expect(style).toContain('--pz-business-content-list-fill: linear-gradient(135deg, #17392f, #416951)')
  })

  it('ignores textColor/accentColor once a gradient palette is supplied', () => {
    const { container } = render(
      <BusinessSiteContentList
        items={items}
        appearance={{ gradientStartColor: '#17392f', gradientEndColor: '#416951', textColor: '#ff0000', accentColor: '#00ff00' }}
      />
    )
    const style = container.querySelector('section')!.getAttribute('style')!
    expect(style).not.toContain('#ff0000')
    expect(style).not.toContain('#00ff00')
  })
})
