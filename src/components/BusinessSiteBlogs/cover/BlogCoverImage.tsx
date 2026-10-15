'use client'

import { useState } from 'react'
import { safeHref } from '../../../utils/safeHref'
import type { BusinessSiteBlogImage } from '../helpers/types'

interface BlogCoverImageProps {
  cover?: BusinessSiteBlogImage | undefined
  fallbackImage?: BusinessSiteBlogImage | undefined
  title: string
}

/** Only load-error recovery needs hydration; the image and fixed frame are server-rendered. */
export function BlogCoverImage({ cover, fallbackImage, title }: BlogCoverImageProps) {
  const [failed, setFailed] = useState<readonly string[]>([])
  const coverSrc = safeHref(cover?.src, true)
  const logoSrc = safeHref(fallbackImage?.src, true)
  const candidates = [
    ...(coverSrc ? [{ src: coverSrc, alt: cover?.alt?.trim() || title, kind: 'cover' }] : []),
    ...(logoSrc ? [{ src: logoSrc, alt: fallbackImage?.alt?.trim() || title, kind: 'logo' }] : []),
  ]
  const image = candidates.find((candidate) => !failed.includes(candidate.src))
  return <div className="pz-business-blogs__cover" data-image-kind={image?.kind ?? 'placeholder'}>
    {image ? <img src={image.src} alt={image.alt} width={1600} height={800} loading="lazy" decoding="async"
      onError={() => setFailed((previous) => previous.includes(image.src) ? previous : [...previous, image.src])} /> :
      <span className="pz-business-blogs__image-placeholder" role="img" aria-label="No cover image available">Image unavailable</span>}
  </div>
}
