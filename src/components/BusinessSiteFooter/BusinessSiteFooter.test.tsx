import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BusinessSiteFooter, type BusinessSiteFooterProps } from './BusinessSiteFooter'

const props: BusinessSiteFooterProps = {
  businessName: 'Blue Line Electric',
  logo: { src: '/blue-line-logo.svg', alt: 'Blue Line Electric', homeHref: '/', width: 160, height: 44 },
  addressLines: ['123 Example Street', 'Austin, TX 78701'],
  phone: { display: '(512) 555-0188', href: 'tel:+15125550188' },
  columns: [
    { id: 'services', heading: 'Services', links: [
      { id: 'rewiring', label: 'Whole-home rewiring', href: '/services/rewiring' },
    ] },
  ],
  bottomLinks: [{ id: 'privacy', label: 'Privacy policy', href: '/privacy' }],
  attribution: { id: 'peakzi', label: 'Website powered by Peakzi', href: 'https://www.peakzi.me', newTab: true },
  copyrightYear: 2026,
}

describe('BusinessSiteFooter', () => {
  it.each([undefined, 'none', 'subtle'] as const)('uses the site motion setting %s without hiding contact details', (motion) => {
    const html = renderToStaticMarkup(<BusinessSiteFooter {...props} appearance={{ motion }} />)
    expect(html).toContain(`data-motion="${motion ?? 'none'}"`)
    expect(html).toContain('href="tel:+15125550188"')
  })

  it('server-renders crawlable contact details and real navigation links', () => {
    const html = renderToStaticMarkup(<BusinessSiteFooter {...props} />)
    expect(html).toContain('<footer')
    expect(html).toContain('<address>')
    expect(html).toContain('Blue Line Electric')
    expect(html).toContain('123 Example Street')
    expect(html).toContain('href="tel:+15125550188"')
    expect(html).toContain('href="/services/rewiring"')
    expect(html).toContain('href="/privacy"')
    expect(html).toContain('alt="Blue Line Electric"')
    expect(html).toContain('© 2026 Blue Line Electric. All rights reserved.')
    expect(html).not.toContain('href="#"')
  })

  it('opens external attribution safely in a new tab', () => {
    const { container } = render(<BusinessSiteFooter {...props} />)
    const link = container.querySelector('a[href="https://www.peakzi.me"]')
    expect(link?.getAttribute('target')).toBe('_blank')
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('omits unsafe links, images, empty columns, and a non-telephone contact URL', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteFooter
        {...props}
        logo={{ ...props.logo!, src: 'javascript:alert(1)' }}
        phone={{ display: 'Call us', href: 'https://example.com/call' }}
        columns={[
          { id: 'unsafe', heading: 'Unsafe', links: [{ id: 'bad', label: 'Bad', href: 'javascript:alert(1)' }] },
          { id: 'safe', heading: 'Safe', links: [{ id: 'good', label: 'Good', href: '/good' }] },
        ]}
        bottomLinks={[{ id: 'bad-bottom', label: 'Bad bottom', href: '//evil.example' }]}
        attribution={{ id: 'bad-attr', label: 'Bad attribution', href: 'data:text/html,hello' }}
      />,
    )
    expect(html).not.toContain('<img')
    expect(html).not.toContain('href="https://example.com/call"')
    expect(html).not.toContain('Unsafe')
    expect(html).not.toContain('Bad bottom')
    expect(html).not.toContain('Bad attribution')
    expect(html).toContain('href="/good"')
  })

  it('renders a minimal footer without empty navigation or placeholder contact details', () => {
    const html = renderToStaticMarkup(<BusinessSiteFooter businessName="Blue Line Electric" copyrightYear={2026} />)
    expect(html).toContain('Blue Line Electric')
    expect(html).not.toContain('<nav')
    expect(html).not.toContain('href=')
    expect(html).not.toContain('123 Example Street')
  })

  it('validates appearance tokens and preserves an explicitly selected text color', () => {
    const { container } = render(
      <BusinessSiteFooter
        {...props}
        appearance={{
          backgroundColor: '#ffffff',
          textColor: '#ffffff',
          accentColor: 'not-a-color',
          font: 'bad; font-family: injected',
          density: 'compact',
        }}
      />,
    )
    const footer = container.querySelector('footer')!
    expect(footer.dataset.density).toBe('compact')
    expect(footer.style.getPropertyValue('--pz-business-footer-text')).toBe('#ffffff')
    expect(footer.style.getPropertyValue('--pz-business-footer-background')).toBe('#ffffff')
    expect(footer.style.getPropertyValue('--pz-business-footer-font')).toContain('IBM Plex Sans')
  })

  it('preserves the selected text and accent colors even when contrast is low', () => {
    const { container } = render(
      <BusinessSiteFooter
        {...props}
        appearance={{ backgroundColor: '#f1175c', textColor: '#018eed', accentColor: '#f93b06' }}
      />,
    )
    const footer = container.querySelector('footer')!
    expect(footer.style.getPropertyValue('--pz-business-footer-background')).toBe('#f1175c')
    expect(footer.style.getPropertyValue('--pz-business-footer-text')).toBe('#018eed')
    expect(footer.style.getPropertyValue('--pz-business-footer-accent')).toBe('#f93b06')
  })

  it('accepts opaque RGB and HSL values from Storybook color controls', () => {
    const { container, rerender } = render(
      <BusinessSiteFooter
        {...props}
        appearance={{ backgroundColor: 'rgba(255, 255, 255, 1)', textColor: 'hsla(0, 0%, 0%, 1)' }}
      />,
    )
    const footer = container.querySelector('footer')!
    expect(footer.style.getPropertyValue('--pz-business-footer-background')).toBe('#ffffff')
    expect(footer.style.getPropertyValue('--pz-business-footer-text')).toBe('#000000')

    rerender(
      <BusinessSiteFooter
        {...props}
        appearance={{ backgroundColor: 'hsla(0, 0%, 0%, 1)', textColor: 'rgba(255, 255, 255, 1)' }}
      />,
    )
    expect(footer.style.getPropertyValue('--pz-business-footer-background')).toBe('#000000')
    expect(footer.style.getPropertyValue('--pz-business-footer-text')).toBe('#ffffff')
  })
})
