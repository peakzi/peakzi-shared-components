import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GeoMap } from './GeoMap'
import { MapMarker } from './MapMarker'

const position = { lat: 27.9506, lon: -82.4572 }

describe('MapMarker', () => {
  it('renders a marker with no tooltip in the DOM until hovered', () => {
    const { container } = render(
      <GeoMap center={position}>
        <MapMarker point={{ id: 'a', position, tooltip: 'My Business' }} />
      </GeoMap>,
    )
    expect(container.querySelector('.leaflet-marker-icon')).toBeInTheDocument()
    expect(container.querySelector('.pz-map-marker-tooltip')).not.toBeInTheDocument()
  })

  it('shows the tooltip on hover', () => {
    const { container } = render(
      <GeoMap center={position}>
        <MapMarker point={{ id: 'a', position, tooltip: 'My Business' }} />
      </GeoMap>,
    )
    const marker = container.querySelector('.leaflet-marker-icon') as HTMLElement
    fireEvent.mouseOver(marker)
    expect(container.querySelector('.pz-map-marker-tooltip')?.textContent).toContain('My Business')
  })

  it('renders no tooltip element at all when the point has none', () => {
    const { container } = render(
      <GeoMap center={position}>
        <MapMarker point={{ id: 'a', position }} />
      </GeoMap>,
    )
    const marker = container.querySelector('.leaflet-marker-icon') as HTMLElement
    fireEvent.mouseOver(marker)
    expect(container.querySelector('.pz-map-marker-tooltip')).not.toBeInTheDocument()
  })

  it('renders a larger default icon when emphasized', () => {
    const { container } = render(
      <GeoMap center={position}>
        <MapMarker point={{ id: 'a', position, emphasized: true }} />
      </GeoMap>,
    )
    const icon = container.querySelector('.pz-map-marker-icon') as HTMLElement
    expect(icon.style.width).toBe('20px')
  })

  it('renders the smaller default icon size when not emphasized', () => {
    const { container } = render(
      <GeoMap center={position}>
        <MapMarker point={{ id: 'a', position }} />
      </GeoMap>,
    )
    const icon = container.querySelector('.pz-map-marker-icon') as HTMLElement
    expect(icon.style.width).toBe('14px')
  })
})
