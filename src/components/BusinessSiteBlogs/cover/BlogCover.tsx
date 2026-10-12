import { safeHref } from '../../../utils/safeHref'
import type { BusinessSiteBlog, BusinessSiteBlogImage } from '../helpers/types'

export function BlogCover({ item, fallbackImage }: { item: BusinessSiteBlog; fallbackImage?: BusinessSiteBlogImage | undefined }) {
  const cover = safeHref(item.coverImage?.src, true)
  const logo = safeHref(fallbackImage?.src, true)
  const src = cover ?? logo
  if (!src) return null

  return (
    <div className="pz-business-blogs__cover" data-image-kind={cover ? 'cover' : 'logo'}>
      <img
        src={src}
        alt={(cover ? item.coverImage?.alt : fallbackImage?.alt)?.trim() || item.title}
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
