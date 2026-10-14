import { Expand, MapPin } from 'lucide-react'
import { safeHref } from '../../../utils/safeHref'
import type { BusinessSiteProjectImage } from '../helpers/types'

export function GalleryImage({ item, enablePreview = false }: { item: BusinessSiteProjectImage; enablePreview?: boolean }) {
  const href = safeHref(item.href ?? (enablePreview ? item.src : undefined))
  const newTab = item.newTab === true && !!href && /^https?:\/\//i.test(href)
  const photo = <img src={item.src} alt={item.alt} width={item.width} height={item.height}
    style={item.width && item.height ? { aspectRatio: `${item.width} / ${item.height}` } : undefined}
    srcSet={item.srcSet} sizes={item.srcSet ? '(max-width: 380px) 100vw, (max-width: 900px) 50vw, 33vw' : undefined}
    loading="lazy" decoding="async" />

  return (
    <figure className="pz-business-gallery__item">
      {href ? (
        <a className="pz-business-gallery__photo" href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}
          data-gallery-preview={enablePreview ? '' : undefined} data-action-id="gallery-image"
          aria-haspopup={enablePreview ? 'dialog' : undefined}>
          {photo}
          <span className="pz-business-gallery__expand" aria-hidden="true"><Expand size={18} /></span>
          {enablePreview ? <span className="pz-business-gallery__sr-only"> (view full-size photo)</span>
            : newTab && <span className="pz-business-gallery__sr-only"> (opens in a new tab)</span>}
        </a>
      ) : <div className="pz-business-gallery__photo">{photo}</div>}
      {(item.caption?.trim() || item.location?.trim() || item.tags?.length) && (
        <figcaption>
          {item.caption?.trim() && <p className="pz-business-gallery__caption">{item.caption}</p>}
          {item.location?.trim() && <p className="pz-business-gallery__location"><MapPin size={14} aria-hidden="true" />{item.location}</p>}
          {!!item.tags?.length && <ul className="pz-business-gallery__tags" aria-label="Project services">
            {[...new Set(item.tags.filter((tag) => tag.trim()))].map((tag) => <li key={tag}>{tag}</li>)}
          </ul>}
        </figcaption>
      )}
    </figure>
  )
}
