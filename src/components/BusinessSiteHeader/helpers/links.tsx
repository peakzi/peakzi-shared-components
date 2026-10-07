import { ChevronDown } from 'lucide-react'
import { safeHref } from '../../../utils/safeHref'
import { actionIcon } from './icons'
import type { BusinessSiteHeaderAction, BusinessSiteHeaderLink } from './types'

export { safeHref }

export function actionLink(action: BusinessSiteHeaderAction, className = '') {
  const href = safeHref(action.href)
  if (!href || !action.label?.trim()) return null
  const opensNewTab = action.newTab === true && /^https?:\/\//i.test(href)
  const icon = actionIcon(action.iconName)
  return (
    <a
      key={action.id}
      className={['pz-business-header__action', `pz-business-header__action--${action.type === 'primary' ? 'primary' : 'secondary'}`, className].filter(Boolean).join(' ')}
      href={href}
      target={opensNewTab ? '_blank' : undefined}
      rel={opensNewTab ? 'noopener noreferrer' : undefined}
      data-action-id={action.id}
    >
      {action.iconPosition !== 'after' && icon}
      <span>{action.label}</span>
      {action.iconPosition === 'after' && icon}
    </a>
  )
}

export function navItems(items: readonly BusinessSiteHeaderLink[], currentPath?: string) {
  return items.map((item) => {
    if (!item?.label?.trim()) return null
    const href = safeHref(item.href)
    const children = Array.isArray(item.children)
      ? item.children.filter((child) => child?.label?.trim() && safeHref(child.href))
      : []
    if (children.length === 0) {
      return href ? (
        <li key={item.id}>
          <a href={href} aria-current={currentPath === href ? 'page' : undefined}>{item.label}</a>
        </li>
      ) : null
    }
    return (
      <li key={item.id} className="pz-business-header__has-submenu">
        <details>
          <summary>
            <span>{item.label}</span>
            <ChevronDown aria-hidden="true" size={16} strokeWidth={1.75} />
          </summary>
          <ul>
            {href && (
              <li>
                <a href={href} aria-current={currentPath === href ? 'page' : undefined}>
                  All {item.label}
                </a>
              </li>
            )}
            {children.map((child) => (
              <li key={child.id}>
                <a
                  href={safeHref(child.href)!}
                  aria-current={currentPath === child.href ? 'page' : undefined}
                >
                  {child.label}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </li>
    )
  })
}
