import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { findExtremeCorners } from '../../internal/findExtremeCorners'
import { Skeleton } from '../Progress'

export interface LatLon {
  lat: number
  lon: number
}

export interface GeoMapProps {
  /** Used to compute the initial auto-fit viewport. Does not render markers itself — compose `MapMarker` or your own react-leaflet layers as `children`. */
  points?: LatLon[]
  /** Fallback center when `points` is empty */
  center?: LatLon
  zoom?: number
  /** Extra pixel padding around the auto-fit viewport */
  boundsPadding?: [number, number]
  /**
   * Upper zoom limit when auto-fitting several `points`, so tightly clustered
   * points don't zoom in to street level. A single point (or points that all
   * coincide) is centered at `zoom` instead of fitted.
   */
  maxFitZoom?: number
  isLoading?: boolean
  height?: number | string
  className?: string
  /** Rendered as `data-testid` on the map's root element. */
  testId?: string
  /** react-leaflet layers — `MapMarker`, or your own `Marker`/`CircleMarker`/`GeoJSON` */
  children?: ReactNode
}

interface FitBoundsProps {
  points: LatLon[]
  zoom: number
  maxZoom: number
  padding?: [number, number]
}

function FitBounds({ points, zoom, maxZoom, padding }: FitBoundsProps) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0) return
    const { corner1, corner2 } = findExtremeCorners(points.map((point): [number, number] => [point.lat, point.lon]))

    // A zero-area box would make fitBounds zoom to the map's maximum.
    if (corner1.lat === corner2.lat && corner1.lon === corner2.lon) {
      map.setView([corner1.lat, corner1.lon], zoom)
      return
    }

    map.fitBounds(
      [
        [corner1.lat, corner1.lon],
        [corner2.lat, corner2.lon],
      ],
      { maxZoom, ...(padding ? { padding } : {}) },
    )
    // `points` is compared by reference deliberately — callers should memoize
    // their points array if they want to avoid re-fitting on every render.
  }, [map, points, zoom, maxZoom, padding])

  return null
}

export function GeoMap({
  points = [],
  center,
  zoom = 9,
  boundsPadding,
  maxFitZoom = 15,
  isLoading = false,
  height = 400,
  className,
  testId,
  children,
}: GeoMapProps) {
  const initialCenter = center ?? points[0]

  if (isLoading) {
    return (
      <div className={['pz-geo-map', className].filter(Boolean).join(' ')} style={{ height }} data-testid={testId}>
        <Skeleton className="pz-geo-map__skeleton" height="100%" />
      </div>
    )
  }

  if (!initialCenter) {
    return <div className={['pz-geo-map', className].filter(Boolean).join(' ')} style={{ height }} data-testid={testId} />
  }

  return (
    <div className={['pz-geo-map', className].filter(Boolean).join(' ')} style={{ height }} data-testid={testId}>
      <MapContainer center={[initialCenter.lat, initialCenter.lon]} zoom={zoom} scrollWheelZoom className="pz-geo-map__canvas">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.length > 0 && <FitBounds points={points} zoom={zoom} maxZoom={maxFitZoom} {...(boundsPadding ? { padding: boundsPadding } : {})} />}
        {children}
      </MapContainer>
    </div>
  )
}
