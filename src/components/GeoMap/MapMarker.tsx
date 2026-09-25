import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from 'leaflet'
import { Marker, Tooltip } from 'react-leaflet'
import { createMapIcon } from '../../internal/createMapIcon'
import type { LatLon } from './GeoMap'

export interface MapPoint {
  id: string
  position: LatLon
  tooltip?: ReactNode
  /** Pin color. Defaults to the design system's brand accent (`--peakzi-purple`), or `--info` when `emphasized`. */
  color?: string
  /** Fully custom marker icon URL — overrides `color` and the bundled default pin entirely. */
  iconUrl?: string
  iconSize?: [number, number]
  /** Visually distinguishes this point (e.g. "your business" among competitors) — larger pin, secondary tone by default. */
  emphasized?: boolean
}

export interface MapMarkerProps {
  point: MapPoint
}

/** A `react-leaflet` `Marker` with hover/touch-aware tooltip behavior and a themed default pin. */
export function MapMarker({ point }: MapMarkerProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTouchDevice = typeof window !== 'undefined' && !!window.matchMedia?.('(hover: none)').matches

  const openTooltip = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setIsTooltipOpen(true)
  }, [])

  const closeTooltip = useCallback(() => {
    if (isTouchDevice) return
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => setIsTooltipOpen(false), 120)
  }, [isTouchDevice])

  const keepTooltipOpen = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }, [])

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    },
    [],
  )

  const size: [number, number] = point.iconSize ?? (point.emphasized ? [20, 20] : [14, 14])
  const icon = useMemo(() => {
    if (point.iconUrl) {
      return new Icon({ iconUrl: point.iconUrl, iconSize: size })
    }
    return createMapIcon({ size, emphasized: !!point.emphasized, ...(point.color ? { color: point.color } : {}) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point.iconUrl, point.color, point.emphasized, size[0], size[1]])

  const position: [number, number] = [point.position.lat, point.position.lon]

  if (!point.tooltip) {
    return <Marker position={position} icon={icon} />
  }

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={isTouchDevice ? { click: openTooltip } : { mouseover: openTooltip, mouseout: closeTooltip }}
    >
      {isTooltipOpen && (
        <Tooltip permanent direction="auto" offset={[0, -10]} opacity={1} interactive className="pz-map-marker-tooltip">
          <div onMouseEnter={keepTooltipOpen} onMouseLeave={closeTooltip}>
            {point.tooltip}
          </div>
        </Tooltip>
      )}
    </Marker>
  )
}
