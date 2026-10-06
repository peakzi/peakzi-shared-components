import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BusinessSiteHero } from './BusinessSiteHero'
import type { BusinessSiteHeroProps } from './BusinessSiteHero'

const images = [
  { src: '/first.jpg', alt: 'Front of the client home', width: 800, height: 640 },
  { src: '/second.jpg', alt: 'Technician at work', width: 800, height: 640 },
]

const props: BusinessSiteHeroProps = {
  headline: 'Electrical work for your home',
  eyebrow: 'Blue Line Electric',
  answer: 'Local electricians serving Austin with clear estimates.',
  rating: { label: '4.9 / 5 from 596 verified reviews', iconName: 'star', iconPosition: 'before' },
  actions: [
    { id: 'estimate', label: 'Get an estimate', href: '/contact', type: 'primary' },
    { id: 'call', label: 'Call us', href: 'tel:+15125550188', type: 'secondary' },
  ],
  images,
  layout: 'split',
  intervalMs: 0,
}

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('BusinessSiteHero', () => {
  it('puts the h1, answer, rating label, and crawlable actions in initial HTML', () => {
    const html = renderToStaticMarkup(<BusinessSiteHero {...props} />)
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain('Electrical work for your home</h1>')
    expect(html).toContain('Local electricians serving Austin')
    expect(html).toContain('4.9 / 5 from 596 verified reviews')
    expect(html).toContain('lucide-star')
    expect(html).toContain('href="/contact"')
    expect(html).toContain('href="tel:+15125550188"')
    expect(html).toContain('alt="Front of the client home"')
    expect(html).toContain('width="800" height="640"')
  })

  it('requires a real headline and does not emit links or images with unsafe URLs', () => {
    expect(() => renderToStaticMarkup(<BusinessSiteHero headline=" " />)).toThrow('non-empty headline')
    const html = renderToStaticMarkup(<BusinessSiteHero
      {...props}
      actions={[{ id: 'bad', label: 'Bad', href: 'javascript:alert(1)', type: 'primary' }]}
      images={[{ ...images[0]!, src: 'javascript:alert(1)' }]}
    />)
    expect(html).not.toContain('<a ')
    expect(html).not.toContain('<img ')
    expect(html).toContain('data-layout="flat"')
  })

  it('renders the supplied badge label and optional icon in the chosen position', () => {
    const before = renderToStaticMarkup(<BusinessSiteHero {...props} rating={{ label: 'Trusted locally', iconName: 'star' }} />)
    const after = renderToStaticMarkup(<BusinessSiteHero {...props} rating={{ label: 'Trusted locally', iconName: 'star', iconPosition: 'after' }} />)
    expect(before.indexOf('lucide-star')).toBeLessThan(before.indexOf('Trusted locally'))
    expect(after.indexOf('Trusted locally')).toBeLessThan(after.indexOf('lucide-star'))

    const noIcon = renderToStaticMarkup(<BusinessSiteHero {...props} rating={{ label: '  Trusted locally  ' }} />)
    expect(noIcon).toContain('Trusted locally</span>')
    expect(noIcon).not.toContain('lucide-star')
    const blank = renderToStaticMarkup(<BusinessSiteHero {...props} rating={{ label: '  ', iconName: 'star' }} />)
    expect(blank).not.toContain('pz-business-hero__rating"')
  })

  it('accepts other Lucide icon names and ignores unknown names', async () => {
    const { container, rerender } = render(<BusinessSiteHero {...props} rating={{ label: 'Expert service', iconName: 'Wrench' }} />)
    await waitFor(() => expect(container.querySelector('.lucide-wrench')).toBeInTheDocument())
    rerender(<BusinessSiteHero {...props} rating={{ label: 'Expert service', iconName: 'not-a-lucide-icon' }} />)
    expect(container.querySelector('.lucide-wrench')).not.toBeInTheDocument()
    expect(screen.getByText('Expert service')).toBeInTheDocument()
  })

  it('renders action icons from names before or after the label without requiring React nodes', () => {
    const { rerender } = render(<BusinessSiteHero
      {...props}
      actions={[
        { id: 'call', label: 'Call us', href: 'tel:+15125550188', type: 'secondary', iconName: 'phone' },
        { id: 'book', label: 'Book online', href: '/book', type: 'primary', iconName: 'arrow-up-right', iconPosition: 'after' },
      ]}
    />)
    const call = screen.getByRole('link', { name: 'Call us' })
    const book = screen.getByRole('link', { name: 'Book online' })
    expect(call.firstElementChild?.querySelector('.lucide-phone')).toBeInTheDocument()
    expect(book.lastElementChild?.querySelector('.lucide-arrow-up-right')).toBeInTheDocument()

    rerender(<BusinessSiteHero {...props} actions={[
      { id: 'book', label: 'Book online', href: '/book', type: 'primary', iconName: 'not-a-lucide-icon' },
    ]} />)
    expect(screen.getByRole('link', { name: 'Book online' }).querySelector('svg')).toBeNull()
  })

  it('renders one static image without carousel buttons and allows a form slot', () => {
    const { rerender } = render(<BusinessSiteHero {...props} images={[images[0]!]} />)
    expect(screen.getByAltText('Front of the client home')).toHaveAttribute('loading', 'eager')
    expect(screen.queryByRole('button', { name: 'Next photo' })).toBeNull()
    rerender(<BusinessSiteHero {...props} images={[]} aside={<div>Form supplied by app</div>} />)
    expect(screen.getByText('Form supplied by app')).toBeTruthy()
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('uses the requested split order in the DOM, including the aside slot', () => {
    const textFirst = renderToStaticMarkup(<BusinessSiteHero {...props} />)
    const imageFirst = renderToStaticMarkup(<BusinessSiteHero {...props} contentOrder="image-first" />)
    expect(textFirst.indexOf('class="pz-business-hero__copy"'))
      .toBeLessThan(textFirst.indexOf('class="pz-business-hero__media"'))
    expect(imageFirst.indexOf('class="pz-business-hero__media"'))
      .toBeLessThan(imageFirst.indexOf('class="pz-business-hero__copy"'))
    const withAside = renderToStaticMarkup(<BusinessSiteHero
      {...props}
      images={[]}
      contentOrder="image-first"
      aside={<div>Estimate form</div>}
    />)
    expect(withAside.indexOf('class="pz-business-hero__aside"'))
      .toBeLessThan(withAside.indexOf('class="pz-business-hero__copy"'))
  })

  it('supports a gradient with validated tenant colors and safe external links', () => {
    const { container } = render(<BusinessSiteHero
      {...props}
      layout="flat"
      background="gradient"
      actions={[{ id: 'book', label: 'Book', href: 'https://example.com/book', type: 'primary', newTab: true }]}
      appearance={{ backgroundColor: '#102030', textColor: '#fefefe', accentColor: '#ff7700', buttonRadius: '16px' }}
    />)
    const hero = container.querySelector('section')!
    expect(hero.getAttribute('data-surface')).toBe('gradient')
    expect(hero.getAttribute('style')).toContain('--pz-business-hero-text: #fefefe')
    expect(hero.getAttribute('style')).toContain('--pz-business-hero-radius: 16px')
    expect(screen.getByRole('link', { name: 'Book' })).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('lets people move through photos by button, dot, and keyboard', () => {
    const { container } = render(<BusinessSiteHero {...props} />)
    const slides = container.querySelectorAll('.pz-business-hero__slide')
    expect(slides[0]).toHaveAttribute('data-active', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }))
    expect(slides[1]).toHaveAttribute('data-active', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Photo 1 of 2' }))
    expect(slides[0]).toHaveAttribute('data-active', 'true')
    fireEvent.keyDown(screen.getByRole('region', { name: 'Photos' }), { key: 'ArrowLeft' })
    expect(slides[1]).toHaveAttribute('data-active', 'true')
  })

  it('auto-advances until hovered and resumes afterward', () => {
    vi.useFakeTimers()
    const { container } = render(<BusinessSiteHero {...props} intervalMs={2000} />)
    const slides = container.querySelectorAll('.pz-business-hero__slide')
    const carousel = screen.getByRole('region', { name: 'Photos' })
    act(() => vi.advanceTimersByTime(2000))
    expect(slides[1]).toHaveAttribute('data-active', 'true')
    fireEvent.mouseEnter(carousel)
    act(() => vi.advanceTimersByTime(4000))
    expect(slides[1]).toHaveAttribute('data-active', 'true')
    fireEvent.mouseLeave(carousel)
    act(() => vi.advanceTimersByTime(2000))
    expect(slides[0]).toHaveAttribute('data-active', 'true')
  })

  it('does not auto-advance for visitors who prefer reduced motion', () => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    const { container } = render(<BusinessSiteHero {...props} intervalMs={2000} />)
    act(() => vi.advanceTimersByTime(8000))
    expect(container.querySelector('.pz-business-hero__slide[data-active="true"] img'))
      .toHaveAttribute('alt', 'Front of the client home')
  })
})
