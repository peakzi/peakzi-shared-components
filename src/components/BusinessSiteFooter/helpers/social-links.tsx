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

export function footerSocialLink(link: BusinessSiteFooterSocialLink, size: number | string) {
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" title={link.label}>
      <Icon name={link.iconName} color="currentColor" size={size} />
      <span className="pz-business-footer__sr-only">{link.label} (opens in a new tab)</span>
    </a>
  )
}
