import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { render, screen } from '@testing-library/react'
import { BusinessSiteAbout, type BusinessSiteAboutProps } from './BusinessSiteAbout'

const props: BusinessSiteAboutProps = {
  headline: 'About the company', businessName: 'Client Company', description: 'An introduction from the company.',
  sectionId: 'about',
  sections: [
    { id: 'who-we-are', title: 'Who we are', content: <p>Our <strong>company story</strong>.</p> },
    { id: 'why-choose-us', title: 'Why choose us', content: <><p>First supplied paragraph.</p><p>Second supplied paragraph.</p></> },
    { id: 'our-promise', title: 'Our promise', content: <p>Our supplied promise.</p> },
    { id: 'our-motto', title: 'Our motto', content: <p>Our supplied motto.</p> },
    { id: 'awards-and-certifications', title: 'Credentials', content: <p>Our supplied credentials.</p> },
  ],
  actions: [
    { id: 'book', label: 'Book service', href: 'https://booking.example/', type: 'secondary', newTab: true },
    { id: 'call', label: 'Call now', desktopLabel: '(800) 555-0142', href: 'tel:8005550142', type: 'primary', iconName: 'phone' },
  ],
  cta: { title: 'Speak with us', description: 'Our supplied invitation.', placement: 'about-us-end' },
  appearance: {
    backgroundColor: '#ffffff', textColor: '#17324d', darkBackgroundColor: '#091020',
    gradientEndColor: '#294d6d', textOnDark: '#ffffff', accentColor: '#efbf57',
    font: 'system-ui', headingFont: 'cursive', buttonRadius: '16px', motion: 'none',
  },
}

describe('BusinessSiteAbout', () => {
  it('keeps complete company content in semantic server HTML with one page heading', () => {
    const html = renderToStaticMarkup(<BusinessSiteAbout {...props} />)
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain('Our <strong>company story</strong>.')
    for (const text of ['First supplied paragraph.', 'Second supplied paragraph.', 'Our supplied promise.', 'Our supplied motto.', 'Our supplied credentials.']) expect(html).toContain(text)
    expect([...html.matchAll(/data-section="([^"]+)"/g)].map((match) => match[1])).toEqual([
      'our-motto', 'who-we-are', 'our-promise', 'why-choose-us', 'awards-and-certifications',
    ])
    expect(html).toContain('What sets Client Company apart')
  })
  it('uses the page surface for the hero and leaves no photo placeholder by default', () => {
    const html = renderToStaticMarkup(<BusinessSiteAbout {...props} />)
    expect(html).toContain('data-surface="surface"')
    expect(html).toContain('data-layout="flat"')
    expect(html).not.toContain('pz-business-hero__media')
    expect(html).not.toContain('<img')
    expect(html).not.toContain('data-surface="soft"')
  })
  it('renders a photo only when explicitly supplied', () => {
    const html = renderToStaticMarkup(<BusinessSiteAbout {...props} image={{ src: 'https://images.example/about-team.jpg', alt: 'Company-provided About photo', caption: 'Our team at work.' }} />)
    expect(html).toContain('src="https://images.example/about-team.jpg"')
    expect(html).toContain('alt="Company-provided About photo"')
    expect(html).toContain('<figcaption class="pz-business-hero__caption">Our team at work.</figcaption>')
    expect(html.match(/Our team at work\./g)).toHaveLength(1)
    expect(html).toContain('data-layout="split"')
  })
  it('rejects an unsafe optional image without leaving an empty column', () => {
    const html = renderToStaticMarkup(<BusinessSiteAbout {...props} image={{ src: 'javascript:alert(1)', alt: 'Invalid image', caption: 'Hidden caption' }} />)
    expect(html).not.toContain('javascript:')
    expect(html).not.toContain('Hidden caption')
    expect(html).not.toContain('pz-business-hero__media')
    expect(html).toContain('data-layout="flat"')
  })
  it('omits missing and blank sections, does not duplicate kinds, and creates no badges or membership links', () => {
    const html = renderToStaticMarkup(<BusinessSiteAbout {...props} sections={[
      props.sections[0]!, { ...props.sections[0]!, content: 'Duplicate story' },
      { id: 'our-promise', title: 'Our promise', content: ' ' },
    ]} cta={undefined} />)
    expect(html).not.toContain('Duplicate story')
    expect(html).not.toContain('pz-business-about__promise')
    expect(html).not.toContain('pz-business-about__motto')
    expect(html).not.toContain('Awards and certifications')
    expect(html).not.toContain('pz-business-cta')
    expect(html).toContain('data-paired="false"')
    expect(html).not.toContain('/membership')
  })
  it('uses supplied website colors, fonts, radius and density throughout its composed elements', () => {
    const html = renderToStaticMarkup(<BusinessSiteAbout {...props} appearance={{ ...props.appearance, density: 'compact' }} />)
    for (const value of ['background:#ffffff', 'text:#17324d', 'dark:#091020', 'gradient-end:#294d6d', 'on-dark:#ffffff',
      'accent:#efbf57', 'font:system-ui', 'heading-font:cursive', 'radius:16px']) expect(html).toContain('--pz-business-about-' + value)
    expect(html).toContain('--pz-business-hero-accent:#efbf57')
    expect(html).toContain('--pz-business-cta-accent:#efbf57')
    expect(html).toContain('data-cta-variant="direct-line"')
    expect(html).toContain('data-density="compact"')
  })
  it('keeps desktop phone labels, mobile labels and caller-owned contact destinations', () => {
    const html = renderToStaticMarkup(<BusinessSiteAbout {...props} />)
    expect(html).toContain('(800) 555-0142')
    expect(html).toContain('Call now')
    expect(html).toContain('href="tel:8005550142"')
    expect(html).toContain('href="https://booking.example/"')
    expect(html).toContain('target="_blank" rel="noopener noreferrer"')
    expect(html).toContain('data-cta-placement="about-us-end"')
  })
  it('omits the closing CTA when no valid contact action exists', () => {
    expect(renderToStaticMarkup(<BusinessSiteAbout {...props} actions={[]} />)).not.toContain('pz-business-cta')
    expect(renderToStaticMarkup(<BusinessSiteAbout {...props} actions={[{ id: 'unsafe', label: 'Unsafe', href: 'javascript:alert(1)', type: 'primary' }]} />)).not.toContain('javascript:')
  })
  it('preserves literal untrusted strings and rejects appearance injection', () => {
    const html = renderToStaticMarkup(<BusinessSiteAbout {...props} sections={[
      { id: 'who-we-are', title: 'Who we are', content: '<script>literal copy</script>' },
    ]} appearance={{ ...props.appearance, backgroundColor: 'url(unsafe)', font: 'bad;color:red' }} />)
    expect(html).toContain('&lt;script&gt;literal copy&lt;/script&gt;')
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('url(unsafe)')
    expect(html).not.toContain('bad;color:red')
  })
  it('labels independent instances without duplicate heading IDs', () => {
    const { container } = render(<><BusinessSiteAbout {...props} sectionId={undefined} /><BusinessSiteAbout {...props} sectionId={undefined} /></>)
    const ids = [...container.querySelectorAll('[id]')].map((el) => el.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const section of container.querySelectorAll('section[aria-labelledby]')) {
      expect(document.getElementById(section.getAttribute('aria-labelledby')!)).toBeInTheDocument()
    }
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(2)
  })
  it.each(['none', 'subtle'] as const)('keeps content complete with %s motion', (motion) => {
    const html = renderToStaticMarkup(<BusinessSiteAbout {...props} appearance={{ ...props.appearance, motion }} />)
    expect(html).toContain('Our supplied credentials.')
    expect(html).toContain('Our supplied motto.')
  })
})
