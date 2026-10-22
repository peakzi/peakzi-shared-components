import { Phone } from 'lucide-react'
import { safeHref } from '../../../utils/safeHref'

interface PricingFooterProps {
  businessName: string
  hasPrices: boolean
  phoneHref: string | undefined
}

export function PricingFooter({ businessName, hasPrices, phoneHref }: PricingFooterProps) {
  const href = safeHref(phoneHref) ?? '#'
  const opensNewTab = /^https?:\/\//i.test(href)

  return (
    <div className="pz-service-pricing__footer">
      <p className="pz-service-pricing__source">
        {hasPrices
          ? `Ranges from ${businessName} job history. The final price is confirmed before work starts.`
          : 'No published prices yet. Every job gets a written quote first.'}
      </p>
      <a
        className="pz-service-pricing__cta"
        href={href}
        target={opensNewTab ? '_blank' : undefined}
        rel={opensNewTab ? 'noopener noreferrer' : undefined}
      >
        <Phone aria-hidden="true" size={16} />
        {hasPrices ? 'Call for an exact quote' : 'Call for a free quote'}
      </a>
    </div>
  )
}
