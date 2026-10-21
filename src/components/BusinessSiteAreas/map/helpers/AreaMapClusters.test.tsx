import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import L from 'leaflet'
import { BusinessSiteAreas } from '../../BusinessSiteAreas'
import type { BusinessSiteArea } from '../../helpers/types'
import { BusinessSiteAreasMap } from '../BusinessSiteAreasMap'

const areas: BusinessSiteArea[] = [
  { id: 'akron', label: 'Akron, OH', favorite: true, position: { lat: 41.08, lon: -81.52 } },
  { id: 'barberton', label: 'Barberton, OH', position: { lat: 41.085, lon: -81.525 } },
]
let width = 390
const resize = new Set<() => void>()
const view = (items = areas, clusterOnMobile = true) => <BusinessSiteAreas variant="directory" areas={items}
  map={<BusinessSiteAreasMap areas={items} markerStyle="pin" clusterOnMobile={clusterOnMobile} />} />

beforeEach(() => {
  width = 390
  vi.spyOn(L.Map.prototype, 'fitBounds').mockReturnThis()
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => width)
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(280)
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() =>
    ({ top: 0, left: 0, right: width, bottom: 280, width, height: 280 }) as DOMRect)
  vi.stubGlobal('ResizeObserver', class {
    constructor(private notify: () => void) {}
    observe = () => { resize.add(this.notify) }
    disconnect = () => { resize.delete(this.notify) }
  })
})

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); resize.clear() })

describe('mobile service-area clusters', () => {
  it('groups close cities into a named count bubble without removing them from the list', () => {
    const { container, unmount } = render(view())
    expect(screen.getByRole('button', { name: '2 cities. Zoom in to explore.' })).toBeInTheDocument()
    expect(container.querySelector('[data-cluster-count="2"]')).toHaveTextContent('2')
    expect(container.querySelector('.pz-business-areas__marker--pin')).not.toBeInTheDocument()
    expect(within(screen.getByRole('list', { name: 'Cities served' })).getAllByRole('button')).toHaveLength(2)
    unmount()
    expect(resize.size).toBe(0)
  })

  it('supports tapping and Enter to expand a cluster', () => {
    const zoom = vi.spyOn(L.MarkerCluster.prototype, 'zoomToBounds').mockImplementation(() => {})
    render(view())
    const cluster = screen.getByRole('button', { name: '2 cities. Zoom in to explore.' })
    fireEvent.click(cluster)
    fireEvent.keyPress(cluster, { key: 'Enter', keyCode: 13, charCode: 13 })
    expect(zoom).toHaveBeenCalledTimes(2)
  })

  it('reveals a clustered city when its list entry receives keyboard focus', () => {
    const reveal = vi.spyOn(L.MarkerClusterGroup.prototype, 'zoomToShowLayer').mockImplementation(() => {})
    render(view())
    const city = within(screen.getByRole('list', { name: 'Cities served' })).getByRole('button', { name: 'Barberton, OH' })
    act(() => city.focus())
    expect(reveal).toHaveBeenCalledWith(expect.objectContaining({
      options: expect.objectContaining({ title: 'Barberton, OH' }),
    }), expect.any(Function))
    expect(city).toHaveAttribute('data-map-active', 'true')
    const marker = reveal.mock.calls[0]![0]
    const map = vi.mocked(L.Map.prototype.fitBounds).mock.contexts[0]!
    act(() => { map.addLayer(marker) })
    expect(marker.getElement()).toHaveAttribute('data-map-active', 'true')
  })

  it('restores individual desktop pins and switches back to clusters on resize', () => {
    width = 1280
    const { container } = render(view())
    expect(container.querySelector('.pz-business-areas__cluster')).not.toBeInTheDocument()
    expect(container.querySelectorAll('.pz-business-areas__marker--pin')).toHaveLength(2)
    act(() => { width = 390; [...resize].forEach((notify) => notify()) })
    expect(container.querySelector('[data-cluster-count="2"]')).toBeInTheDocument()
    act(() => { width = 1280; [...resize].forEach((notify) => notify()) })
    expect(container.querySelector('.pz-business-areas__cluster')).not.toBeInTheDocument()
    expect(container.querySelectorAll('.pz-business-areas__marker--pin')).toHaveLength(2)
  })

  it('does not cluster when the feature is disabled', () => {
    const { container } = render(view(areas, false))
    expect(container.querySelector('.pz-business-areas__cluster')).not.toBeInTheDocument()
    expect(container.querySelectorAll('.pz-business-areas__marker--pin')).toHaveLength(2)
  })

  it('handles viewport changes without ResizeObserver and removes its listeners', () => {
    vi.stubGlobal('ResizeObserver', undefined)
    const remove = vi.spyOn(window, 'removeEventListener')
    const { container, unmount } = render(view())
    expect(container.querySelector('[data-cluster-count="2"]')).toBeInTheDocument()
    act(() => { width = 1280; window.dispatchEvent(new Event('resize')) })
    expect(container.querySelector('.pz-business-areas__cluster')).not.toBeInTheDocument()
    expect(container.querySelectorAll('.pz-business-areas__marker--pin')).toHaveLength(2)
    unmount()
    expect(remove).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('updates clusters after filtering and keeps cities without coordinates in the list', () => {
    const { container, rerender } = render(view())
    rerender(view([areas[0]!]))
    expect(container.querySelector('.pz-business-areas__cluster')).not.toBeInTheDocument()
    expect(container.querySelectorAll('.pz-business-areas__marker--pin')).toHaveLength(1)
    rerender(view([...areas, { id: 'missing', label: 'No coordinates' }]))
    expect(container.querySelector('[data-cluster-count="2"]')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'No coordinates' })).toBeInTheDocument()
    rerender(view([]))
    expect(container.querySelector('.leaflet-container')).not.toBeInTheDocument()
    expect(screen.getByText('No cities found.')).toBeInTheDocument()
  })

  it('can spread coincident markers at the maximum zoom', () => {
    vi.spyOn(L.Map.prototype, 'getMaxZoom').mockReturnValue(9)
    const spiderfy = vi.spyOn(L.MarkerCluster.prototype, 'spiderfy').mockImplementation(() => {})
    render(view(areas.map((area) => ({ ...area, position: areas[0]!.position! }))))
    fireEvent.click(screen.getByRole('button', { name: '2 cities. Zoom in to explore.' }))
    expect(spiderfy).toHaveBeenCalled()
  })
})
