import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { useMap } from 'react-leaflet/hooks'
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
  isLoading?: boolean
  height?: number | string
  className?: string
  /** Rendered as `data-testid` on the map's root element. */
  testId?: string
  /** react-leaflet layers — `MapMarker`, or your own `Marker`/`CircleMarker`/`GeoJSON` */
  children?: ReactNode
}

function FitBounds({ points, padding }: { points: LatLon[]; padding?: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0) return
    const { corner1, corner2 } = findExtremeCorners(points.map((point): [number, number] => [point.lat, point.lon]))
    map.fitBounds(
      [
        [corner1.lat, corner1.lon],
        [corner2.lat, corner2.lon],
      ],
      padding ? { padding } : undefined,
    )
    // `points` is compared by reference deliberately — callers should memoize
    // their points array if they want to avoid re-fitting on every render.
  }, [map, points, padding])

  return null
}

export function GeoMap({
  points = [],
  center,
  zoom = 9,
  boundsPadding,
  isLoading = false,
  height = 400,
  className,
  testId,
  children,
}: GeoMapProps) {
  const initialCenter = center ?? points[0]

  if (isLoading) {
    return (
      <div className={['pz-geo-map', className].filter(Boolean).join(' ')} style={{ width: '100%', height }} data-testid={testId}>
        <Skeleton style={{ width: '100%', height: '100%', borderRadius: 8 }} />
      </div>
    )
  }

  if (!initialCenter) {
    return <div className={['pz-geo-map', className].filter(Boolean).join(' ')} style={{ width: '100%', height }} data-testid={testId} />
  }

  return (
    <div className={['pz-geo-map', className].filter(Boolean).join(' ')} style={{ width: '100%', height }} data-testid={testId}>
      <MapContainer center={[initialCenter.lat, initialCenter.lon]} zoom={zoom} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.length > 0 && <FitBounds points={points} {...(boundsPadding ? { padding: boundsPadding } : {})} />}
        {children}
      </MapContainer>
    </div>
  )
}
