import L from 'leaflet'

export interface MapIconOptions {
  size?: [number, number]
  /** Explicit fill; omit to use the token-driven default from GeoMap.scss. */
  color?: string
  emphasized?: boolean
}

const SVG_NS = 'http://www.w3.org/2000/svg'
// Characters that could break out of a CSS declaration or markup context.
const UNSAFE_COLOR_CHARS = /[<>"'`;:{}\\]/

/**
 * Accepts only values the browser parses as a CSS color (hex, rgb(), hsl(),
 * named colors, `var(--token)`). Anything else is dropped so the pin falls
 * back to its token default instead of carrying caller input into the DOM.
 */
export function isSafeColor(value: string): boolean {
  if (!value || value.length > 64 || UNSAFE_COLOR_CHARS.test(value)) return false
  if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
    return CSS.supports('color', value)
  }
  return /^[#\w\s(),.%-]+$/.test(value)
}

/**
 * A small colored dot marker, generated inline — no external image request.
 * Fill and stroke come from CSS tokens (`.pz-map-marker-icon` in GeoMap.scss),
 * so pins follow theme changes; only a validated caller-supplied `color` is
 * set, via the DOM rather than an HTML string.
 */
export function createMapIcon({ size = [16, 16], color, emphasized = false }: MapIconOptions = {}): L.DivIcon {
  const [width, height] = size

  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))
  svg.setAttribute('viewBox', '0 0 24 24')

  const circle = document.createElementNS(SVG_NS, 'circle')
  circle.setAttribute('cx', '12')
  circle.setAttribute('cy', '12')
  circle.setAttribute('r', '9')
  if (color && isSafeColor(color)) circle.setAttribute('style', `fill:${color}`)
  svg.appendChild(circle)

  return L.divIcon({
    className: ['pz-map-marker-icon', emphasized && 'pz-map-marker-icon--emphasized'].filter(Boolean).join(' '),
    html: svg as unknown as HTMLElement,
    iconSize: [width, height],
    iconAnchor: [width / 2, height / 2],
  })
}
