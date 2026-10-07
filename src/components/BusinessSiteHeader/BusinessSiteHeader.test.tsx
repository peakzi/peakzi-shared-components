/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, expect, it } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BusinessSiteHeader, type BusinessSiteHeaderProps } from './BusinessSiteHeader'

const props: BusinessSiteHeaderProps = {
  logo: {
    src: 'https://res.cloudinary.com/dzinii45g/image/upload/businessLogosProd/r8j3ykzbshxbeo0vtgwr.jpg',
    alt: 'Blue Line Electric',
    homeHref: '/',
    width: 160,
    height: 44,
  },
  menu: [
    { id: 'home', label: 'Home', href: '/' },
    {
      id: 'services',
      label: 'Services',
      href: '/services',
      children: [{ id: 'rewiring', label: 'Rewiring', href: '/services/rewiring' }],
    },
  ],
  actions: [
    { id: 'call', label: 'Call us', href: 'tel:+15551234567', type: 'secondary', iconName: 'phone' },
    { id: 'book', label: 'Book online', href: '/book', type: 'primary', iconName: 'calendar', iconPosition: 'after' },
  ],
}

describe('BusinessSiteHeader', () => {
  it.each([undefined, 'none', 'subtle'] as const)('uses the site motion setting %s without hiding links', (motion) => {
    const html = renderToStaticMarkup(<BusinessSiteHeader {...props} appearance={{ motion }} />)
    expect(html).toContain(`data-motion="${motion ?? 'none'}"`)
    expect(html).toContain('href="/services/rewiring"')
  })

  it.each([[undefined, 'false'], [false, 'false'], [true, 'true']] as const)(
    'pins the header only when sticky is %s',
    (sticky, expected) => {
      const html = renderToStaticMarkup(<BusinessSiteHeader {...props} appearance={{ sticky }} />)
      expect(html).toContain(`data-sticky="${expected}"`)
      expect(html).toContain('href="/services/rewiring"')
    },
  )

  it('server-renders crawlable anchors for the logo, menu, submenu, and actions', () => {
    const html = renderToStaticMarkup(<BusinessSiteHeader {...props} />)
    expect(html).toContain('href="/services/rewiring"')
    expect(html).toContain('href="/book"')
    expect(html).toContain('href="tel:+15551234567"')
    expect(html).toContain('alt="Blue Line Electric"')
    expect(html).toContain('<nav')
  })

  it('marks the active page and exposes submenu links without JavaScript', () => {
    const { container } = render(<BusinessSiteHeader {...props} currentPath="/services/rewiring" />)
    const desktopNav = container.querySelector('.pz-business-header__desktop-nav')!
    expect(within(desktopNav as HTMLElement).getByRole('link', { name: 'Rewiring', hidden: true }))
      .toHaveAttribute('aria-current', 'page')
    expect(desktopNav.querySelector('details')).toBeInTheDocument()
  })

  it('renders a native mobile menu and primary action', () => {
    const { container } = render(<BusinessSiteHeader {...props} />)
    const mobile = container.querySelector('.pz-business-header__mobile-controls')!
    expect(mobile.querySelector('details > summary')).toHaveTextContent('Menu')
    expect(within(mobile as HTMLElement).getAllByRole('link', { name: 'Book online', hidden: true }))
      .toHaveLength(1)
  })

  it('omits an empty mobile menu when the primary action is the only control', () => {
    const { container } = render(<BusinessSiteHeader {...props} menu={[]} actions={[props.actions![1]!]} />)
    expect(container.querySelector('.pz-business-header__mobile-menu')).not.toBeInTheDocument()
    expect(container.querySelector('.pz-business-header__mobile-primary')).toHaveTextContent('Book online')
  })

  it('applies validated appearance options without silently replacing selected colors', () => {
    render(<BusinessSiteHeader {...props} appearance={{ backgroundColor: '#000000', textColor: '#111111', accentColor: '#dddddd', font: 'serif', itemsPosition: 'right', buttonRadius: '8px', density: 'compact', layoutWidth: 'full' }} />)
    const header = screen.getByRole('banner')
    expect(header).toHaveAttribute('data-layout-width', 'full')
    expect(header).toHaveAttribute('data-items-position', 'right')
    expect(header).toHaveAttribute('data-density', 'compact')
    expect(header).toHaveStyle({ '--pz-business-header-background': '#000000' })
    expect(header).toHaveStyle({ '--pz-business-header-text': '#111111' })
    expect(header).toHaveStyle({ '--pz-business-header-radius': '8px' })
  })

  it('keeps the existing contained layout by default', () => {
    render(<BusinessSiteHeader {...props} />)
    expect(screen.getByRole('banner')).toHaveAttribute('data-layout-width', 'contained')
  })

  it('accepts opaque RGB and HSL values for shared appearance settings', () => {
    render(
      <BusinessSiteHeader
        {...props}
        appearance={{ backgroundColor: 'rgba(0, 0, 0, 1)', textColor: 'hsla(0, 0%, 100%, 1)' }}
      />,
    )
    const header = screen.getByRole('banner')
    expect(header).toHaveStyle({ '--pz-business-header-background': '#000000' })
    expect(header).toHaveStyle({ '--pz-business-header-text': '#ffffff' })
  })

  it('accepts a custom font family name and rejects unsafe CSS input', () => {
    const { rerender } = render(<BusinessSiteHeader {...props} appearance={{ font: 'Open Sans' }} />)
    expect(screen.getByRole('banner')).toHaveStyle({ '--pz-business-header-font': '"Open Sans", Arial, sans-serif' })
    rerender(<BusinessSiteHeader {...props} appearance={{ font: 'Open Sans; color: red' }} />)
    expect(screen.getByRole('banner')).toHaveStyle({ '--pz-business-header-font': '"IBM Plex Sans", Arial, sans-serif' })
  })

  it('renders any valid Lucide icon name and ignores unknown names', async () => {
    const { container, rerender } = render(
      <BusinessSiteHeader {...props} actions={[{ id: 'repair', label: 'Repairs', href: '/repairs', type: 'primary', iconName: 'Wrench' }]} />,
    )
    await waitFor(() => expect(container.querySelector('.lucide-wrench')).toBeInTheDocument())
    rerender(<BusinessSiteHeader {...props} actions={[{ id: 'repair', label: 'Repairs', href: '/repairs', type: 'primary', iconName: 'not-a-lucide-icon' }]} />)
    expect(container.querySelector('.lucide-wrench')).not.toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Repairs', hidden: true })).toHaveLength(2)
  })

  it('keeps action text and links in server-rendered HTML while an icon loads', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteHeader {...props} actions={[{ id: 'repair', label: 'Repairs', href: '/repairs', type: 'primary', iconName: 'wrench' }]} />,
    )
    expect(html).toContain('href="/repairs"')
    expect(html).toContain('Repairs')
  })

  it('uses the selected accent for the primary action and active link', () => {
    render(<BusinessSiteHeader {...props} currentPath="/" appearance={{ accentColor: '#a04018' }} />)
    const header = screen.getByRole('banner')
    expect(header).toHaveStyle({ '--pz-business-header-accent': '#a04018' })
    expect(header).toHaveStyle({ '--pz-business-header-link-accent': '#a04018' })
    expect(screen.getAllByRole('link', { name: 'Home', hidden: true })[0])
      .toHaveAttribute('aria-current', 'page')
  })

  it('accepts the four supported button radii and rejects other API values', () => {
    const { rerender } = render(<BusinessSiteHeader {...props} />)
    for (const radius of ['2px', '8px', '16px', '32px'] as const) {
      rerender(<BusinessSiteHeader {...props} appearance={{ buttonRadius: radius }} />)
      expect(screen.getByRole('banner')).toHaveStyle({ '--pz-business-header-radius': radius })
    }
    rerender(<BusinessSiteHeader {...props} appearance={{ buttonRadius: '12px' as never }} />)
    expect(screen.getByRole('banner')).toHaveStyle({ '--pz-business-header-radius': '8px' })
  })

  it('rejects unsafe links, image URLs, and colors from API-supplied configuration', () => {
    const { container } = render(
      <BusinessSiteHeader
        {...props}
        logo={{ ...props.logo, src: 'javascript:alert(1)', homeHref: 'javascript:alert(1)' }}
        menu={[{ id: 'unsafe', label: 'Unsafe', href: 'javascript:alert(1)' }]}
        actions={[{ id: 'unsafe', label: 'Unsafe', href: '//evil.example', type: 'primary' }]}
        appearance={{ backgroundColor: 'red; background:url(evil)', font: 'Arial; color: red' }}
      />,
    )
    expect(screen.getByRole('link', { name: 'Blue Line Electric' })).toHaveAttribute('href', '/')
    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Unsafe' })).not.toBeInTheDocument()
    expect(screen.getByRole('banner')).toHaveStyle({ '--pz-business-header-background': '#ffffff' })
  })

  it('secures external new-tab actions', () => {
    render(<BusinessSiteHeader {...props} actions={[{ id: 'external', label: 'Visit store', href: 'https://example.com', type: 'primary', newTab: true }]} />)
    for (const link of screen.getAllByRole('link', { name: 'Visit store', hidden: true })) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})
