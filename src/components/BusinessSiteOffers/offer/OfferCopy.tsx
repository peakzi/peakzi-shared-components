import type { BusinessSiteOffer } from '../helpers/types'

export function OfferCopy({ item, description = item.description, includeFeatures = true }: {
  item: BusinessSiteOffer; description?: string | undefined; includeFeatures?: boolean
}) {
  return <>
    {description?.trim() && <p>{description}</p>}
    {includeFeatures && !!item.features?.length && <ul className="pz-business-offers__features">
      {item.features.filter((feature) => feature.trim()).map((feature, index) => <li key={index}>{feature}</li>)}
    </ul>}
    {item.terms?.trim() && <p className="pz-business-offers__terms">{item.terms}</p>}
    {item.redemptionInstructions?.trim() && <p>{item.redemptionInstructions}</p>}
    {item.code?.trim() && <p className="pz-business-offers__code">Code: <strong>{item.code}</strong></p>}
  </>
}
