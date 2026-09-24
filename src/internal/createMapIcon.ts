import L from 'leaflet'

/**
 * A small colored dot marker, generated inline — no external image request.
 * Replaces the original components' hot-linked flaticon.com icons.
 */
export function createMapIcon(color: string, size: [number, number] = [16, 16]): L.DivIcon {
  const [width, height] = size
  return L.divIcon({
    className: 'pz-map-marker-icon',
    html: `<svg width="${width}" height="${height}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="${color}" stroke="#ffffff" stroke-width="2"/></svg>`,
    iconSize: [width, height],
    iconAnchor: [width / 2, height / 2],
  })
}
