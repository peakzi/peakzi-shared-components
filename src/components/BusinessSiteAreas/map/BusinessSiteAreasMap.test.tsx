import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import L from 'leaflet'
import { BusinessSiteAreas } from '../BusinessSiteAreas'
import { BusinessSiteAreasMap } from './BusinessSiteAreasMap'

const areas = [
  { id: 'allen', label: 'Allen, TX', href: '/cities/allen-tx', position: { lat: 33.103, lon: -96.67 } },
  { id: 'plano', label: 'Plano, TX', href: '/cities/plano-tx', position: { lat: 33.019, lon: -96.699 } },
]
const view = (items = areas) => <BusinessSiteAreas areas={items} map={<BusinessSiteAreasMap areas={items} />} />

beforeEach(() => vi.spyOn(L.Map.prototype, 'fitBounds').mockReturnThis())
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })

describe('BusinessSiteAreasMap', () => {
  it('renders SVG pin icons only when requested, preserving the homepage dot default', () => {
    const { container, rerender } = render(<BusinessSiteAreasMap areas={areas} markerStyle="pin" />)
    expect(container.querySelectorAll('.pz-business-areas__marker--pin svg')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Plano, TX' })).toHaveAttribute('tabindex', '0')
    rerender(<BusinessSiteAreasMap areas={areas} />)
    expect(container.querySelector('.pz-business-areas__marker--pin')).not.toBeInTheDocument()
    expect(container.querySelectorAll('.pz-business-areas__marker span')).toHaveLength(2)
  })
  it('uses the preferred zoom as a fit limit without forcing cropped pins and reveals selected cities', () => {
    const zoom = vi.spyOn(L.Map.prototype, 'setZoom')
    const pan = vi.spyOn(L.Map.prototype, 'panInside')
    render(<BusinessSiteAreas areas={areas} map={<BusinessSiteAreasMap areas={areas} markerStyle="pin" defaultZoom={9} />} />)
    expect(L.Map.prototype.fitBounds).toHaveBeenLastCalledWith([[33.103, -96.67], [33.019, -96.699]], {
      paddingTopLeft: [40, 40], paddingBottomRight: [40, 40], maxZoom: 9, animate: false,
    })
    expect(zoom).not.toHaveBeenCalled()
    fireEvent.pointerOver(screen.getByRole('link', { name: 'Plano, TX' }))
    expect(pan).toHaveBeenLastCalledWith([33.019, -96.699], { padding: [40, 40], animate: false })
  })
  it('refits on resize with a preferred zoom, retaining the safety padding', () => {
    let onResize = () => {}
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: () => void) { onResize = callback }
      observe = vi.fn()
      disconnect = vi.fn()
    })
    render(<BusinessSiteAreasMap areas={areas} markerStyle="pin" defaultZoom={10} />)
    const calls = vi.mocked(L.Map.prototype.fitBounds).mock.calls.length
    act(() => onResize())
    expect(L.Map.prototype.fitBounds).toHaveBeenCalledTimes(calls + 1)
    expect(L.Map.prototype.fitBounds).toHaveBeenLastCalledWith([[33.103, -96.67], [33.019, -96.699]], {
      paddingTopLeft: [40, 40], paddingBottomRight: [40, 40], maxZoom: 10, animate: false,
    })
  })

  it.each([NaN, Infinity])('ignores an invalid starting zoom %s', (defaultZoom) => {
    const zoom = vi.spyOn(L.Map.prototype, 'setZoom')
    render(<BusinessSiteAreasMap areas={areas} defaultZoom={defaultZoom} />)
    expect(zoom.mock.calls.every(([value]) => Number.isFinite(value))).toBe(true)
    expect(L.Map.prototype.fitBounds).toHaveBeenCalled()
  })
  it('renders markers and required attribution without Leaflet branding', () => {
    const { container } = render(view())
    expect(container.querySelectorAll('.leaflet-marker-icon')).toHaveLength(2)
    expect(screen.getByRole('region', { name: 'Service area map' })).toBeInTheDocument()
    expect(container.querySelector('.leaflet-control-attribution')).toHaveTextContent('© OpenStreetMap contributors')
    expect(container.querySelector('.leaflet-control-attribution')).not.toHaveTextContent('Leaflet')
    expect(container.querySelector('.leaflet-top.leaflet-left .leaflet-control-zoom')).toBeInTheDocument()
    expect(container.querySelector('.leaflet-bottom.leaflet-left .leaflet-control-attribution')).toBeInTheDocument()
  })

  it('highlights the marker and tooltip on city hover without changing its URL', () => {
    const { container } = render(view())
    const link = screen.getByRole('link', { name: 'Allen, TX' })
    fireEvent.pointerOver(link)
    expect(link).toHaveAttribute('data-map-active', 'true')
    expect(container.querySelector('.leaflet-marker-icon[data-area-id="allen"]')).toHaveAttribute('data-map-active', 'true')
    expect(container.querySelector('.leaflet-tooltip')).toHaveTextContent('Allen, TX')
    expect(link).toHaveAttribute('href', '/cities/allen-tx')
    fireEvent.pointerOut(link)
    expect(link).not.toHaveAttribute('data-map-active')
    expect(container.querySelector('.leaflet-tooltip')).not.toBeInTheDocument()
  })

  it('supports keyboard focus and Escape on city links', () => {
    const { container } = render(view())
    const link = screen.getByRole('link', { name: 'Plano, TX' })
    act(() => link.focus())
    expect(container.querySelector('.leaflet-tooltip')).toHaveTextContent('Plano, TX')
    fireEvent.keyDown(link, { key: 'Escape' })
    expect(container.querySelector('.leaflet-tooltip')).not.toBeInTheDocument()
    expect(link).not.toHaveAttribute('data-map-active')
  })

  it('selects the corresponding city from a keyboard-accessible marker', () => {
    render(view())
    const marker = screen.getByRole('button', { name: 'Plano, TX' })
    fireEvent.click(marker)
    expect(screen.getByRole('link', { name: 'Plano, TX' })).toHaveAttribute('data-map-active', 'true')
    expect(marker).toHaveAttribute('tabindex', '0')
  })

  it('keeps highlighting local to the map section', () => {
    render(<>{view()}<BusinessSiteAreas areas={areas} /></>)
    const lists = screen.getAllByRole('list', { name: 'Cities served' })
    const mapped = within(lists[0]!).getByRole('link', { name: 'Allen, TX' })
    const other = within(lists[1]!).getByRole('link', { name: 'Allen, TX' })
    fireEvent.pointerOver(mapped)
    expect(mapped).toHaveAttribute('data-map-active', 'true')
    expect(other).not.toHaveAttribute('data-map-active')
  })

  it('keeps cities without coordinates in the list and omits only their markers', () => {
    const missing = { id: 'missing', label: 'Missing, TX', href: '/cities/missing-tx' }
    const items = [...areas, missing]
    const { container } = render(<BusinessSiteAreas areas={items} map={<BusinessSiteAreasMap areas={items} />} />)
    expect(screen.getByRole('link', { name: 'Missing, TX' })).toBeInTheDocument()
    expect(container.querySelectorAll('.leaflet-marker-icon')).toHaveLength(2)
  })

  it('can receive coordinates after an empty render and still enhance city links', () => {
    const { container, rerender } = render(<BusinessSiteAreas areas={areas} map={<BusinessSiteAreasMap areas={[]} />} />)
    expect(container.querySelector('.leaflet-container')).not.toBeInTheDocument()
    rerender(view())
    fireEvent.pointerOver(screen.getByRole('link', { name: 'Allen, TX' }))
    expect(container.querySelector('.leaflet-tooltip')).toHaveTextContent('Allen, TX')
  })

  it('fits markers to the left of the right-hand panel and disconnects resize observation on unmount', () => {
    const observe = vi.fn()
    const disconnect = vi.fn()
    vi.stubGlobal('ResizeObserver', class { observe = observe; disconnect = disconnect })
    const rect = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return (this.classList.contains('pz-business-areas__panel')
        ? { top: 24, left: 720, right: 1176, bottom: 440, width: 456, height: 416 }
        : { top: 0, left: 0, right: 1200, bottom: 500, width: 1200, height: 500 }) as DOMRect
    })
    const { unmount } = render(view())
    expect(L.Map.prototype.fitBounds).toHaveBeenLastCalledWith([[33.103, -96.67], [33.019, -96.699]], {
      paddingTopLeft: [24, 24], paddingBottomRight: [504, 24], maxZoom: 11, animate: false,
    })
    expect(observe).toHaveBeenCalledTimes(2)
    unmount()
    expect(disconnect).toHaveBeenCalledOnce()
    rect.mockRestore()
  })

  it.each([
    ['compact side-by-side', { top: 24, left: 524, right: 1200, bottom: 300, width: 676, height: 276 }, { top: 24, left: 24, right: 500, bottom: 300, width: 476, height: 276 }],
    ['mobile stacked', { top: 0, left: 16, right: 374, bottom: 400, width: 358, height: 400 }, { top: 424, left: 16, right: 374, bottom: 664, width: 358, height: 240 }],
  ])('uses the whole map when the %s panel does not overlap it', (_layout, panel, canvas) => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return (this.classList.contains('pz-business-areas__panel') ? panel : canvas) as DOMRect
    })
    render(view())
    expect(L.Map.prototype.fitBounds).toHaveBeenLastCalledWith([[33.103, -96.67], [33.019, -96.699]], {
      paddingTopLeft: [24, 24], paddingBottomRight: [24, 24], maxZoom: 11, animate: false,
    })
  })

  it('refits the map when the right-hand panel changes size', () => {
    let onResize = () => {}
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: () => void) { onResize = callback }
      observe = vi.fn()
      disconnect = vi.fn()
    })
    let panelLeft = 720
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return (this.classList.contains('pz-business-areas__panel')
        ? { top: 24, left: panelLeft, right: 1176, bottom: 440, width: 1176 - panelLeft, height: 416 }
        : { top: 0, left: 0, right: 1200, bottom: 500, width: 1200, height: 500 }) as DOMRect
    })
    render(view())
    panelLeft = 600
    act(() => onResize())
    expect(L.Map.prototype.fitBounds).toHaveBeenLastCalledWith([[33.103, -96.67], [33.019, -96.699]], {
      paddingTopLeft: [24, 24], paddingBottomRight: [624, 24], maxZoom: 11, animate: false,
    })
  })

  it.each([
    ['stacked', { top: 124, left: 16, right: 380.8, bottom: 359.400009, width: 364.8, height: 235.400009 },
      { top: 359.399994, left: 40.8, right: 356, bottom: 623.399994, width: 315.2, height: 264 }],
    ['side-by-side', { top: 24, left: 356, right: 700, bottom: 288, width: 344, height: 264 },
      { top: 24, left: 40.8, right: 356.000012, bottom: 288, width: 315.200012, height: 264 }],
  ])('ignores fractional-pixel edge contact in %s layouts', (_layout, panel, canvas) => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return (this.classList.contains('pz-business-areas__panel') ? panel : canvas) as DOMRect
    })
    render(<BusinessSiteAreas areas={areas} map={<BusinessSiteAreasMap areas={areas} markerStyle="pin" defaultZoom={10} />} />)
    expect(L.Map.prototype.fitBounds).toHaveBeenLastCalledWith([[33.103, -96.67], [33.019, -96.699]], {
      paddingTopLeft: [40, 40], paddingBottomRight: [40, 40], maxZoom: 10, animate: false,
    })
  })

  it('never reserves homepage overlay space for the directory layout', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return (this.classList.contains('pz-business-areas__panel')
        ? { top: 24, left: 24, right: 1200, bottom: 300, width: 1176, height: 276 }
        : { top: 0, left: 0, right: 1200, bottom: 500, width: 1200, height: 500 }) as DOMRect
    })
    render(<BusinessSiteAreas variant="directory" areas={areas}
      map={<BusinessSiteAreasMap areas={areas} markerStyle="pin" defaultZoom={10} />} />)
    expect(L.Map.prototype.fitBounds).toHaveBeenLastCalledWith([[33.103, -96.67], [33.019, -96.699]], {
      paddingTopLeft: [40, 40], paddingBottomRight: [40, 40], maxZoom: 10, animate: false,
    })
  })
})
