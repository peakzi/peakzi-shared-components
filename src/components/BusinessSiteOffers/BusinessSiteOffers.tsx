import { useId } from 'react'
import { ArrowRight } from 'lucide-react'
import { safeHref } from '../../utils/safeHref'
import { offersStyle } from './helpers/appearance'
import type { BusinessSiteOffersProps } from './helpers/types'
import { Offer } from './offer/Offer'
import { BusinessSiteOffersCarousel } from './carousel/BusinessSiteOffersCarousel'

export function BusinessSiteOffers({
  items,
  layout = 'carousel',
  title = 'Offers & savings',
  eyebrow = 'Coupons & specials',
  description,
  viewAll,
  appearance = {},
  sectionId,
  className,
}: BusinessSiteOffersProps) {
  const headingId = `${useId()}-heading`
  const offers = items.filter((item) => item.title.trim())
  if (!offers.length) return null
  const href = viewAll?.label.trim() ? safeHref(viewAll.href) : null
  const newTab = viewAll?.newTab === true && !!href && /^https?:\/\//i.test(href)
  const resolvedLayout = appearance.density === 'compact' ? 'list' : layout === 'grid' ? 'grid' : 'carousel'

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={['pz-business-offers', className].filter(Boolean).join(' ')}
      data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'}
      data-layout={resolvedLayout}
      data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'}
      style={offersStyle(appearance)}
    >
      <div className="pz-business-offers__inner">
        <div className="pz-business-offers__header">
          <div>
            {eyebrow.trim() && <p className="pz-business-offers__eyebrow">{eyebrow}</p>}
            <h2 id={headingId}>{title.trim() || 'Offers & savings'}</h2>
            {description?.trim() && <p className="pz-business-offers__intro">{description}</p>}
          </div>
          {href && (
            <a className="pz-business-offers__view-all" href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}>
              {viewAll?.label}<ArrowRight size={18} aria-hidden="true" />
            </a>
          )}
        </div>
        {resolvedLayout !== 'carousel' ? (
          <ul className="pz-business-offers__list" role="list">
            {offers.map((item) => <li key={item.id}><Offer item={item} /></li>)}
          </ul>
        ) : (
          <BusinessSiteOffersCarousel count={offers.length} animate={appearance.motion === 'subtle'}>
            {offers.map((item) => <li key={item.id}><Offer item={item} /></li>)}
          </BusinessSiteOffersCarousel>
        )}
      </div>
    </section>
  )
}

BusinessSiteOffers.displayName = 'BusinessSiteOffers'
