import { type ReactNode, type HTMLAttributes, type MouseEventHandler } from 'react'

// =============================================================================
// SideNav — root
// =============================================================================

export interface SideNavProps extends HTMLAttributes<HTMLElement> {
  /** Logo or brand block at the top of the rail. */
  brand?: ReactNode
  /** Optional badge text shown after the brand (e.g. "ADMIN", "BETA"). Omit to hide. */
  badge?: string
  /** `<SideNavGroup>` children. */
  children?: ReactNode
  /** Optional bottom-pinned content (e.g. user card, status). */
  footer?: ReactNode
  /** Accessible label for the nav landmark. Defaults to "Primary". */
  'aria-label'?: string
}

/**
 * **SideNav** — vertical navigation rail for app shells.
 *
 * Compose with `<SideNavGroup>` and `<SideNavItem>`. Sits inside
 * `.pz-app__rail` (see `_layouts.scss`).
 *
 * @example
 * <SideNav brand={<PeakziLogo size="sm" />}>
 *   <SideNavGroup label="Customers">
 *     <SideNavItem icon={<Users />} active>Accounts</SideNavItem>
 *     <SideNavItem icon={<Building />}>Business</SideNavItem>
 *   </SideNavGroup>
 *   <SideNavGroup label="Operations">
 *     <SideNavItem icon={<ClipboardList />}>Admin tasks</SideNavItem>
 *   </SideNavGroup>
 * </SideNav>
 */
export function SideNav({
  brand,
  badge,
  footer,
  children,
  className,
  'aria-label': ariaLabel = 'Primary',
  ...rest
}: SideNavProps) {
  const cls = ['pz-sidenav', className].filter(Boolean).join(' ')

  return (
    <nav className={cls} aria-label={ariaLabel} {...rest}>
      {(brand || badge) && (
        <div className="pz-sidenav__brand">
          {brand}
          {badge && <span className="pz-sidenav__badge pz-badge pz-badge--purple pz-badge--sm">{badge}</span>}
        </div>
      )}
      <div className="pz-sidenav__body">{children}</div>
      {footer && <div className="pz-sidenav__footer">{footer}</div>}
    </nav>
  )
}
SideNav.displayName = 'SideNav'

// =============================================================================
// SideNavGroup
// =============================================================================

export interface SideNavGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Group heading text (rendered uppercase + spaced). */
  label?: ReactNode
  children?: ReactNode
}

export function SideNavGroup({ label, children, className, ...rest }: SideNavGroupProps) {
  const cls = ['pz-sidenav__group', className].filter(Boolean).join(' ')
  return (
    <div className={cls} {...rest}>
      {label && <div className="pz-sidenav__group-label">{label}</div>}
      <ul className="pz-sidenav__items" role="list">
        {children}
      </ul>
    </div>
  )
}
SideNavGroup.displayName = 'SideNavGroup'

// =============================================================================
// SideNavItem
// =============================================================================

export interface SideNavItemProps {
  /** Icon node (typically a lucide-react icon at 16px). */
  icon?: ReactNode
  /** href for navigation — renders as `<a>` (preferred for crawlable nav). */
  href?: string
  /** Click handler — renders as `<button>` if no href. */
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  /** Marks the item as the current page. Sets `aria-current="page"`. */
  active?: boolean
  /** Optional badge content (count, "New", etc.). */
  badge?: ReactNode
  children?: ReactNode
  className?: string
}

export function SideNavItem({
  icon,
  href,
  onClick,
  active = false,
  badge,
  children,
  className,
}: SideNavItemProps) {
  const cls = [
    'pz-sidenav__item',
    active && 'pz-sidenav__item--active',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const inner = (
    <>
      {icon && <span className="pz-sidenav__item-icon" aria-hidden="true">{icon}</span>}
      <span className="pz-sidenav__item-label">{children}</span>
      {badge != null && <span className="pz-sidenav__item-badge">{badge}</span>}
    </>
  )

  return (
    <li>
      {href ? (
        <a
          className={cls}
          href={href}
          aria-current={active ? 'page' : undefined}
          onClick={onClick}
        >
          {inner}
        </a>
      ) : (
        <button
          type="button"
          className={cls}
          aria-current={active ? 'page' : undefined}
          onClick={onClick}
        >
          {inner}
        </button>
      )}
    </li>
  )
}
SideNavItem.displayName = 'SideNavItem'
