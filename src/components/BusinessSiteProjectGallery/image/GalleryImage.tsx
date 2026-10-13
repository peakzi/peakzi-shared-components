import { Expand, MapPin } from 'lucide-react'
import { safeHref } from '../../../utils/safeHref'
import type { BusinessSiteProjectImage } from '../helpers/types'

export function GalleryImage({ item }: { item: BusinessSiteProjectImage }) {
  const href = safeHref(item.href)
  const newTab = item.newTab === true && !!href && /^https?:\/\//i.test(href)
  const photo = <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />

  return (
    <figure className="pz-business-gallery__item">
      {href ? (
        <a className="pz-business-gallery__photo" href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}>
          {photo}
          <span className="pz-business-gallery__expand" aria-hidden="true"><Expand size={18} /></span>
          {newTab && <span className="pz-business-gallery__sr-only"> (opens in a new tab)</span>}
        </a>
      ) : <div className="pz-business-gallery__photo">{photo}</div>}
      {(item.caption?.trim() || item.location?.trim()) && (
        <figcaption>
          {item.caption?.trim() && <p className="pz-business-gallery__caption">{item.caption}</p>}
          {item.location?.trim() && <p className="pz-business-gallery__location"><MapPin size={14} aria-hidden="true" />{item.location}</p>}
        </figcaption>
      )}
    </figure>
  )
}
