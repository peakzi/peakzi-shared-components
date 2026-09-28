export interface LatLon {
  lat: number
  lon: number
}

/** Bounding box corners for a set of [lat, lng] pairs — used to auto-fit map viewports. */
export function findExtremeCorners(locations: Array<[number, number]>): { corner1: LatLon; corner2: LatLon } {
  let minLat = Number.MAX_VALUE
  let maxLat = -Number.MAX_VALUE
  let minLng = Number.MAX_VALUE
  let maxLng = -Number.MAX_VALUE

  for (const [lat, lng] of locations) {
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
    minLng = Math.min(minLng, lng)
    maxLng = Math.max(maxLng, lng)
  }

  return {
    corner1: { lat: minLat, lon: minLng },
    corner2: { lat: maxLat, lon: maxLng },
  }
}
