import { safeHref } from '../../../utils/safeHref'
import type { BusinessSiteProjectImage } from './types'

export function uniqueGalleryImages(items: readonly BusinessSiteProjectImage[]): BusinessSiteProjectImage[] {
  const seen = new Set<string>()
  return items.flatMap((item) => {
    const src = safeHref(item.src, true)
    const alt = item.alt.trim()
    if (!src || !alt || seen.has(src)) return []
    seen.add(src)
    return [{ ...item, src, alt }]
  })
}
