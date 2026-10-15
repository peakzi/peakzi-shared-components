import { safeHref } from '../../../utils/safeHref'
import type { BusinessSiteArea } from './types'

export function mapAreas(areas: readonly BusinessSiteArea[]) {
  return areas.filter((area): area is BusinessSiteArea & { position: { lat: number; lon: number } } => {
    const point = area.position
    return !!area.label.trim() && (area.href === undefined || !!safeHref(area.href)) && !!point
      && Number.isFinite(point.lat) && Math.abs(point.lat) <= 90
      && Number.isFinite(point.lon) && Math.abs(point.lon) <= 180
  })
}
