import { businessSiteIcon } from '../../../utils/businessSiteIcon'
import { safeHref } from '../../../utils/safeHref'
import type { BusinessSiteServiceItem } from '../helpers/types'

export function ServiceName({ service, headingLevel = 'span' }: {
  service: BusinessSiteServiceItem
  headingLevel?: 'h3' | 'h4' | 'span'
}) {
  const image = service.image
  const imageSrc = safeHref(image?.src, true)
  const hasImage = image && imageSrc && image.alt?.trim() && Number.isFinite(image.width) && image.width > 0
    && Number.isFinite(image.height) && image.height > 0
  const Heading = headingLevel
  return (
    <>
      {hasImage && <img className="pz-business-services__image" src={imageSrc} alt={image.alt.trim()} width={image.width} height={image.height} loading="lazy" />}
      {service.iconName && <span className="pz-business-services__item-icon" aria-hidden="true">{businessSiteIcon(service.iconName)}</span>}
      <div className="pz-business-services__card-copy">
        <Heading className="pz-business-services__card-title">{service.title.trim()}</Heading>
        {service.summary?.trim() && <span className="pz-business-services__summary">{service.summary.trim()}</span>}
      </div>
    </>
  )
}
