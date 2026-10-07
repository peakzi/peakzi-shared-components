import { ArrowRight } from 'lucide-react'
import { businessSiteIcon } from '../../utils/businessSiteIcon'
import { safeHref } from '../../utils/safeHref'
import { servicesStyle } from './helpers/appearance'
import type {
  BusinessSiteServiceItem,
  BusinessSiteServicesProps,
} from './helpers/types'

export type {
  BusinessSiteServiceGroup,
  BusinessSiteServiceItem,
  BusinessSiteServiceImage,
  BusinessSiteServicesAppearance,
  BusinessSiteServicesLink,
  BusinessSiteServicesProps,
  BusinessSiteServiceTier,
} from './helpers/types'

function ServiceCard({ service, headingLevel }: { service: BusinessSiteServiceItem; headingLevel: 'h3' | 'h4' }) {
  const href = safeHref(service.href)
  const imageSrc = safeHref(service.image?.src, true)
  const image = imageSrc && service.image?.alt?.trim() && Number.isFinite(service.image.width) &&
    service.image.width > 0 && Number.isFinite(service.image.height) && service.image.height > 0
    ? { ...service.image, src: imageSrc, alt: service.image.alt.trim() }
    : null
  const Heading = headingLevel
  const summary = service.summary?.trim()
  const tiers = (service.tiers ?? []).filter((tier) => tier.label?.trim() && tier.value?.trim())
  const actionLabel = service.actionLabel?.trim()
  const content = (
    <>
      {image && <img className="pz-business-services__image" src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />}
      <div className="pz-business-services__card-content">
        {service.iconName && <span className="pz-business-services__icon" aria-hidden="true">{businessSiteIcon(service.iconName)}</span>}
        <div className="pz-business-services__card-copy">
          <Heading className="pz-business-services__card-title">{service.title.trim()}</Heading>
          {summary && <p className="pz-business-services__summary">{summary}</p>}
        </div>
        {(tiers.length > 0 || (href && actionLabel)) && (
          <div className="pz-business-services__card-bottom">
            {tiers.map((tier) => (
              <span className="pz-business-services__tier" key={`${tier.label}-${tier.value}`}>
                <span>{tier.label.trim()}</span>
                <strong>{tier.value.trim()}</strong>
              </span>
            ))}
            {href && actionLabel && <span className="pz-business-services__action">{actionLabel}<ArrowRight aria-hidden="true" size={16} /></span>}
          </div>
        )}
      </div>
    </>
  )

  return href
    ? <a className="pz-business-services__card" href={href}>{content}</a>
    : <article className="pz-business-services__card">{content}</article>
}

export function BusinessSiteServices({
  groups,
  title,
  eyebrow,
  intro,
  hideSingleGroupHeading = false,
  viewAll,
  appearance = {},
  sectionId,
  className,
}: BusinessSiteServicesProps) {
  const visibleGroups = (groups ?? [])
    .map((group) => ({
      ...group,
      services: (group.services ?? []).filter((service) => service?.title?.trim()),
    }))
    .filter((group) => group?.trade?.trim() && group.services.length > 0)
  if (visibleGroups.length === 0) return null

  const sectionTitle = title?.trim()
  const viewAllHref = safeHref(viewAll?.href)
  const hideGroupHeading = hideSingleGroupHeading && Boolean(sectionTitle) && visibleGroups.length === 1

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
        {sectionTitle && (
          <div className="pz-business-services__intro">
            {eyebrow?.trim() && <span className="pz-business-services__eyebrow">{eyebrow.trim()}</span>}
            <h2 className="pz-business-services__title">{sectionTitle}</h2>
            {intro?.trim() && <p>{intro.trim()}</p>}
          </div>
        )}
        {visibleGroups.map((group) => {
          const TradeHeading = sectionTitle ? 'h3' : 'h2'
          const count = typeof group.totalCount === 'number' && Number.isSafeInteger(group.totalCount) && group.totalCount >= group.services.length
            ? group.totalCount
            : group.services.length
          return (
            <div className="pz-business-services__group" key={group.id}>
              {!hideGroupHeading && (
                <div className="pz-business-services__group-head">
                  <TradeHeading>{group.trade.trim()}</TradeHeading>
                  <span>{count} {count === 1 ? 'service' : 'services'}</span>
                </div>
              )}
              <div className="pz-business-services__grid">
                {group.services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    headingLevel={sectionTitle && !hideGroupHeading ? 'h4' : 'h3'}
                  />
                ))}
              </div>
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
