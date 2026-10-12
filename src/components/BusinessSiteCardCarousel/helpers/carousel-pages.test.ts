import { describe, expect, it } from 'vitest'
import { carouselPages, nearestPage } from './carousel-pages'

describe('carouselPages', () => {
  const starts = [0, 200, 400, 600, 800, 1000, 1200]
  it('groups three desktop cards and clamps the last page to the track end', () => {
    expect(carouselPages(starts, 600, 800)).toEqual([0, 600, 800])
  })
  it('groups two tablet cards and uses one card per mobile page', () => {
    expect(carouselPages(starts.slice(0, 5), 400, 600)).toEqual([0, 400, 600])
    expect(carouselPages(starts.slice(0, 4), 220, 580)).toEqual([0, 200, 400, 580])
  })
  it('avoids duplicate pages and tolerates fractional CSS widths', () => {
    expect(carouselPages([0, 389.34, 778.68, 1168.02], 1168, 389.34)).toEqual([0, 389.34])
  })
  it('handles a hidden track, a single card, and content which fits without scrolling', () => {
    expect(carouselPages(starts, 0, 800)).toEqual([0])
    expect(carouselPages([0], 600, 800)).toEqual([0])
    expect(carouselPages(starts, 1400, 0)).toEqual([0])
    expect(carouselPages([], 600, 0)).toEqual([0])
  })
  it('falls back to the two ends when card geometry is unavailable', () => {
    expect(carouselPages([0, 0], 600, 800)).toEqual([0, 800])
  })
  it('finds the active page after swiping and clamps overscroll', () => {
    expect(nearestPage([0, 600, 800], 550)).toBe(1)
    expect(nearestPage([0, 600, 800], -20)).toBe(0)
    expect(nearestPage([0, 600, 800], 850)).toBe(2)
  })
})
