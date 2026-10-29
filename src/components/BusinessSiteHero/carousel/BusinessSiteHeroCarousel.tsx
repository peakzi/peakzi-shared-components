'use client'
import { BusinessSitePhotoCarousel } from '../../BusinessSitePhotoCarousel'
import type { BusinessSiteHeroImage } from '../helpers/types'

export interface BusinessSiteHeroCarouselProps {
  images: readonly BusinessSiteHeroImage[]
  intervalMs: number
  showBlurredBackdrop?: boolean
  motion?: 'none' | 'subtle'
}

export function BusinessSiteHeroCarousel({ images, intervalMs, showBlurredBackdrop = false, motion = 'subtle' }: BusinessSiteHeroCarouselProps) {
  return <BusinessSitePhotoCarousel images={images} intervalMs={intervalMs} autoPlay={intervalMs > 0}
    motion={motion} className={images.length > 1 ? 'pz-business-hero__carousel' : 'pz-business-hero__gallery'}
    imageClassName="pz-business-hero__image-foreground" backdropClassName="pz-business-hero__image-backdrop" showBlurredBackdrop={showBlurredBackdrop} />
}
