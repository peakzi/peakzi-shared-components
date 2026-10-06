import { safeHref } from '../../../utils/safeHref'
import type { BusinessSiteFooterLink } from './types'

export function validFooterLinks(links: readonly BusinessSiteFooterLink[]) {
  return links.filter((link) => link?.label?.trim() && safeHref(link.href))
}

export function footerLink(link: BusinessSiteFooterLink) {
  const href = safeHref(link.href)
  if (!href || !link.label?.trim()) return null
  const opensNewTab = link.newTab === true && /^https?:\/\//i.test(href)

  return (
    <a
      key={link.id}
      href={href}
      target={opensNewTab ? '_blank' : undefined}
      rel={opensNewTab ? 'noopener noreferrer' : undefined}
    >
      {link.label}
    </a>
  )
}
