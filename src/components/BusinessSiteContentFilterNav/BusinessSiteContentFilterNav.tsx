import { safeHref } from '../../utils/safeHref'
import { contentFilterNavStyle } from './helpers/appearance'
import { ContentFilterNavSheet } from './sheet/ContentFilterNavSheet'
import type { BusinessSiteContentFilterNavProps } from './helpers/types'

export type {
  BusinessSiteContentFilterNavAppearance,
  BusinessSiteContentFilterNavProps,
  BusinessSiteContentFilterNavTrade,
} from './helpers/types'

export function BusinessSiteContentFilterNav({
  trades,
  activeTrade,
  activeService = null,
  buildHref,
  ariaLabel = 'Filter by topic',
  mobileDialogTitle = 'Browse topics',
  appearance = {},
  sectionId,
  className,
}: BusinessSiteContentFilterNavProps) {
  const visibleTrades = trades
    .filter((trade) => trade?.key?.trim() && trade?.label?.trim())
    .map((trade) => ({ ...trade, services: trade.services.filter((service) => service?.trim()) }))
    .filter((trade) => trade.services.length > 0)
  if (visibleTrades.length === 0) return null

  const current = visibleTrades.find((trade) => trade.key === activeTrade) ?? visibleTrades[0]!

  const tabs = visibleTrades.flatMap((trade) => {
    const href = safeHref(buildHref(trade.key, trade.services[0]))
    return href ? [{ trade, href, on: trade.key === current.key }] : []
  })

  const chips = current.services.flatMap((service) => {
    const href = safeHref(buildHref(current.key, service))
    return href ? [{ service, href, on: service === activeService }] : []
  })

  return (
    <nav
      id={sectionId}
      aria-label={ariaLabel}
      className={['pz-business-content-filter-nav', className].filter(Boolean).join(' ')}
      data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'}
      style={contentFilterNavStyle(appearance)}
    >
      <div className="pz-business-content-filter-nav__desktop">
        <div className="pz-business-content-filter-nav__tabs">
          {tabs.map(({ trade, href, on }) => (
            <a
              key={trade.key}
              href={href}
              aria-current={on ? 'page' : undefined}
              className="pz-business-content-filter-nav__tab"
              data-active={on || undefined}
            >
              {trade.label}
            </a>
          ))}
        </div>
        <div className="pz-business-content-filter-nav__chips">
          {chips.map(({ service, href, on }) => (
            <a
              key={service}
              href={href}
              aria-current={on ? 'page' : undefined}
              className="pz-business-content-filter-nav__chip"
              data-active={on || undefined}
            >
              {service}
            </a>
          ))}
        </div>
      </div>
      <ContentFilterNavSheet
        className="pz-business-content-filter-nav__mobile"
        trades={visibleTrades}
        currentTradeKey={current.key}
        activeService={activeService}
        hrefFor={buildHref}
        dialogTitle={mobileDialogTitle}
      />
    </nav>
  )
}

BusinessSiteContentFilterNav.displayName = 'BusinessSiteContentFilterNav'
