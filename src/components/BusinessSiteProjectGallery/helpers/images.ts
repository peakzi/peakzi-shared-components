import { safeHref } from '../../../utils/safeHref'
import type { BusinessSiteProjectImage } from './types'

export function uniqueGalleryImages(items: readonly BusinessSiteProjectImage[]): BusinessSiteProjectImage[] {
  const seen = new Set<string>()
  return items.flatMap((item) => {
    const src = safeHref(item.src, true)
    const alt = item.alt.trim()
    if (!src || !alt || seen.has(src)) return []
    seen.add(src)
    const { width, height, ...image } = item
    const dimensions = typeof width === 'number' && Number.isInteger(width) && width > 0
      && typeof height === 'number' && Number.isInteger(height) && height > 0
      ? { width, height } : {}
    return [{ ...image, ...dimensions, src, alt }]
  })
}
