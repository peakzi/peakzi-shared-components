import { ChevronRight } from 'lucide-react'
import { safeHref } from '../../../utils/safeHref'
import type { BusinessSiteServiceItem } from '../helpers/types'
import { ServiceName } from '../service-name/ServiceName'

export function ServiceGrid({ services, headingLevel }: {
  services: readonly BusinessSiteServiceItem[]
  headingLevel: 'h3' | 'h4'
}) {
  return (
    <ul className="pz-business-services__grid" role="list">
      {services.map((service) => {
        const href = safeHref(service.href)
        const content = <>
          <ServiceName service={service} headingLevel={headingLevel} />
          {href && <ChevronRight className="pz-business-services__arrow" size={18} aria-hidden="true" />}
        </>
        return (
          <li key={service.id}>
            {href
              ? <a className="pz-business-services__card" href={href}>{content}</a>
              : <article className="pz-business-services__card">{content}</article>}
          </li>
        )
      })}
    </ul>
  )
}
