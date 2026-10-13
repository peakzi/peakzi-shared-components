import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { render, screen, within } from '@testing-library/react'
import { BusinessSiteProjectGallery } from './BusinessSiteProjectGallery'
import type { BusinessSiteProjectImage } from './helpers/types'

const items: BusinessSiteProjectImage[] = [
  { src: 'https://example.com/pipe.jpg', alt: 'Before and after replacing copper pipes.', caption: 'Pipe replacement.', location: 'Santa Maria, CA', href: 'https://example.com/pipe.jpg', newTab: true },
  { src: '/heater.jpg', alt: 'A newly installed tankless water heater.', caption: 'Water heater installation.' },
]

describe('BusinessSiteProjectGallery', () => {
  it('renders all photos, captions and locations in semantic server HTML', () => {
    const html = renderToStaticMarkup(<BusinessSiteProjectGallery items={items} />)
    expect(html.match(/<figure /g)).toHaveLength(2)
    expect(html.match(/<figcaption>/g)).toHaveLength(2)
    expect(html).toContain('Pipe replacement.')
    expect(html).toContain('Water heater installation.')
    expect(html).toContain('Santa Maria, CA')
    expect(html).toContain('alt="Before and after replacing copper pipes."')
    expect(html).toContain('loading="lazy" decoding="async"')
    expect(html).not.toContain('<h1')
  })

  it('labels the section by its h2 and exposes native photo links without JavaScript', () => {
    render(<BusinessSiteProjectGallery items={items} />)
    const section = screen.getByRole('region', { name: 'Recent work' })
    const link = within(section).getByRole('link', { name: /Before and after replacing copper pipes/ })
    expect(link).toHaveAttribute('href', items[0]!.href)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveAccessibleName(/opens in a new tab/)
  })

  it('omits empty sections, invalid sources and missing alt text', () => {
    expect(renderToStaticMarkup(<BusinessSiteProjectGallery items={[]} />)).toBe('')
    expect(renderToStaticMarkup(<BusinessSiteProjectGallery items={[
      { src: 'javascript:alert(1)', alt: 'Unsafe image' },
      { src: '//example.com/image.jpg', alt: 'Protocol-relative image' },
      { src: '/photo.jpg', alt: ' ' },
    ]} />)).toBe('')
  })

  it('deduplicates normalized image sources and keeps the first caption', () => {
    const html = renderToStaticMarkup(<BusinessSiteProjectGallery items={[
      ...items, { ...items[0]!, src: ` ${items[0]!.src} `, caption: 'Duplicate caption' },
    ]} />)
    expect(html.match(/<figure /g)).toHaveLength(2)
    expect(html).not.toContain('Duplicate caption')
  })

  it('renders a single photo rather than applying an arbitrary minimum project count', () => {
    expect(renderToStaticMarkup(<BusinessSiteProjectGallery items={[items[0]!]} />)).toContain('<figure ')
  })

  it('allows photos without links, captions or locations', () => {
    const html = renderToStaticMarkup(<BusinessSiteProjectGallery items={[{ src: '/photo.jpg', alt: 'Project photo' }]} />)
    expect(html).toContain('<img ')
    expect(html).not.toContain('<figcaption>')
    expect(html).not.toContain('<a ')
  })

  it.each(['javascript:alert(1)', '//evil.example/photo', 'data:text/html,evil'])('omits unsafe photo destinations %s', (href) => {
    const html = renderToStaticMarkup(<BusinessSiteProjectGallery items={[{ ...items[0]!, href }]} />)
    expect(html).toContain('<img ')
    expect(html).not.toContain('<a ')
    expect(html).not.toContain('pz-business-gallery__expand')
  })

  it('only opens external HTTP destinations in a new tab', () => {
    const html = renderToStaticMarkup(<BusinessSiteProjectGallery items={[{ ...items[0]!, href: '/project-gallery/pipe', newTab: true }]} />)
    expect(html).toContain('href="/project-gallery/pipe"')
    expect(html).not.toContain('target=')
    expect(html).not.toContain('opens in a new tab')
  })

  it('supports a safe view-all link and omits unsafe or blank actions', () => {
    const html = renderToStaticMarkup(<BusinessSiteProjectGallery items={items} viewAll={{ label: 'View projects', href: 'https://example.com/projects', newTab: true }} />)
    expect(html).toContain('href="https://example.com/projects" target="_blank" rel="noopener noreferrer"')
    expect(renderToStaticMarkup(<BusinessSiteProjectGallery items={items} viewAll={{ label: 'View projects', href: 'javascript:alert(1)' }} />)).not.toContain('View projects')
    expect(renderToStaticMarkup(<BusinessSiteProjectGallery items={items} viewAll={{ label: ' ', href: '/projects' }} />)).not.toContain('pz-business-gallery__view-all')
  })

  it('escapes API text instead of interpreting HTML', () => {
    const html = renderToStaticMarkup(<BusinessSiteProjectGallery items={[{ ...items[0]!, caption: '<script>alert(1)</script>' }]} />)
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).not.toContain('<script>')
  })

  it('supports title, section ID, class name, and omitting the eyebrow', () => {
    const html = renderToStaticMarkup(<BusinessSiteProjectGallery items={items} title="Our work" eyebrow="" sectionId="projects" className="custom-gallery" />)
    expect(html).toContain('id="projects"')
    expect(html).toContain('custom-gallery')
    expect(html).toContain('>Our work</h2>')
    expect(html).not.toContain('pz-business-gallery__eyebrow')
    expect(renderToStaticMarkup(<BusinessSiteProjectGallery items={items} title=" " />)).toContain('>Recent work</h2>')
  })

  it('applies website colors, fonts, radius, density and motion without hydration', () => {
    const html = renderToStaticMarkup(<BusinessSiteProjectGallery items={items} appearance={{ font: 'Nunito Sans', headingFont: 'Georgia', backgroundColor: '#12171c', textColor: '#ffffff', accentColor: '#a5c9ee', buttonRadius: '16px', density: 'compact', motion: 'subtle' }} />)
    expect(html).toContain('--pz-business-gallery-background:#12171c')
    expect(html).toContain('--pz-business-gallery-text:#ffffff')
    expect(html).toContain('--pz-business-gallery-accent:#a5c9ee')
    expect(html).toContain('Nunito Sans')
    expect(html).toContain('Georgia')
    expect(html).toContain('--pz-business-gallery-radius:16px')
    expect(html).toContain('data-density="compact"')
    expect(html).toContain('data-motion="subtle"')
  })

  it('uses safe appearance defaults for invalid values', () => {
    const html = renderToStaticMarkup(<BusinessSiteProjectGallery items={items} appearance={{ backgroundColor: 'url(javascript:alert(1))', textColor: 'invalid', accentColor: 'invalid', font: 'bad; color: red' }} />)
    expect(html).toContain('--pz-business-gallery-background:#ffffff')
    expect(html).toContain('--pz-business-gallery-text:#12171c')
    expect(html).toContain('--pz-business-gallery-accent:#1d4f8c')
    expect(html).not.toContain('javascript:')
    expect(html).not.toContain('bad;')
    expect(html).toContain('data-motion="none"')
  })
})
