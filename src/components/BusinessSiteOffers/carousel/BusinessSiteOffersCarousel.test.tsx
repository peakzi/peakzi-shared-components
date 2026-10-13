import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { BusinessSiteOffersCarousel } from './BusinessSiteOffersCarousel'

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })

function setup(count = 7, animate = false) {
  const result = render(<BusinessSiteOffersCarousel count={count} animate={animate}>
    {Array.from({ length: count }, (_, index) => <li key={index}><a href={`/offers/${index}`}>Offer {index + 1}</a></li>)}
  </BusinessSiteOffersCarousel>)
  const track = screen.getByRole('list', { name: 'Offer cards' })
  let left = 0
  let width = 600
  let scrollWidth = count * 200
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
    resize: (viewport: number, content: number) => { width = viewport; scrollWidth = content; fireEvent.resize(window) },
  }
}

describe('BusinessSiteOffersCarousel', () => {
  it('navigates one viewport at a time and disables arrows at both ends', () => {
    const { scrollTo } = setup()
    const previous = screen.getByRole('button', { name: 'Previous offers' })
    const next = screen.getByRole('button', { name: 'Next offers' })
    expect(previous).toBeDisabled()
    expect(next).toBeEnabled()
    fireEvent.click(next)
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 600, behavior: 'auto' })
    expect(previous).toBeEnabled()
    fireEvent.click(next)
    expect(next).toBeDisabled()
    fireEvent.click(next)
    expect(scrollTo).toHaveBeenCalledTimes(2)
    fireEvent.click(previous)
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 600, behavior: 'auto' })
    expect(next).toBeEnabled()
  })

  it('updates navigation when the visitor swipes or the layout resizes', () => {
    const { swipe, resize } = setup()
    swipe(800)
    expect(screen.getByRole('button', { name: 'Next offers' })).toBeDisabled()
    swipe(0)
    resize(1400, 1400)
    expect(screen.getByRole('button', { name: 'Previous offers' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next offers' })).toBeDisabled()
    resize(390, 1400)
    expect(screen.getByRole('button', { name: 'Next offers' })).toBeEnabled()
  })

  it('supports arrow, Home and End keys on the track', () => {
    const { track, scrollTo } = setup()
    fireEvent.keyDown(track, { key: 'ArrowRight' })
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 600, behavior: 'auto' })
    fireEvent.keyDown(track, { key: 'ArrowLeft' })
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: 'auto' })
    fireEvent.keyDown(track, { key: 'End' })
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 800, behavior: 'auto' })
    fireEvent.keyDown(track, { key: 'Home' })
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: 'auto' })
  })

  it('does not intercept keyboard events on offer links or unrelated keys', () => {
    const { track, scrollTo } = setup()
    fireEvent.keyDown(screen.getByRole('link', { name: 'Offer 1' }), { key: 'ArrowRight' })
    fireEvent.keyDown(track, { key: 'Tab' })
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it.each([true, false])('respects reduced motion preference %s when subtle motion is enabled', (matches) => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches })))
    const { scrollTo } = setup(7, true)
    fireEvent.click(screen.getByRole('button', { name: 'Next offers' }))
    expect(scrollTo).toHaveBeenCalledWith({ left: 600, behavior: matches ? 'auto' : 'smooth' })
  })

  it('does not add smooth motion when site motion is disabled', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })))
    const { scrollTo } = setup(7, false)
    fireEvent.click(screen.getByRole('button', { name: 'Next offers' }))
    expect(scrollTo).toHaveBeenCalledWith({ left: 600, behavior: 'auto' })
  })

  it('does not show carousel controls or add a tab stop for one offer', () => {
    const { track } = setup(1)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(track).toHaveAttribute('data-single', 'true')
    expect(track).not.toHaveAttribute('tabindex')
  })

  it('binds only the two side arrows to the unique track ID without page dots', () => {
    const { track } = setup()
    expect(screen.getByRole('region', { name: 'Offers' })).toHaveAttribute('aria-roledescription', 'carousel')
    expect(track).toHaveAttribute('tabindex', '0')
    expect(screen.getAllByRole('button')).toHaveLength(2)
    expect(screen.queryByRole('group', { name: 'Offer pages' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Offer page/ })).not.toBeInTheDocument()
    for (const button of screen.getAllByRole('button')) expect(button).toHaveAttribute('aria-controls', track.id)
  })

  it('keeps arrow stepping in sync after swiping and responsive resizing', () => {
    const { swipe, resize, scrollTo } = setup()
    swipe(600)
    resize(400, 1400)
    fireEvent.click(screen.getByRole('button', { name: 'Next offers' }))
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 800, behavior: 'auto' })
    fireEvent.click(screen.getByRole('button', { name: 'Next offers' }))
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 1000, behavior: 'auto' })
    expect(screen.getByRole('button', { name: 'Next offers' })).toBeDisabled()
    swipe(0)
    resize(1400, 1400)
    expect(screen.getByRole('button', { name: 'Next offers' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Previous offers' })).toBeDisabled()
  })

  it('disconnects observers and removes listeners when unmounted', () => {
    const observe = vi.fn()
    const disconnect = vi.fn()
    vi.stubGlobal('ResizeObserver', class { observe = observe; disconnect = disconnect })
    const removeListener = vi.spyOn(window, 'removeEventListener')
    const { unmount, track } = setup()
    expect(observe).toHaveBeenCalledWith(track)
    unmount()
    expect(disconnect).toHaveBeenCalledOnce()
    expect(removeListener).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
