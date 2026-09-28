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

  it('leaves the default pin fill to CSS tokens, adding the emphasized modifier class', () => {
    const { container } = render(
      <GeoMap center={position}>
        <MapMarker point={{ id: 'a', position, emphasized: true }} />
      </GeoMap>,
    )
    const icon = container.querySelector('.pz-map-marker-icon') as HTMLElement
    expect(icon.classList).toContain('pz-map-marker-icon--emphasized')
    expect(icon.querySelector('circle')?.getAttribute('style')).toBeNull()
  })

  it('inlines only an explicitly supplied pin color', () => {
    const { container } = render(
      <GeoMap center={position}>
        <MapMarker point={{ id: 'a', position, color: 'red' }} />
      </GeoMap>,
    )
    expect(container.querySelector('.pz-map-marker-icon circle')?.getAttribute('style')).toBe('fill:red')
  })

  it('drops a color that could inject markup or CSS, falling back to the token default', () => {
    const { container } = render(
      <GeoMap center={position}>
        <MapMarker point={{ id: 'a', position, color: 'red"/><img src=x onerror=alert(1)>' }} />
        <MapMarker point={{ id: 'b', position, color: 'red; background:url(x)' }} />
      </GeoMap>,
    )
    const circles = container.querySelectorAll('.pz-map-marker-icon circle')
    expect(circles).toHaveLength(2)
    circles.forEach((circle) => expect(circle.getAttribute('style')).toBeNull())
    expect(container.querySelector('.pz-map-marker-icon img')).not.toBeInTheDocument()
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
