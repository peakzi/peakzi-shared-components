import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BusinessSiteContentList } from './BusinessSiteContentList'
import type { BusinessSiteContentListItem } from './helpers/types'

const items: BusinessSiteContentListItem[] = [
  { id: '1', title: 'How to fix a leaky faucet', href: '/blogs/1', excerpt: 'A step-by-step guide.', category: 'Plumbing', date: 'Jan 2, 2026' },
  { id: '2', title: 'HVAC maintenance tips', href: '/blogs/2' },
]

describe('BusinessSiteContentList', () => {
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
    expect(html).toContain('Jan 2, 2026')
    expect(html).toContain('href="/blogs/1"')
    expect(html).toContain('href="/blogs"')
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

  it('renders optional thumbnails only with valid image data', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteContentList
        items={[{
          id: '1', title: 'With image', href: '/blogs/1',
          image: { src: '/thumb.jpg', alt: 'A thumbnail', width: 640, height: 400 },
        }]}
      />
    )
    expect(html).toContain('src="/thumb.jpg"')
    expect(html).toContain('alt="A thumbnail"')

    const unsafe = renderToStaticMarkup(
      <BusinessSiteContentList
        items={[{
          id: '1', title: 'Unsafe image', href: '/blogs/1',
          image: { src: 'javascript:alert(1)', alt: 'Bad', width: 640, height: 400 },
        }]}
      />
    )
    expect(unsafe).not.toContain('<img')
  })

  it('uses site appearance tokens and compact density', () => {
    const { container } = render(
      <BusinessSiteContentList
        items={items}
        appearance={{ backgroundColor: '#102030', textColor: '#ffffff', accentColor: '#ff7700', buttonRadius: '16px', density: 'compact' }}
      />
    )
    const section = container.querySelector('section')!
    expect(section).toHaveAttribute('data-density', 'compact')
    expect(section.getAttribute('style')).toContain('--pz-business-content-list-background: #102030')
    expect(section.getAttribute('style')).toContain('--pz-business-content-list-accent: #ff7700')
    expect(section.getAttribute('style')).toContain('--pz-business-content-list-radius: 16px')
  })
})
