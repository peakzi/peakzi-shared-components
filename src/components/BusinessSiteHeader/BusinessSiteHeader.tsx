import { Menu } from 'lucide-react'
import { headerStyle } from './helpers/appearance'
import { actionLink, navItems, safeHref } from './helpers/links'
import type { BusinessSiteHeaderProps } from './helpers/types'

export type {
  BusinessSiteHeaderAction,
  BusinessSiteHeaderAppearance,
  BusinessSiteHeaderButtonRadius,
  BusinessSiteHeaderFont,
  BusinessSiteHeaderIconName,
  BusinessSiteHeaderLink,
  BusinessSiteHeaderLogo,
  BusinessSiteHeaderProps,
  BusinessSiteHeaderSubmenuLink,
} from './helpers/types'

export function BusinessSiteHeader({
  logo,
  menu,
  actions = [],
  appearance = {},
  currentPath,
  navigationLabel = 'Primary navigation',
  className,
}: BusinessSiteHeaderProps) {
  const position = ['left', 'center', 'right'].includes(appearance.itemsPosition ?? '')
    ? appearance.itemsPosition
    : 'left'
  const layoutWidth = appearance.layoutWidth === 'full' ? 'full' : 'contained'
  const density = appearance.density === 'compact' ? 'compact' : 'comfortable'
  const logoHref = safeHref(logo.homeHref) ?? '/'
  const logoSrc = safeHref(logo.src, true)
  const validMenu = menu.filter((item) =>
    item?.label?.trim() && (
      safeHref(item.href) || item.children?.some((child) => child?.label?.trim() && safeHref(child.href))
    ),
  )
  const validActions = actions.filter((action) => safeHref(action.href) && action.label?.trim())
  const primaryAction = validActions.find((action) => action.type === 'primary')
  const mobileMenuActions = validActions.filter((action) => action !== primaryAction)

  return (
    <header
      className={['pz-business-header', className].filter(Boolean).join(' ')}
      data-layout-width={layoutWidth}
      data-items-position={position}
      data-density={density}
      data-sticky={appearance.sticky === true ? 'true' : 'false'}
      data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'}
      style={headerStyle(appearance)}
    >
      <div className="pz-business-header__inner">
        <a className="pz-business-header__brand" href={logoHref}>
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={logo.alt}
              width={Number.isFinite(logo.width) && logo.width > 0 ? logo.width : 150}
              height={Number.isFinite(logo.height) && logo.height > 0 ? logo.height : 44}
              decoding="async"
            />
          ) : (
            <span>{logo.alt}</span>
          )}
        </a>

        {validMenu.length > 0 && (
          <nav className="pz-business-header__desktop-nav" aria-label={navigationLabel}>
            <ul>{navItems(validMenu, currentPath)}</ul>
          </nav>
        )}

        <div className="pz-business-header__desktop-actions">
          {validActions.map((action) => actionLink(action))}
        </div>

        <div className="pz-business-header__mobile-controls">
          {primaryAction && actionLink(primaryAction, 'pz-business-header__mobile-primary')}
          {(validMenu.length > 0 || mobileMenuActions.length > 0) && (
            <details className="pz-business-header__mobile-menu">
              <summary aria-label="Menu">
                <Menu aria-hidden="true" size={22} strokeWidth={1.75} />
                <span>Menu</span>
              </summary>
              <div className="pz-business-header__mobile-panel">
                {validMenu.length > 0 && (
                  <nav aria-label={navigationLabel}>
                    <ul>{navItems(validMenu, currentPath)}</ul>
                  </nav>
                )}
                {mobileMenuActions.length > 0 && (
                  <div className="pz-business-header__mobile-actions">
                    {mobileMenuActions.map((action) => actionLink(action))}
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      </div>
    </header>
  )
}

BusinessSiteHeader.displayName = 'BusinessSiteHeader'
