import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BusinessSiteHeroCarousel } from './BusinessSiteHeroCarousel'

const images = [
  { src: '/first.jpg', alt: 'First photo', width: 1200, height: 800 },
  { src: '/second.jpg', alt: 'Second photo', width: 800, height: 1200 },
]
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals() })

describe('BusinessSiteHeroCarousel', () => {
  it('autoplays with only arrows and image indicators, keeping manual navigation', () => {
    vi.useFakeTimers()
    const { container } = render(<BusinessSiteHeroCarousel images={images} intervalMs={2000} />)
    const active = () => container.querySelector('[data-active="true"] img')?.getAttribute('alt')
    expect(screen.getAllByRole('button')).toHaveLength(images.length + 2)
    expect(active()).toBe('First photo')
    act(() => vi.advanceTimersByTime(2000))
    expect(active()).toBe('Second photo')
    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }))
    expect(active()).toBe('First photo')
    act(() => vi.advanceTimersByTime(2000))
    expect(active()).toBe('Second photo')
    fireEvent.click(screen.getByRole('button', { name: 'Photo 1 of 2' }))
    expect(active()).toBe('First photo')
    act(() => vi.advanceTimersByTime(2000))
    expect(active()).toBe('Second photo')
  })
  it('does not resume on blur while still hovered', () => {
    vi.useFakeTimers()
    const { container } = render(<BusinessSiteHeroCarousel images={images} intervalMs={2000} />)
    const carousel = screen.getByRole('region', { name: 'Photos' })
    fireEvent.mouseEnter(carousel)
    fireEvent.focus(screen.getByRole('button', { name: 'Next photo' }))
    fireEvent.blur(screen.getByRole('button', { name: 'Next photo' }), { relatedTarget: null })
    act(() => vi.advanceTimersByTime(2000))
    expect(container.querySelector('[data-active="true"] img')?.getAttribute('alt')).toBe('First photo')
    fireEvent.mouseLeave(carousel)
    act(() => vi.advanceTimersByTime(2000))
    expect(container.querySelector('[data-active="true"] img')?.getAttribute('alt')).toBe('Second photo')
  })
  it('does not auto-rotate with a zero interval or a single image', () => {
    vi.useFakeTimers()
    const { container, rerender } = render(<BusinessSiteHeroCarousel images={images} intervalMs={0} />)
    act(() => vi.advanceTimersByTime(4000))
    expect(container.querySelector('[data-active="true"] img')?.getAttribute('alt')).toBe('First photo')
    rerender(<BusinessSiteHeroCarousel images={images.slice(0, 1)} intervalMs={2000} />)
    expect(screen.queryByRole('button')).toBeNull()
    act(() => vi.advanceTimersByTime(4000))
    expect(container.querySelector('[data-active="true"] img')?.getAttribute('alt')).toBe('First photo')
  })
  it('honors reduced motion and cleans up its media listener', () => {
    vi.useFakeTimers()
    const remove = vi.fn()
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: remove }))
    const { container, unmount } = render(<BusinessSiteHeroCarousel images={images} intervalMs={2000} />)
    expect(screen.getByRole('button', { name: 'Next photo' })).toBeTruthy()
    act(() => vi.advanceTimersByTime(4000))
    expect(container.querySelector('[data-active="true"] img')?.getAttribute('alt')).toBe('First photo')
    unmount()
    expect(remove).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
