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

export type { BusinessSiteAreasMapProps } from '../helpers/types'

const markerIcon = (size: number) => new DivIcon({
  className: 'pz-business-areas__marker',
  html: '<span></span>',
  iconSize: [size, size],
  iconAnchor: [size / 2, size / 2],
})
const defaultIcon = markerIcon(14)

export function BusinessSiteAreasMap({ areas }: BusinessSiteAreasMapProps) {
  const ref = useRef<HTMLDivElement>(null)
  const locations = useMemo(() => mapAreas(areas), [areas])
  const { selected, select } = useAreaSelection(ref, locations.length > 0)
  const points = useMemo(() => locations.map((area) => area.position), [locations])
  const center = points[0]
  if (!center) return null

  return (
    <div ref={ref} className="pz-business-areas__map-island" role="region" aria-label="Service area map">
      <GeoMap center={center} height="100%" scrollWheelZoom={false}>
        <AreaMapBounds points={points} />
        {locations.map((area) => (
          <Marker
            key={area.id}
            position={[area.position.lat, area.position.lon]}
            icon={defaultIcon}
            title={area.label}
            alt={area.label}
            eventHandlers={{
              add: (event: LeafletEvent) => {
                const element = (event.target as LeafletMarker).getElement()
                element?.setAttribute('data-area-id', area.id)
                element?.setAttribute('aria-label', area.label)
              },
              mouseover: () => select(area.id),
              mouseout: () => select(null),
              click: () => select(area.id),
            }}
          >
            {selected === area.id && <Tooltip permanent direction="top" offset={[0, -10]}>{area.label}</Tooltip>}
          </Marker>
        ))}
      </GeoMap>
    </div>
  )
}
