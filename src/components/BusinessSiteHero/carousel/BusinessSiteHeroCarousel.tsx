'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { BusinessSiteHeroImage } from '../helpers/types'

export interface BusinessSiteHeroCarouselProps {
  images: readonly BusinessSiteHeroImage[]
  intervalMs: number
  showBlurredBackdrop?: boolean
}

export function BusinessSiteHeroCarousel({ images, intervalMs, showBlurredBackdrop = false }: BusinessSiteHeroCarouselProps) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (images.length < 2 || intervalMs === 0 || paused || reducedMotion) return
    const timer = window.setInterval(() => setActive((index) => (index + 1) % images.length), intervalMs)
    return () => window.clearInterval(timer)
  }, [images.length, intervalMs, paused, reducedMotion])

  const go = (direction: number) => setActive((index) => (index + direction + images.length) % images.length)

  return (
    <div
      className="pz-business-hero__carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Photos"
      aria-live="off"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1) }
        if (event.key === 'ArrowRight') { event.preventDefault(); go(1) }
      }}
    >
      {images.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
          className="pz-business-hero__slide"
          data-active={index === active}
          aria-hidden={index !== active}
        >
          <img
            className="pz-business-hero__image-foreground"
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : undefined}
          />
          {showBlurredBackdrop && (
            <img
              className="pz-business-hero__image-backdrop"
              src={image.src}
              alt=""
              aria-hidden="true"
              width={image.width}
              height={image.height}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          )}
        </div>
      ))}
      {images.length > 1 && (
        <div className="pz-business-hero__carousel-controls">
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)}>
            <ChevronLeft aria-hidden="true" size={20} />
          </button>
          <div className="pz-business-hero__carousel-dots">
            {images.map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                aria-label={`Photo ${index + 1} of ${images.length}`}
                aria-current={index === active ? 'true' : undefined}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
          <button type="button" aria-label="Next photo" onClick={() => go(1)}>
            <ChevronRight aria-hidden="true" size={20} />
          </button>
        </div>
      )}
    </div>
  )
}
