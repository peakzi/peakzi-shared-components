'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { carouselPages, nearestPage } from './helpers/carousel-pages'

interface BusinessSiteCardCarouselProps {
  children: ReactNode
  count: number
  animate: boolean
  classPrefix: string
  labels: { carousel: string; cards: string; previous: string; next: string }
}

export function BusinessSiteCardCarousel({ children, count, animate, classPrefix, labels }: BusinessSiteCardCarouselProps) {
  const trackId = useId() + '-cards'
  const trackRef = useRef<HTMLUListElement>(null)
  const [navigation, setNavigation] = useState({ previous: false, next: false, active: 0, pages: [0] })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const update = () => {
      const starts = Array.from(track.children, (card) => card.getBoundingClientRect().left)
      const origin = starts[0] ?? 0
      const pages = carouselPages(starts.map((left) => left - origin), track.clientWidth, track.scrollWidth - track.clientWidth)
      const active = nearestPage(pages, track.scrollLeft)
      const previous = track.scrollLeft > 1
      const next = track.scrollLeft + track.clientWidth < track.scrollWidth - 1
      setNavigation((current) => current.previous === previous && current.next === next && current.active === active
        && current.pages.length === pages.length && current.pages.every((page, index) => Math.abs(page - pages[index]!) < 1)
        ? current : { previous, next, active, pages })
    }
    update()
    track.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(update) : null
    observer?.observe(track)
    return () => {
      track.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      observer?.disconnect()
    }
  }, [count])

  const canScroll = count > 1 && navigation.pages.length > 1

  const goTo = (page: number) => {
    const track = trackRef.current
    if (!track) return
    const index = Math.max(0, Math.min(navigation.pages.length - 1, page))
    const behavior: ScrollBehavior = animate && typeof window.matchMedia === 'function'
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto'
    track.scrollTo({ left: navigation.pages[index] ?? 0, behavior })
  }

  return (
    <div className={'pz-business-card-carousel ' + classPrefix + '__carousel'} data-single={count === 1 ? 'true' : 'false'} role="region" aria-roledescription="carousel" aria-label={labels.carousel}>
      <ul
        ref={trackRef}
        id={trackId}
        className={'pz-business-card-carousel__list ' + classPrefix + '__list'}
        role="list"
        data-single={count === 1 ? 'true' : 'false'}
        tabIndex={canScroll ? 0 : undefined}
        aria-label={labels.cards}
        onKeyDown={(event) => {
          if (!canScroll || event.target !== event.currentTarget) return
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            goTo(navigation.active + (event.key === 'ArrowLeft' ? -1 : 1))
          } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault()
            goTo(event.key === 'Home' ? 0 : navigation.pages.length - 1)
          }
        }}
      >
        {children}
      </ul>
      {canScroll && (
        <div className={'pz-business-card-carousel__controls ' + classPrefix + '__controls'}>
          <button type="button" aria-label={labels.previous} aria-controls={trackId} disabled={!navigation.previous} onClick={() => goTo(navigation.active - 1)}>
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" aria-label={labels.next} aria-controls={trackId} disabled={!navigation.next} onClick={() => goTo(navigation.active + 1)}>
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
