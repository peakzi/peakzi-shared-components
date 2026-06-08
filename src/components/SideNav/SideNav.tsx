import {
  type ReactNode,
  type HTMLAttributes,
  type MouseEventHandler,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Badge } from '../Badge'
import type { BadgeVariant, BadgeSize } from '../Badge'

const SideNavContext = createContext<{ showTooltip: boolean; collapsed: boolean }>({
  showTooltip: false,
  collapsed: false,
})

interface SideNavGroupContextValue {
  accordion: boolean
  activeId: string | null
  setActiveId: (id: string | null) => void
}
const SideNavGroupContext = createContext<SideNavGroupContextValue>({
  accordion: false,
  activeId: null,
  setActiveId: () => {},
})

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
  /** Show a tooltip on all SideNavItems on hover (useful for narrow but not collapsed rails). */
  showTooltip?: boolean
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
  showTooltip = false,
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
    showTooltip && 'pz-sidenav--show-tooltip',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const hasBrandRow = brand || brandIcon || badge || onMobileClose

  return (
    <SideNavContext.Provider value={{ showTooltip, collapsed: collapsed ?? false }}>
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
    </SideNavContext.Provider>
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
  /** Only one SideNavCollapsible can be open at a time within this group. */
  accordion?: boolean
}

export function SideNavGroup({ label, children, className, accordion = false, ...rest }: SideNavGroupProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const cls = ['pz-sidenav__group', className].filter(Boolean).join(' ')
  return (
    <SideNavGroupContext.Provider value={{ accordion, activeId, setActiveId }}>
      <div className={cls} {...rest}>
        {label && <div className="pz-sidenav__group-label">{label}</div>}
        <ul className="pz-sidenav__items" role="list">
          {children}
        </ul>
      </div>
    </SideNavGroupContext.Provider>
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
   * Explicit label for the tooltip (`data-label`).
   * Defaults to `children` when children is a plain string.
   */
  label?: string
  /**
   * Show a tooltip with the full label on hover regardless of collapsed state.
   * Useful when the label text may be truncated due to sidebar width.
   */
  showTooltip?: boolean
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
  showTooltip,
  children,
  className,
}: SideNavItemProps) {
  const ctx = useContext(SideNavContext)
  const resolvedShowTooltip = showTooltip ?? ctx.showTooltip
  const cls = [
    'pz-sidenav__item',
    active && 'pz-sidenav__item--active',
    resolvedShowTooltip && 'pz-sidenav__item--show-tooltip',
    className,
  ]
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

// =============================================================================
// SideNavCollapsible
// =============================================================================

export interface SideNavCollapsibleProps {
  /** Icon node (lucide-react icon at 20px). */
  icon?: ReactNode
  /** Trigger label — also used as the collapsed-mode tooltip. */
  label: string
  /** Optional badge on the trigger. */
  badge?: ReactNode
  /** Highlight the trigger (e.g. when a child is the active page). */
  active?: boolean
  /** Open by default when uncontrolled. */
  defaultOpen?: boolean
  /** Controlled open state. */
  open?: boolean
  /** Called when open state changes. */
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
  className?: string
}

export function SideNavCollapsible({
  icon,
  label,
  badge,
  active = false,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  children,
  className,
}: SideNavCollapsibleProps) {
  const { showTooltip, collapsed } = useContext(SideNavContext)
  const { accordion, activeId, setActiveId } = useContext(SideNavGroupContext)

  // Stable ID used as the accordion key for this item
  const uid = useId()
  const isFirstRender = useRef(true)

  // In accordion mode: register as active on mount if defaultOpen
  useEffect(() => {
    if (accordion && defaultOpen && isFirstRender.current) {
      setActiveId(uid)
    }
    isFirstRender.current = false
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isControlled = openProp !== undefined
  const [openState, setOpenState] = useState(defaultOpen)

  // Derive open: accordion overrides uncontrolled/controlled state
  const open = accordion
    ? activeId === uid
    : isControlled
      ? openProp!
      : openState

  const toggle = () => {
    if (collapsed) return
    if (accordion) {
      const next = activeId === uid ? null : uid
      setActiveId(next)
      onOpenChange?.(next !== null)
    } else {
      const next = !open
      if (!isControlled) setOpenState(next)
      onOpenChange?.(next)
    }
  }

  // ---- Collapsed-mode flyout ----------------------------------------
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [flyoutVisible, setFlyoutVisible] = useState(false)
  const [flyoutPos, setFlyoutPos] = useState({ top: 0, left: 0 })

  const openFlyout = () => {
    if (!collapsed || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setFlyoutPos({ top: rect.top, left: rect.right + 8 })
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setFlyoutVisible(true)
  }

  const scheduleFlyoutClose = () => {
    closeTimerRef.current = setTimeout(() => setFlyoutVisible(false), 120)
  }

  const cancelFlyoutClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }

  // Cleanup timer on unmount
  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }, [])

  // -------------------------------------------------------------------

  const triggerCls = [
    'pz-sidenav__item',
    'pz-sidenav__collapsible-trigger',
    active && 'pz-sidenav__item--active',
    showTooltip && 'pz-sidenav__item--show-tooltip',
    className,
  ].filter(Boolean).join(' ')

  return (
    <li className="pz-sidenav__collapsible">
      <button
        ref={triggerRef}
        type="button"
        className={triggerCls}
        onClick={toggle}
        onMouseEnter={openFlyout}
        onMouseLeave={scheduleFlyoutClose}
        aria-expanded={collapsed ? undefined : open}
        data-label={label}
      >
        {icon && (
          <span className="pz-sidenav__item-icon" aria-hidden="true">{icon}</span>
        )}
        <span className="pz-sidenav__item-label">{label}</span>
        {badge != null && <span className="pz-sidenav__item-badge">{badge}</span>}
        <span
          className={[
            'pz-sidenav__collapsible-chevron',
            open && 'pz-sidenav__collapsible-chevron--open',
          ].filter(Boolean).join(' ')}
          aria-hidden="true"
        >
          <ChevronDown size={14} />
        </span>
      </button>

      {/* Inline sub-items — hidden in collapsed mode via CSS */}
      <div
        className={['pz-sidenav__subitems', open && 'pz-sidenav__subitems--open'].filter(Boolean).join(' ')}
        aria-hidden={!open}
      >
        <ul className="pz-sidenav__subitems-inner" role="list">
          {children}
        </ul>
      </div>

      {/* Flyout — portal-rendered so it escapes overflow constraints */}
      {collapsed && flyoutVisible && typeof document !== 'undefined' && createPortal(
        <div
          className="pz-sidenav__flyout"
          style={{ top: flyoutPos.top, left: flyoutPos.left }}
          onMouseEnter={cancelFlyoutClose}
          onMouseLeave={scheduleFlyoutClose}
          role="navigation"
          aria-label={label}
        >
          <div className="pz-sidenav__flyout-label">{label}</div>
          <ul className="pz-sidenav__flyout-items" role="list">
            {children}
          </ul>
        </div>,
        document.body,
      )}
    </li>
  )
}
SideNavCollapsible.displayName = 'SideNavCollapsible'
