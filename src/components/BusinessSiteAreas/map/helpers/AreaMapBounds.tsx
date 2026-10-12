import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import type { LatLon } from '../../../GeoMap'

export function AreaMapBounds({ points }: { points: readonly LatLon[] }) {
  const map = useMap()

  useEffect(() => {
    const canvas = map.getContainer()
    const panel = canvas.closest('.pz-business-areas')?.querySelector('.pz-business-areas__panel')
    const fit = () => {
      const view = canvas.getBoundingClientRect()
      const overlay = panel?.getBoundingClientRect()
      const overlaps = overlay && overlay.bottom > view.top && overlay.top < view.bottom
        && overlay.right > view.left && overlay.left < view.right
      const coveredWidth = overlaps ? Math.max(0, view.right - overlay.left) : 0
      map.invalidateSize({ animate: false, pan: false })
      map.fitBounds(points.map((point): [number, number] => [point.lat, point.lon]), {
        paddingTopLeft: [24, 24],
        paddingBottomRight: [Math.min(coveredWidth, Math.max(0, view.width - 120)) + 24, 24],
        maxZoom: points.length === 1 ? 9 : 11,
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
  }, [map, points])

  return null
}
