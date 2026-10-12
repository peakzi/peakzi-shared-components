import { useId } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { safeHref } from '../../utils/safeHref'
import { galleryStyle } from './helpers/appearance'
import { uniqueGalleryImages } from './helpers/images'
import type { BusinessSiteProjectGalleryProps } from './helpers/types'
import { GalleryImage } from './image/GalleryImage'

export function BusinessSiteProjectGallery({
  items,
  title = 'Recent work',
  eyebrow = 'Project gallery',
  viewAll,
  appearance = {},
  sectionId,
  className,
}: BusinessSiteProjectGalleryProps) {
  const headingId = `${useId()}-heading`
  const images = uniqueGalleryImages(items)
  if (images.length === 0) return null
  const href = viewAll?.label.trim() ? safeHref(viewAll.href) : null
  const newTab = viewAll?.newTab === true && !!href && /^https?:\/\//i.test(href)

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={['pz-business-gallery', className].filter(Boolean).join(' ')}
      data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'}
      data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'}
      style={galleryStyle(appearance)}
    >
      <div className="pz-business-gallery__inner">
        <div className="pz-business-gallery__header">
          <div>
            {eyebrow.trim() && <p className="pz-business-gallery__eyebrow">{eyebrow}</p>}
            <h2 id={headingId}>{title.trim() || 'Recent work'}</h2>
          </div>
          {href && (
            <a className="pz-business-gallery__view-all" href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}>
              {viewAll?.label}<ArrowUpRight size={18} aria-hidden="true" />
            </a>
          )}
        </div>
        <ul className="pz-business-gallery__grid" role="list">
          {images.map((item) => <li key={item.src}><GalleryImage item={item} /></li>)}
        </ul>
      </div>
    </section>
  )
}

BusinessSiteProjectGallery.displayName = 'BusinessSiteProjectGallery'
