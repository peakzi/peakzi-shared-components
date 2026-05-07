import {
  type ReactNode,
  type HTMLAttributes,
  type MouseEventHandler,
  useState,
} from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Badge } from '../Badge'
import type { BadgeVariant, BadgeSize } from '../Badge'

export interface SideNavProps extends HTMLAttributes<HTMLElement> {
  /** Logo or brand block at the top of the rail (shown when expanded). */
  brand?: ReactNode
  /** Compact icon shown instead of `brand` when the rail is collapsed. */
  brandIcon?: ReactNode
  /** Optional badge text shown after the brand (e.g. "ADMIN", "BETA"). Omit to hide. */
  badge?: string
  /** Variant for the brand badge. Defaults to 'brand'. */
  badgeVariant?: BadgeVariant
  /** Size for the brand badge. Defaults to 'sm'. */
  badgeSize?: BadgeSize
  /** `<SideNavGroup>` children. */
  children?: ReactNode
  /** Optional bottom-pinned content (e.g. user card, status). */
  footer?: ReactNode
  /** Accessible label for the nav landmark. Defaults to "Primary". */
  'aria-label'?: string

  // Collapse (desktop icon-only mode) --------------------------------
  /** Show a collapse/expand chevron in the brand header row (desktop only). */
  collapsible?: boolean
  /** Controlled collapsed state. Omit to use internal state. */
  collapsed?: boolean
  /** Initial collapsed state when uncontrolled. Defaults to false. */
  defaultCollapsed?: boolean
  /** Called when the collapsed state changes. */
  onCollapsedChange?: (collapsed: boolean) => void

  // Mobile drawer ----------------------------------------------------
  /** Whether the nav is open as a slide-in drawer on mobile (< 768px). */
  mobileOpen?: boolean
  /** Called when the mobile overlay or the built-in close button is clicked. */
  onMobileClose?: () => void
}

/**
 * **SideNav** — vertical navigation rail for app shells.
 *
 * Compose with `<SideNavGroup>` and `<SideNavItem>`. Sits inside
 * `.pz-app__rail` (see `_layouts.scss`).
 *
 * - `collapsible` — adds a chevron in the top-right of the brand row (desktop).
 * - `mobileOpen` + `onMobileClose` — turns the nav into a slide-in drawer on mobile.
 *   An X button appears automatically in the brand row on mobile; no extra footer needed.
 *
 * @example
 * <SideNav
 *   brand={<PeakziLogo size="sm" />}
 *   collapsible
 *   mobileOpen={drawerOpen}
 *   onMobileClose={() => setDrawerOpen(false)}
 * >
 *   <SideNavGroup label="Customers">
 *     <SideNavItem icon={<Users />} active>Accounts</SideNavItem>
 *   </SideNavGroup>
 * </SideNav>
 */
export function SideNav({
  brand,
  brandIcon,
  badge,
  badgeVariant = 'brand',
  badgeSize = 'sm',
  footer,
  children,
  className,
  'aria-label': ariaLabel = 'Primary',
  collapsible = false,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  mobileOpen = false,
  onMobileClose,
  ...rest
}: SideNavProps) {
  const isControlled = collapsedProp !== undefined
  const [collapsedState, setCollapsedState] = useState(defaultCollapsed)
  const collapsed = isControlled ? collapsedProp : collapsedState

  const toggle = () => {
    const next = !collapsed
    if (!isControlled) setCollapsedState(next)
    onCollapsedChange?.(next)
  }

  const cls = [
    'pz-sidenav',
    collapsed && 'pz-sidenav--collapsed',
    mobileOpen && 'pz-sidenav--mobile-open',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const hasBrandRow = brand || brandIcon || badge || onMobileClose

  return (
    <>
      {mobileOpen && (
        <button type="button" className="pz-sidenav__overlay" onClick={onMobileClose} aria-label="Close navigation" />
      )}
      <nav className={cls} aria-label={ariaLabel} {...rest}>
        {hasBrandRow && (
          <div className="pz-sidenav__brand">
            {/* Full wordmark — hidden in collapsed mode */}
            {brand && <span className="pz-sidenav__brand-content">{brand}</span>}
            {/* Compact icon — shown only in collapsed mode */}
            {brandIcon && <span className="pz-sidenav__brand-icon">{brandIcon}</span>}
            {badge && (
              <Badge variant={badgeVariant} size={badgeSize} className="pz-sidenav__badge">
                {badge}
              </Badge>
            )}
            {/* Close button — shown on mobile only (CSS), when drawer is used */}
            {onMobileClose && (
              <button
                type="button"
                className="pz-sidenav__close-btn"
                onClick={onMobileClose}
                aria-label="Close navigation"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
        <div className="pz-sidenav__body">{children}</div>
        {/* Bottom bar: footer content + collapse toggle share one row */}
        {(footer || collapsible) && (
          <div className="pz-sidenav__footer">
            {footer && <div className="pz-sidenav__footer-content">{footer}</div>}
            {collapsible && (
              <button
                type="button"
                className="pz-sidenav__collapse-btn"
                onClick={toggle}
                aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            )}
          </div>
        )}
      </nav>
    </>
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
  /** Icon node (typically a lucide-react icon at 20px). */
  icon?: ReactNode
  /** href for navigation — renders as `<a>` (preferred for crawlable nav). */
  href?: string
  /** Click handler — renders as `<button>` if no href. */
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  /** Marks the item as the current page. Sets `aria-current="page"`. */
  active?: boolean
  /** Optional badge content (count, "New", etc.). */
  badge?: ReactNode
  /**
   * Explicit label for the collapsed-mode tooltip (`data-label`).
   * Defaults to `children` when children is a plain string.
   */
  label?: string
  children?: ReactNode
  className?: string
}

export function SideNavItem({
  icon,
  href,
  onClick,
  active = false,
  badge,
  label,
  children,
  className,
}: SideNavItemProps) {
  const cls = ['pz-sidenav__item', active && 'pz-sidenav__item--active', className]
    .filter(Boolean)
    .join(' ')

  // data-label powers the CSS-only collapsed tooltip (content: attr(data-label))
  const tooltipLabel = label ?? (typeof children === 'string' ? children : undefined)

  const inner = (
    <>
      {icon && (
        <span className="pz-sidenav__item-icon" aria-hidden="true">
          {icon}
        </span>
      )}
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
          data-label={tooltipLabel}
        >
          {inner}
        </a>
      ) : (
        <button
          type="button"
          className={cls}
          aria-current={active ? 'page' : undefined}
          onClick={onClick}
          data-label={tooltipLabel}
        >
          {inner}
        </button>
      )}
    </li>
  )
}
SideNavItem.displayName = 'SideNavItem'
