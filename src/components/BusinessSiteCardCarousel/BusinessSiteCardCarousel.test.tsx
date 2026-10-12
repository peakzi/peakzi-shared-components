import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BusinessSiteCardCarousel } from './BusinessSiteCardCarousel'

const labels = { carousel: 'Blogs', cards: 'Blog cards', previous: 'Previous blogs', next: 'Next blogs' }
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })

function setup(count = 5, animate = false) {
  const result = render(<BusinessSiteCardCarousel count={count} animate={animate} classPrefix="pz-business-blogs" labels={labels}>
    {Array.from({ length: count }, (_, index) => <li key={index}><a href={'/blogs/' + index}>Blog {index + 1}</a></li>)}
  </BusinessSiteCardCarousel>)
  const track = screen.getByRole('list', { name: labels.cards })
  let left = 0
  let width = 600
  const scrollWidth = count * 200
  Object.defineProperties(track, {
    clientWidth: { get: () => width }, scrollWidth: { get: () => scrollWidth }, scrollLeft: { get: () => left },
  })
  Array.from(track.children).forEach((card, index) => {
    vi.spyOn(card, 'getBoundingClientRect').mockImplementation(() => ({
      x: index * 200 - left, y: 0, left: index * 200 - left, right: index * 200 - left + 200,
      top: 0, bottom: 200, width: 200, height: 200, toJSON: () => ({}),
    }))
  })
  const scrollTo = vi.fn((options: ScrollToOptions) => {
    left = Math.max(0, Math.min(scrollWidth - width, options.left ?? 0))
    fireEvent.scroll(track)
  })
  Object.defineProperty(track, 'scrollTo', { value: scrollTo })
  fireEvent.resize(window)
  return { ...result, track, scrollTo,
    swipe: (position: number) => { left = position; fireEvent.scroll(track) },
    resize: (viewport: number) => { width = viewport; fireEvent.resize(window) },
  }
}

describe('BusinessSiteCardCarousel', () => {
  it('preserves every child link in server HTML before hydration', () => {
    const html = renderToStaticMarkup(<BusinessSiteCardCarousel count={5} animate={false} classPrefix="pz-business-blogs" labels={labels}>
      {Array.from({ length: 5 }, (_, index) => <li key={index}><a href={'/blogs/' + index}>Blog {index + 1}</a></li>)}
    </BusinessSiteCardCarousel>)
    expect(html.match(/<a /g)).toHaveLength(5)
    expect(html).toContain('Blog 5')
    expect(html).toContain('href="/blogs/4"')
    expect(html).not.toContain('aria-hidden="true"><a')
  })

  it('uses blog labels, shared classes and side arrows with unique track controls', () => {
    const { track, scrollTo } = setup()
    expect(screen.getByRole('region', { name: 'Blogs' })).toHaveAttribute('aria-roledescription', 'carousel')
    expect(track).toHaveClass('pz-business-card-carousel__list', 'pz-business-blogs__list')
    expect(screen.getAllByRole('button')).toHaveLength(2)
    const previous = screen.getByRole('button', { name: labels.previous })
    const next = screen.getByRole('button', { name: labels.next })
    expect(previous).toBeDisabled()
    expect(next).toBeEnabled()
    fireEvent.click(next)
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 400, behavior: 'auto' })
    expect(next).toBeDisabled()
    expect(previous).toBeEnabled()
    for (const button of screen.getAllByRole('button')) expect(button).toHaveAttribute('aria-controls', track.id)
  })

  it('tracks swiping and recalculates navigation when all cards fit after resize', () => {
    const { swipe, resize } = setup()
    swipe(400)
    expect(screen.getByRole('button', { name: labels.next })).toBeDisabled()
    swipe(0)
    resize(1000)
    expect(screen.getByRole('button', { name: labels.next })).toBeDisabled()
    expect(screen.getByRole('button', { name: labels.previous })).toBeDisabled()
    resize(390)
    expect(screen.getByRole('button', { name: labels.next })).toBeEnabled()
  })

  it('supports track keyboard navigation without intercepting article link keys', () => {
    const { track, scrollTo } = setup()
    fireEvent.keyDown(track, { key: 'End' })
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 400, behavior: 'auto' })
    fireEvent.keyDown(track, { key: 'Home' })
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: 'auto' })
    scrollTo.mockClear()
    fireEvent.keyDown(screen.getByRole('link', { name: 'Blog 1' }), { key: 'ArrowRight' })
    fireEvent.keyDown(track, { key: 'Tab' })
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it.each([true, false])('respects reduced motion preference %s', (matches) => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches })))
    const { scrollTo } = setup(5, true)
    fireEvent.click(screen.getByRole('button', { name: labels.next }))
    expect(scrollTo).toHaveBeenCalledWith({ left: 400, behavior: matches ? 'auto' : 'smooth' })
  })

  it('does not show navigation for a single blog', () => {
    const { track } = setup(1)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(track).not.toHaveAttribute('tabindex')
  })

  it('uses distinct track IDs for multiple sections', () => {
    render(<>
      <BusinessSiteCardCarousel count={2} animate={false} classPrefix="pz-business-blogs" labels={labels}><li>First</li><li>Second</li></BusinessSiteCardCarousel>
      <BusinessSiteCardCarousel count={2} animate={false} classPrefix="pz-business-offers" labels={{ ...labels, cards: 'Offer cards' }}><li>First</li><li>Second</li></BusinessSiteCardCarousel>
    </>)
    expect(new Set(screen.getAllByRole('list').map((track) => track.id)).size).toBe(2)
  })
})
