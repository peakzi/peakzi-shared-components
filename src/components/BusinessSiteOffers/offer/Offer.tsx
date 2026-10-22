import { ArrowUpRight, Scissors } from 'lucide-react'
import { safeHref } from '../../../utils/safeHref'
import { offerExpiry } from '../helpers/expiry'
import type { BusinessSiteOffer } from '../helpers/types'
import { OfferCopy } from './OfferCopy'
import { offerPreview } from './offer-preview'
import { BusinessSiteOfferDetails } from '../details/BusinessSiteOfferDetails'

export function Offer({ item, preview = false, detailsHref }: { item: BusinessSiteOffer; preview?: boolean; detailsHref?: string | undefined }) {
  const expiry = offerExpiry(item.expiresOn)
  const href = item.action?.label.trim() ? safeHref(item.action.href) : null
  const newTab = item.action?.newTab === true && !!href && /^https?:\/\//i.test(href)
  const excerpt = offerPreview(item.description)
  const showDetails = preview && (excerpt.shortened || !!item.features?.some((feature) => feature.trim()))
  const expiryCopy = expiry && <p className="pz-business-offers__expiry">Expires <time dateTime={expiry.dateTime}>{expiry.label}</time></p>
  const action = href && <a className="pz-business-offers__action" data-action-id="offer" href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}>
    {item.action?.label}<ArrowUpRight size={16} aria-hidden="true" />
  </a>

  return (
    <article className="pz-business-offers__offer">
      <div className="pz-business-offers__content">
        {item.badge?.trim() && <span className="pz-business-offers__badge">{item.badge}</span>}
        <Scissors className="pz-business-offers__ticket-icon" size={18} aria-hidden="true" />
        <h3>{item.title}</h3>
        <OfferCopy item={item} description={preview ? excerpt.description : item.description} includeFeatures={!preview} />
        {!preview && expiryCopy}
      </div>
      {preview ? <div className="pz-business-offers__footer">
        {expiryCopy}
        <div className="pz-business-offers__footer-actions">
          {showDetails && <BusinessSiteOfferDetails title={item.title} href={detailsHref}>
            {item.badge?.trim() && <span className="pz-business-offers__badge">{item.badge}</span>}
            <OfferCopy item={item} />{expiryCopy}{action}
          </BusinessSiteOfferDetails>}
          {action}
        </div>
      </div> : action}
    </article>
  )
}
