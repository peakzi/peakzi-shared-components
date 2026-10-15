import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import type { LatLon } from '../../../GeoMap'

export function AreaMapBounds({ points, padding = 24, defaultZoom, selectedPoint }: {
  points: readonly LatLon[]; padding?: number; defaultZoom?: number | undefined; selectedPoint?: LatLon | undefined
}) {
  const map = useMap()

  useEffect(() => {
    const canvas = map.getContainer()
    const section = canvas.closest('.pz-business-areas')
    const panel = section?.querySelector('.pz-business-areas__panel')
    const startingZoom = typeof defaultZoom === 'number' && Number.isFinite(defaultZoom)
      ? Math.min(18, Math.max(1, Math.round(defaultZoom))) : undefined
    const fit = () => {
      const view = canvas.getBoundingClientRect()
      const overlay = panel?.getBoundingClientRect()
      // Directory panels never cover the map. Elsewhere, ignore fractional-pixel
      // edge contact so stacked layouts do not accidentally reserve overlay space.
      const overlaps = section?.getAttribute('data-variant') !== 'directory' && overlay
        && Math.min(overlay.bottom, view.bottom) - Math.max(overlay.top, view.top) > 1
        && Math.min(overlay.right, view.right) - Math.max(overlay.left, view.left) > 1
      const coveredWidth = overlaps ? Math.max(0, view.right - overlay.left) : 0
      map.invalidateSize({ animate: false, pan: false })
      map.fitBounds(points.map((point): [number, number] => [point.lat, point.lon]), {
        paddingTopLeft: [padding, padding],
        paddingBottomRight: [Math.min(coveredWidth, Math.max(0, view.width - 120)) + padding, padding],
        // Prefer a close view, but never override the fit and crop boundary pins.
        maxZoom: startingZoom ?? (points.length === 1 ? 9 : 11),
        animate: false,
      })
    }
    map.zoomControl?.setPosition('topleft')
    map.attributionControl?.setPosition('bottomleft')
    fit()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', fit)
      return () => window.removeEventListener('resize', fit)
    }
    const observer = new ResizeObserver(fit)
    observer.observe(canvas)
    if (panel) observer.observe(panel)
    return () => observer.disconnect()
  }, [map, points, padding, defaultZoom])

  useEffect(() => {
    if (selectedPoint) map.panInside([selectedPoint.lat, selectedPoint.lon], { padding: [padding, padding], animate: false })
  }, [map, selectedPoint, padding])

  return null
}
