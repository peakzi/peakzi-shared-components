'use client'

import { useMemo, useRef } from 'react'
import { DivIcon } from 'leaflet'
import type { LeafletEvent, Marker as LeafletMarker } from 'leaflet'
import { Marker, Tooltip } from 'react-leaflet'
import { GeoMap } from '../../GeoMap'
import { mapAreas } from '../helpers/map-areas'
import type { BusinessSiteAreasMapProps } from '../helpers/types'
import { AreaMapBounds } from './helpers/AreaMapBounds'
import { useAreaSelection } from './helpers/use-area-selection'
import { AreaMapMarkers } from './helpers/AreaMapMarkers'

export type { BusinessSiteAreasMapProps } from '../helpers/types'

const markerIcon = (size: number) => new DivIcon({
  className: 'pz-business-areas__marker',
  html: '<span></span>',
  iconSize: [size, size],
  iconAnchor: [size / 2, size / 2],
})
const defaultIcon = markerIcon(14)
const pinIcon = new DivIcon({
  className: 'pz-business-areas__marker pz-business-areas__marker--pin',
  // Fixed SVG markup, never API-supplied HTML. The tip anchors the actual coordinate.
  html: '<svg viewBox="0 0 24 32" aria-hidden="true"><path d="M12 1C6 1 1 6 1 12c0 8 11 19 11 19s11-11 11-19C23 6 18 1 12 1Z" fill="currentColor" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="white"/></svg>',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
})

export function BusinessSiteAreasMap({ areas, markerStyle = 'dot', defaultZoom, clusterOnMobile = false }: BusinessSiteAreasMapProps) {
  const ref = useRef<HTMLDivElement>(null)
  const locations = useMemo(() => mapAreas(areas), [areas])
  const { selected, select } = useAreaSelection(ref, locations.length > 0)
  const selectedArea = locations.find((area) => area.id === selected)
  const points = useMemo(() => locations.map((area) => area.position), [locations])
  const center = points[0]
  if (!center) return null

  return (
    <div ref={ref} className="pz-business-areas__map-island" role="region" aria-label="Service area map">
      <GeoMap center={center} height="100%" scrollWheelZoom={false}>
        <AreaMapBounds points={points} padding={markerStyle === 'pin' ? 40 : 24}
          defaultZoom={defaultZoom} selectedPoint={selectedArea?.position} />
        <AreaMapMarkers clusterOnMobile={clusterOnMobile} selectedLabel={selectedArea?.label}>
          {locations.map((area) => (
            <Marker
              key={area.id}
              position={[area.position.lat, area.position.lon]}
              icon={markerStyle === 'pin' ? pinIcon : defaultIcon}
              title={area.label}
              alt={area.label}
              eventHandlers={{
                add: (event: LeafletEvent) => {
                  const element = (event.target as LeafletMarker).getElement()
                  element?.setAttribute('data-area-id', area.id)
                  element?.setAttribute('aria-label', area.label)
                  // Clustered pins receive their DOM element only after being revealed.
                  if (area.id === selected) element?.setAttribute('data-map-active', 'true')
                  else element?.removeAttribute('data-map-active')
                },
                mouseover: () => select(area.id),
                mouseout: () => select(null),
                click: () => select(area.id),
              }}
            >
              {selected === area.id && <Tooltip permanent direction="top" offset={[0, -10]}>{area.label}</Tooltip>}
            </Marker>
          ))}
        </AreaMapMarkers>
      </GeoMap>
    </div>
  )
}
