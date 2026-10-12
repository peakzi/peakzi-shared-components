import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { render, screen, within } from '@testing-library/react'
import { BusinessSiteBlogs } from './BusinessSiteBlogs'
import type { BusinessSiteBlog } from './helpers/types'

const items: BusinessSiteBlog[] = [
  { id: 'drain', title: 'Kitchen drain cleaning', href: '/blogs/drain', category: 'Plumbing', publishedOn: '2026-10-05', excerpt: 'Understand safe drain cleaning.' },
  { id: 'heater', title: 'Water heater replacement', href: '/blogs/heater' },
]

describe('BusinessSiteBlogs', () => {
  it.each(['comfortable', 'compact'] as const)('places supplied reading time between category and date in %s mode', (density) => {
    render(<BusinessSiteBlogs items={[
      { ...items[0]!, readingTime: '9 min read' },
      { ...items[0]!, id: 'second', title: 'Second guide', href: '/blogs/second', readingTime: '6 min read' },
    ]} appearance={{ density }} />)
    const section = screen.getByRole('region', { name: 'Helpful resources' })
    const metadata = section.querySelectorAll('.pz-business-blogs__meta')
    expect(metadata).toHaveLength(2)
    expect(Array.from(metadata[0]!.children, (child) => child.textContent)).toEqual(['Plumbing', '9 min read', 'Oct 5, 2026'])
    expect(Array.from(metadata[1]!.children, (child) => child.textContent)).toEqual(['Plumbing', '6 min read', 'Oct 5, 2026'])
  })

  it('allows reading time without a category or date and trims the label', () => {
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={[{ ...items[1]!, readingTime: '  9 min read  ' }]} />)
    expect(html).toContain('pz-business-blogs__reading-time">9 min read</span>')
    expect(html).not.toContain('<time')
  })

  it('omits blank reading time and safely escapes supplied labels', () => {
    expect(renderToStaticMarkup(<BusinessSiteBlogs items={[{ ...items[1]!, readingTime: ' ' }]} />)).not.toContain('pz-business-blogs__meta')
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={[{ ...items[1]!, readingTime: '<script>bad</script>' }]} />)
    expect(html).toContain('&lt;script&gt;bad&lt;/script&gt;')
    expect(html).not.toContain('<script>')
  })

  it('renders semantic server HTML with native links and no images or H1', () => {
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={items} />)
    expect(html.match(/<article /g)).toHaveLength(2)
    expect(html.match(/<h3>/g)).toHaveLength(2)
    expect(html).toContain('Understand safe drain cleaning.')
    expect(html).toContain('<time dateTime="2026-10-05">Oct 5, 2026</time>')
    expect(html).toContain('href="/blogs/drain"')
    expect(html).not.toContain('<img')
    expect(html).not.toContain('<h1')
  })

  it('labels the section and has one keyboard link per guide', () => {
    render(<BusinessSiteBlogs items={items} />)
    const section = screen.getByRole('region', { name: 'Helpful resources' })
    expect(within(section).getAllByRole('link')).toHaveLength(2)
    expect(within(section).getByRole('link', { name: 'Kitchen drain cleaning' })).toHaveAttribute('href', '/blogs/drain')
    expect(within(section).getAllByRole('heading', { level: 3 })).toHaveLength(2)
  })

  it('omits empty sections and blank titles, and deduplicates IDs', () => {
    expect(renderToStaticMarkup(<BusinessSiteBlogs items={[]} />)).toBe('')
    expect(renderToStaticMarkup(<BusinessSiteBlogs items={[{ ...items[0]!, title: ' ' }]} />)).toBe('')
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={[...items, { ...items[0]!, title: 'Duplicate' }]} />)
    expect(html.match(/<article /g)).toHaveLength(2)
    expect(html).not.toContain('Duplicate')
  })

  it.each(['javascript:alert(1)', '//evil.example/blog', 'data:text/html,evil'])('keeps the title but omits unsafe destination %s', (href) => {
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={[{ ...items[0]!, href }]} />)
    expect(html).toContain('Kitchen drain cleaning')
    expect(html).not.toContain('<a ')
    expect(html).not.toContain('Read the guide')
  })

  it.each(['2026-02-30', 'not a date', '2026-10-05T12:00:00Z', ''])('omits invalid calendar dates %s', (publishedOn) => {
    expect(renderToStaticMarkup(<BusinessSiteBlogs items={[{ ...items[0]!, publishedOn }]} />)).not.toContain('<time')
  })

  it('does not invent metadata or a summary', () => {
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={[items[1]!]} />)
    expect(html).not.toContain('pz-business-blogs__meta')
    expect(html).not.toContain('pz-business-blogs__excerpt')
    expect(html).toContain('Water heater replacement')
  })

  it('supports safe view-all and external article links', () => {
    render(<BusinessSiteBlogs items={[{ ...items[0]!, href: 'https://example.com/blog', newTab: true }]} viewAll={{ label: 'All guides', href: 'https://example.com/blogs', newTab: true }} />)
    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
    expect(screen.getByRole('link', { name: /Kitchen drain cleaning.*opens in a new tab/ })).toBeInTheDocument()
  })

  it('keeps local destinations in the same tab and omits unsafe or blank view-all links', () => {
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={[{ ...items[0]!, newTab: true }]} viewAll={{ label: 'All guides', href: 'javascript:alert(1)' }} />)
    expect(html).not.toContain('target=')
    expect(html).not.toContain('All guides')
    expect(renderToStaticMarkup(<BusinessSiteBlogs items={items} viewAll={{ label: ' ', href: '/blogs' }} />)).not.toContain('pz-business-blogs__view-all')
  })

  it('escapes text and accepts non-interactive rich summaries', () => {
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={[{ ...items[0]!, title: '<script>bad</script>', excerpt: <p>A <strong>safe</strong> summary.</p> }]} />)
    expect(html).toContain('&lt;script&gt;bad&lt;/script&gt;')
    expect(html).not.toContain('<script>')
    expect(html).toContain('<strong>safe</strong>')
  })

  it('supports custom headings, section ID and class without an eyebrow', () => {
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={items} title="Our guides" eyebrow="" sectionId="blogs" className="custom" />)
    expect(html).toContain('id="blogs"')
    expect(html).toContain('pz-business-blogs custom')
    expect(html).toContain('>Our guides</h2>')
    expect(html).not.toContain('pz-business-blogs__eyebrow')
    expect(renderToStaticMarkup(<BusinessSiteBlogs items={items} title=" " />)).toContain('>Helpful resources</h2>')
  })

  it('applies website appearance without hydration', () => {
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={items} appearance={{ font: 'Nunito Sans', headingFont: 'Georgia', backgroundColor: '#ffffff', textColor: '#12171c', accentColor: '#1d4f8c', buttonRadius: '16px', density: 'compact', motion: 'subtle' }} />)
    for (const variable of ['background:#ffffff', 'text:#12171c', 'accent:#1d4f8c', 'radius:16px']) expect(html).toContain('--pz-business-blogs-' + variable)
    expect(html).not.toContain('--pz-business-blogs-card-')
    expect(html).toContain('Nunito Sans')
    expect(html).toContain('Georgia')
    expect(html).toContain('data-density="compact"')
    expect(html).toContain('data-motion="subtle"')
  })

  it('uses a featured card and numbered list in comfortable mode but tight rows in compact mode', () => {
    const comfortable = renderToStaticMarkup(<BusinessSiteBlogs items={items} />)
    expect(comfortable).toContain('pz-business-blogs__featured-layout')
    expect(comfortable).toContain('pz-business-blogs__list')
    expect(comfortable).toContain('start="2"')
    expect(comfortable).toContain('>02</span>')
    expect(comfortable).toContain('2 guides')
    expect(comfortable).not.toContain('carousel')
    expect(comfortable).not.toContain('<button')
    const compact = renderToStaticMarkup(<BusinessSiteBlogs items={items} appearance={{ density: 'compact' }} />)
    expect(compact).not.toContain('pz-business-blogs__carousel')
    expect(compact).not.toContain('<button')
    expect(compact).toContain('pz-business-blogs__grid')
    expect(compact.match(/<article /g)).toHaveLength(2)
  })

  it('preserves API order and every article link in server HTML', () => {
    const blogs = Array.from({ length: 5 }, (_, index) => ({ ...items[0]!, id: String(index), title: 'Guide ' + (index + 1), href: '/blogs/' + index }))
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={blogs} />)
    expect(html.match(/<article /g)).toHaveLength(5)
    expect(html).toContain('Guide 5')
    expect(html).toContain('href="/blogs/4"')
    expect(html).toContain('>05</span>')
    expect(html).toContain('5 guides')
    expect(html.indexOf('Guide 1')).toBeLessThan(html.indexOf('Guide 2'))
  })

  it('centers a single featured article without an empty numbered list', () => {
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={[items[0]!]} />)
    expect(html).toContain('data-single="true"')
    expect(html).not.toContain('<button')
    expect(html).not.toContain('<ol')
    expect(html).toContain('1 guide')
  })

  it('uses the company logo only for the featured card when no cover is available', () => {
    render(<BusinessSiteBlogs items={items} fallbackImage={{ src: '/company-logo.png', alt: 'Company logo' }} />)
    expect(screen.getAllByRole('img')).toHaveLength(1)
    expect(screen.getByRole('img', { name: 'Company logo' })).toHaveAttribute('src', '/company-logo.png')
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy')
    expect(screen.getByRole('img').parentElement).toHaveAttribute('data-image-kind', 'logo')
  })

  it('prefers an article cover over the logo and keeps an informative alt', () => {
    render(<BusinessSiteBlogs items={[{ ...items[0]!, coverImage: { src: 'https://example.com/cover.jpg', alt: 'Plumber at work' } }]} fallbackImage={{ src: '/logo.png', alt: 'Company logo' }} />)
    expect(screen.getByRole('img', { name: 'Plumber at work' })).toHaveAttribute('src', 'https://example.com/cover.jpg')
    expect(screen.getByRole('img').parentElement).toHaveAttribute('data-image-kind', 'cover')
  })

  it.each(['javascript:alert(1)', '//evil.example/image', 'data:image/svg+xml,evil'])('uses a safe logo instead of an unsafe cover %s', (src) => {
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={[{ ...items[0]!, coverImage: { src, alt: 'Unsafe cover' } }]} fallbackImage={{ src: '/logo.png', alt: 'Company logo' }} />)
    expect(html).toContain('src="/logo.png"')
    expect(html).toContain('data-image-kind="logo"')
    expect(html).not.toContain(src)
  })

  it('omits media when neither a cover nor a safe company logo exists', () => {
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={items} fallbackImage={{ src: 'javascript:bad', alt: 'Company logo' }} />)
    expect(html).not.toContain('<img')
    expect(html).not.toContain('pz-business-blogs__cover')
    expect(html).toContain('Kitchen drain cleaning')
  })

  it('keeps compact rows image-free and places view-all after the articles', () => {
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={items} fallbackImage={{ src: '/logo.png', alt: 'Company logo' }} appearance={{ density: 'compact' }} viewAll={{ label: 'View all blogs', href: '/blogs' }} />)
    expect(html).not.toContain('<img')
    expect(html).not.toContain('pz-business-blogs__featured-layout')
    expect(html.indexOf('Water heater replacement')).toBeLessThan(html.indexOf('View all blogs'))
  })

  it('uses readable button text for a light client accent', () => {
    expect(renderToStaticMarkup(<BusinessSiteBlogs items={items} appearance={{ accentColor: '#ffff00' }} />)).toContain('--pz-business-blogs-on-accent:#000000')
  })

  it('falls back safely for invalid appearance values', () => {
    const html = renderToStaticMarkup(<BusinessSiteBlogs items={items} appearance={{ backgroundColor: 'url(javascript:bad)', textColor: 'invalid', accentColor: 'invalid', font: 'bad; color:red' }} />)
    expect(html).toContain('--pz-business-blogs-background:#ffffff')
    expect(html).toContain('--pz-business-blogs-text:#12171c')
    expect(html).toContain('--pz-business-blogs-accent:#12171c')
    expect(html).not.toContain('javascript:')
    expect(html).not.toContain('bad;')
  })
})
