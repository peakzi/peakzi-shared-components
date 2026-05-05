import { type ReactNode, type HTMLAttributes } from 'react'
import { Menu } from 'lucide-react'

export interface TopBarProps extends HTMLAttributes<HTMLElement> {
  /**
   * Called when the mobile hamburger button is tapped.
   * Wire this to your `SideNav` `mobileOpen` state setter.
   * When omitted the hamburger button is not rendered.
   */
  onMenuClick?: () => void
  /** Left slot — page title, breadcrumbs, search, etc. */
  start?: ReactNode
  /** Right slot — user avatar, notifications, actions, etc. */
  end?: ReactNode
  children?: ReactNode
}

/**
 * **TopBar** — horizontal header bar for the `pz-app__topbar` grid area.
 *
 * On mobile (< 768px) a hamburger button appears at the far left; on desktop
 * it is hidden. Wire `onMenuClick` to the `SideNav` `mobileOpen` state:
 *
 * @example
 * const [drawerOpen, setDrawerOpen] = useState(false)
 *
 * <TopBar onMenuClick={() => setDrawerOpen(true)} start={<h1>Dashboard</h1>} />
 * <SideNav mobileOpen={drawerOpen} onMobileClose={() => setDrawerOpen(false)} />
 */
export function TopBar({ onMenuClick, start, end, children, className, ...rest }: TopBarProps) {
  const cls = ['pz-topbar', className].filter(Boolean).join(' ')

  return (
    <header className={cls} {...rest}>
      {/* Hamburger — CSS-hidden on desktop (≥768px), shown on mobile */}
      {onMenuClick && (
        <button
          type="button"
          className="pz-topbar__menu-btn"
          onClick={onMenuClick}
          aria-label="Open navigation"
          aria-haspopup="dialog"
        >
          <Menu size={20} />
        </button>
      )}

      {start && <div className="pz-topbar__start">{start}</div>}

      {children}

      {end && <div className="pz-topbar__end">{end}</div>}
    </header>
  )
}
TopBar.displayName = 'TopBar'
