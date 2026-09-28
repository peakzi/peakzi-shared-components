import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import L from 'leaflet'
import { GeoMap } from './GeoMap'
import { MapMarker } from './MapMarker'

const points = [
  { lat: 27.9506, lon: -82.4572 },
  { lat: 28.05, lon: -82.5 },
]

describe('GeoMap', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('centers a single point at `zoom` instead of fitting a zero-area bounds', () => {
    const setView = vi.spyOn(L.Map.prototype, 'setView')
    const fitBounds = vi.spyOn(L.Map.prototype, 'fitBounds')
    render(<GeoMap points={[{ lat: 27.9506, lon: -82.4572 }]} zoom={11} />)
    expect(setView).toHaveBeenLastCalledWith([27.9506, -82.4572], 11)
    expect(fitBounds).not.toHaveBeenCalled()
  })

  it('caps the auto-fit zoom for several points with maxFitZoom', () => {
    const fitBounds = vi.spyOn(L.Map.prototype, 'fitBounds').mockReturnThis()
    render(<GeoMap points={points} maxFitZoom={12} boundsPadding={[20, 20]} />)
    expect(fitBounds).toHaveBeenCalledWith(expect.anything(), { maxZoom: 12, padding: [20, 20] })
  })

  it('renders a skeleton while loading, not the map', () => {
    const { container } = render(<GeoMap isLoading points={points} testId="market-map" />)
    expect(container.querySelector('.pz-skeleton')).toBeInTheDocument()
    expect(container.querySelector('.leaflet-container')).not.toBeInTheDocument()
  })

  it('renders an empty container when there is no center and no points', () => {
    const { container } = render(<GeoMap testId="market-map" />)
    expect(screen.getByTestId('market-map')).toBeInTheDocument()
    expect(container.querySelector('.leaflet-container')).not.toBeInTheDocument()
  })

  it('renders the map once points are available, with the given test id', () => {
    render(<GeoMap points={points} testId="market-map" />)
    expect(screen.getByTestId('market-map').querySelector('.leaflet-container')).toBeInTheDocument()
  })

  it('renders an explicit center even with no points', () => {
    const { container } = render(<GeoMap center={{ lat: 27.9506, lon: -82.4572 }} />)
    expect(container.querySelector('.leaflet-container')).toBeInTheDocument()
  })

  it('renders children (e.g. MapMarker) inside the map', () => {
    const { container } = render(
      <GeoMap points={points}>
        <MapMarker point={{ id: 'a', position: points[0]! }} />
        <MapMarker point={{ id: 'b', position: points[1]!, emphasized: true }} />
      </GeoMap>,
    )
    expect(container.querySelectorAll('.leaflet-marker-icon')).toHaveLength(2)
  })

  it('applies a custom className to the root element', () => {
    const { container } = render(<GeoMap points={points} className="custom-map" />)
    expect(container.firstElementChild?.className).toContain('pz-geo-map')
    expect(container.firstElementChild?.className).toContain('custom-map')
  })
})
