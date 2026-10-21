import { describe, expect, it } from 'vitest'
import { mapAreas } from './map-areas'

describe('mapAreas', () => {
  const area = { id: 'city', label: 'City, CA', href: '/cities/city-ca' }
  it('keeps valid coordinates including zero and the geographic limits', () => {
    const areas = [{ ...area, position: { lat: 0, lon: 0 } }, { ...area, position: { lat: -90, lon: 180 } }]
    expect(mapAreas(areas)).toEqual(areas)
  })
  it('supports map pins before individual city routes are available', () => {
    const item = { id: 'city', label: 'City, CA', position: { lat: 0, lon: 0 } }
    expect(mapAreas([item])).toEqual([item])
  })
  it.each([undefined, { lat: 91, lon: 0 }, { lat: 0, lon: -181 }, { lat: NaN, lon: 0 }, { lat: 0, lon: Infinity }])('omits invalid or missing map positions: %j', (position) => {
    expect(mapAreas([{ ...area, ...(position ? { position } : {}) }])).toEqual([])
  })
  it('does not add markers for blank labels or unsafe URLs', () => {
    expect(mapAreas([
      { ...area, label: ' ', position: { lat: 0, lon: 0 } },
      { ...area, href: 'javascript:alert(1)', position: { lat: 0, lon: 0 } },
    ])).toEqual([])
  })
})
