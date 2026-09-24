import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GeoMap } from './GeoMap'
import { MapMarker } from './MapMarker'

const points = [
  { lat: 27.9506, lon: -82.4572 },
  { lat: 28.05, lon: -82.5 },
]

describe('GeoMap', () => {
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
