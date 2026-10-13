import { ArrowRight } from 'lucide-react'
import { safeHref } from '../../utils/safeHref'
import { servicesStyle } from './helpers/appearance'
import { servicePricing } from './helpers/pricing'
import { tradeIcon } from './helpers/trade-icon'
import { ServiceGrid } from './service-grid/ServiceGrid'
import { ServicePriceTable } from './price-table/ServicePriceTable'
import type { BusinessSiteServicesProps } from './helpers/types'

export type {
  BusinessSiteServiceGroup, BusinessSiteServiceItem, BusinessSiteServiceImage,
  BusinessSiteServicesAppearance, BusinessSiteServicesLink, BusinessSiteServicesProps, BusinessSiteServiceTier,
} from './helpers/types'

export function BusinessSiteServices({
  groups, title, eyebrow, intro, hideSingleGroupHeading = false, viewAll,
  appearance = {}, sectionId, className,
}: BusinessSiteServicesProps) {
  const visibleGroups = (groups ?? []).flatMap((group) => {
    const services = (group.services ?? []).filter((service) => service?.title?.trim())
    return group?.trade?.trim() && services.length > 0 ? [{ ...group, services, pricing: servicePricing(services) }] : []
  })
  if (visibleGroups.length === 0) return null

  const sectionTitle = title?.trim()
  const sectionEyebrow = eyebrow?.trim() ?? (visibleGroups.some((group) => group.pricing.hasPrices) ? 'Services and prices' : 'Services')
  const viewAllHref = safeHref(viewAll?.href)
  const hideGroupHeading = hideSingleGroupHeading && Boolean(sectionTitle) && visibleGroups.length === 1
  const TradeHeading = sectionTitle ? 'h3' : 'h2'

  return (
    <section
      id={sectionId}
      className={['pz-business-services', className].filter(Boolean).join(' ')}
      aria-label={sectionTitle || 'Services'}
      data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'}
      data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'}
      data-single-group-heading={hideGroupHeading ? 'hidden' : 'visible'}
      style={servicesStyle(appearance)}
    >
      <div className="pz-business-services__inner">
        {(sectionTitle || sectionEyebrow || intro?.trim()) && (
          <div className="pz-business-services__intro">
            {sectionEyebrow && <span className="pz-business-services__eyebrow">{sectionEyebrow}</span>}
            {sectionTitle && <h2 className="pz-business-services__title">{sectionTitle}</h2>}
            {intro?.trim() && <p>{intro.trim()}</p>}
          </div>
        )}
        {visibleGroups.map((group) => {
          const groupTitle = group.title?.trim() || group.trade.trim()
          const count = typeof group.totalCount === 'number' && Number.isSafeInteger(group.totalCount) && group.totalCount >= group.services.length
            ? group.totalCount : group.services.length
          const icon = tradeIcon(group.trade, group.iconName)
          return (
            <div className="pz-business-services__group" key={group.id} data-layout={group.pricing.hasPrices ? 'prices' : 'grid'}>
              {!hideGroupHeading && (
                <div className="pz-business-services__group-head">
                  {icon && <span className="pz-business-services__icon" aria-hidden="true">{icon}</span>}
                  <TradeHeading>{groupTitle}</TradeHeading>
                  <span className="pz-business-services__count">{count} {count === 1 ? 'service' : 'services'}</span>
                </div>
              )}
              {group.pricing.hasPrices
                ? <ServicePriceTable rows={group.pricing.rows} columns={group.pricing.columns} title={groupTitle} />
                : <ServiceGrid services={group.services} headingLevel={sectionTitle && !hideGroupHeading ? 'h4' : 'h3'} />}
            </div>
          )
        })}
        {viewAllHref && viewAll?.label?.trim() && (
          <a className="pz-business-services__view-all" href={viewAllHref}>
            {viewAll.label.trim()}<ArrowRight aria-hidden="true" size={18} />
          </a>
        )}
      </div>
    </section>
  )
}

BusinessSiteServices.displayName = 'BusinessSiteServices'
