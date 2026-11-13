import { Icon } from '../../Icon'
import { getIconDefinition } from '../../Icon/registry'
import { safeHref } from '../../../utils/safeHref'
import type { BusinessSiteFooterSocialLink } from './types'

export function validFooterSocialLinks(links: readonly BusinessSiteFooterSocialLink[]) {
  return links.flatMap((link) => {
    const href = safeHref(link?.href)
    if (!href || !/^https?:\/\//i.test(href)
      || typeof link?.id !== 'string' || !link.id.trim()
      || typeof link?.label !== 'string' || !link.label.trim()
      || !getIconDefinition(link.iconName)) return []
    const url = new URL(href)
    if (url.username || url.password) return []
    return [{ ...link, id: link.id.trim(), label: link.label.trim(), href }]
  })
}

function proportionalSize(size: number | string, factor: number) {
  if (factor === 1) return size
  return typeof size === 'number' ? size * factor : `calc(${size} * ${factor})`
}

export function footerSocialLink(link: BusinessSiteFooterSocialLink, size: number | string) {
  const [, , width = 1, height = 1] = getIconDefinition(link.iconName)?.viewBox.trim().split(/[\s,]+/).map(Number) ?? []
  const aspectRatio = width > 0 && height > 0 && Number.isFinite(width / height) ? width / height : 1
  const opticalScale = link.iconName === 'bbb' ? 0.9 : 1

  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" title={link.label}>
      <Icon name={link.iconName} color="currentColor" size={size} style={{
        // Let layout account for the artwork's shape instead of leaving square SVG side gaps.
        width: proportionalSize(size, aspectRatio * opticalScale),
        height: proportionalSize(size, opticalScale),
      }} />
      <span className="pz-business-footer__sr-only">{link.label} (opens in a new tab)</span>
    </a>
  )
}
