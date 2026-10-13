import { ArrowUpRight, Scissors } from 'lucide-react'
import { safeHref } from '../../../utils/safeHref'
import { offerExpiry } from '../helpers/expiry'
import type { BusinessSiteOffer } from '../helpers/types'

export function Offer({ item }: { item: BusinessSiteOffer }) {
  const expiry = offerExpiry(item.expiresOn)
  const href = item.action?.label.trim() ? safeHref(item.action.href) : null
  const newTab = item.action?.newTab === true && !!href && /^https?:\/\//i.test(href)

  return (
    <article className="pz-business-offers__offer">
      <div className="pz-business-offers__content">
        {item.badge?.trim() && <span className="pz-business-offers__badge">{item.badge}</span>}
        <Scissors className="pz-business-offers__ticket-icon" size={18} aria-hidden="true" />
        <h3>{item.title}</h3>
        {item.description?.trim() && <p>{item.description}</p>}
        {!!item.features?.length && (
          <ul className="pz-business-offers__features">
            {item.features.filter((feature) => feature.trim()).map((feature, index) => <li key={index}>{feature}</li>)}
          </ul>
        )}
        {item.terms?.trim() && <p className="pz-business-offers__terms">{item.terms}</p>}
        {item.redemptionInstructions?.trim() && <p>{item.redemptionInstructions}</p>}
        {item.code?.trim() && <p className="pz-business-offers__code">Code: <strong>{item.code}</strong></p>}
        {expiry && <p className="pz-business-offers__expiry">Expires <time dateTime={expiry.dateTime}>{expiry.label}</time></p>}
      </div>
      {href && (
        <a className="pz-business-offers__action" href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}>
          {item.action?.label}<ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
    </article>
  )
}
