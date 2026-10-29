'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { safeHref } from '../../utils/safeHref'

export interface BusinessSitePhotoCarouselImage { src: string; alt: string; width?: number; height?: number }
export interface BusinessSitePhotoCarouselProps {
  images: readonly BusinessSitePhotoCarouselImage[]
  intervalMs?: number
  autoPlay?: boolean
  motion?: 'none' | 'subtle'
  label?: string
  className?: string
  imageClassName?: string
  backdropClassName?: string
  showBlurredBackdrop?: boolean
  as?: 'div' | 'figure'
  navigationLabel?: 'photo' | 'image'
}

/** Server-rendered photos with peeking cards, progress indicators and explicit playback. */
export function BusinessSitePhotoCarousel({ images, intervalMs = 5000, autoPlay = false, motion = 'subtle',
  label = 'Photos', className, imageClassName, backdropClassName, showBlurredBackdrop = false, as: Frame = 'div', navigationLabel = 'photo' }: BusinessSitePhotoCarouselProps) {
  const [failed, setFailed] = useState<readonly string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [pausedByUser, setPausedByUser] = useState<boolean | null>(null)
  const userPaused = pausedByUser ?? !autoPlay
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [explicitPlay, setExplicitPlay] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [looping, setLooping] = useState(false)
  const [snap, setSnap] = useState(false)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const seen = new Set<string>()
  const photos = images.flatMap(image => {
    const src = safeHref(image?.src, true)
    if (!src || !image.alt?.trim() || seen.has(src) || failed.includes(src)) return []
    seen.add(src)
    return [{ ...image, src }]
  })
  const count = photos.length
  const index = Math.max(0, photos.findIndex(image => image.src === selected))
  const first = photos[0]?.src
  const next = photos[index + 1]?.src
  const interval = Number.isFinite(intervalMs) && intervalMs > 0 ? Math.max(2000, intervalMs) : 0
  const playable = count > 1 && interval > 0 && motion === 'subtle' && !reducedMotion
  const running = playable && !userPaused && !hovered && (!focused || explicitPlay) && !hidden

  useEffect(() => {
    const media = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    const updateMotion = () => setReducedMotion(media?.matches ?? false)
    const updateVisibility = () => setHidden(document.visibilityState === 'hidden')
    updateMotion(); updateVisibility()
    media?.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => { media?.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility) }
  }, [])

  const settleLoop = () => {
    setSnap(true); setSelected(first ?? null); setLooping(false)
  }

  useEffect(() => {
    if (!looping) return
    // Also settle when motion preferences change or the browser skips transitionend.
    const timer = window.setTimeout(() => { setSnap(true); setSelected(first ?? null); setLooping(false) }, 650)
    return () => window.clearTimeout(timer)
  }, [looping, first])

  useEffect(() => {
    if (!snap) return
    const timer = window.setTimeout(() => setSnap(false), 32)
    return () => window.clearTimeout(timer)
  }, [snap])

  useEffect(() => {
    if (!running || looping || snap) return
    const timer = window.setTimeout(() => next ? setSelected(next) : setLooping(true), interval)
    return () => window.clearTimeout(timer)
  }, [running, looping, snap, interval, index, next])

  if (!count) return null
  const choose = (target: number) => { setLooping(false); setSelected(photos[Math.max(0, Math.min(count - 1, target))]!.src) }
  const renderPhotos = count > 1 && (autoPlay || !userPaused || looping) ? [...photos, { ...photos[0]!, clone: true }] : photos

  return <Frame className={['pz-photo-gallery', className].filter(Boolean).join(' ')} data-motion={motion}
    data-multiple={count > 1} data-running={running} data-snap={snap}
    onFocusCapture={() => { setFocused(true); setExplicitPlay(false) }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) { setFocused(false); setExplicitPlay(false) } }}
    onKeyDown={event => {
      if (event.altKey || event.ctrlKey || event.metaKey || count < 2) return
      const target = event.key === 'ArrowRight' ? index + 1 : event.key === 'ArrowLeft' ? index - 1
        : event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : null
      if (target !== null) { event.preventDefault(); choose(target) }
    }}>
    <div className="pz-photo-gallery__viewport" role={count > 1 ? 'region' : undefined}
      aria-roledescription={count > 1 ? 'carousel' : undefined} aria-label={count > 1 ? label : undefined}
      tabIndex={count > 1 ? 0 : undefined} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onTouchStart={event => { const start = event.touches.length === 1 ? event.touches[0] : undefined; touch.current = start ? { x: start.clientX, y: start.clientY } : null }}
      onTouchCancel={() => { touch.current = null }} onTouchEnd={event => {
        const start = touch.current; touch.current = null; const end = event.changedTouches[0]
        if (!start || !end) return
        const dx = end.clientX - start.x, dy = end.clientY - start.y
        if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy)) choose(index + (dx < 0 ? 1 : -1))
      }}>
      <div className="pz-photo-gallery__track" style={{ '--pz-photo-position': looping ? count : index } as CSSProperties}
        onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === 'transform' && looping) settleLoop() }}>
        {renderPhotos.map((image, position) => {
          const clone = 'clone' in image
          return <div key={`${clone ? 'clone:' : ''}${image.src}`} className="pz-photo-gallery__slide" data-active={!clone && position === index}
            data-clone={clone || undefined} aria-hidden={clone || position !== index}>
            <img className={['pz-photo-gallery__image', imageClassName].filter(Boolean).join(' ')} src={image.src} alt={clone ? '' : image.alt}
              width={image.width} height={image.height} loading={position === 0 ? 'eager' : 'lazy'}
              fetchPriority={position === 0 ? 'high' : undefined} draggable={false}
              onError={() => setFailed(previous => previous.includes(image.src) ? previous : [...previous, image.src])} />
            {showBlurredBackdrop && <img className={['pz-photo-gallery__backdrop', backdropClassName].filter(Boolean).join(' ')} src={image.src} alt="" aria-hidden="true" loading="lazy" />}
          </div>
        })}
      </div>
      {count > 1 && <div className="pz-photo-gallery__arrows">
        <button type="button" aria-label={`Previous ${navigationLabel}`} disabled={index === 0} onClick={() => choose(index - 1)}><ChevronLeft size={18} aria-hidden="true" /></button>
        <button type="button" aria-label={`Next ${navigationLabel}`} disabled={index === count - 1} onClick={() => choose(index + 1)}><ChevronRight size={18} aria-hidden="true" /></button>
      </div>}
    </div>
    {count > 1 && <div className="pz-photo-gallery__controls">
      <div className="pz-photo-gallery__pagination" role="group" aria-label="Choose a photo">
        {photos.map((image, position) => <button key={image.src} type="button" className="pz-photo-gallery__indicator"
          aria-label={`Photo ${position + 1} of ${count}`} aria-current={position === index ? 'true' : undefined}
          onClick={() => choose(position)}>
          <span className="pz-photo-gallery__dot" aria-hidden="true">
            {position === index && <span key={`${index}:${running}`} className="pz-photo-gallery__progress" style={{ animationDuration: `${interval}ms` }} />}
          </span>
        </button>)}
      </div>
      {playable && <button type="button" className="pz-photo-gallery__toggle" aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
        onClick={() => { setPausedByUser(!userPaused); setExplicitPlay(true) }}>
        {userPaused ? <Play size={18} fill="currentColor" aria-hidden="true" /> : <Pause size={18} fill="currentColor" aria-hidden="true" />}
      </button>}
      <span className="pz-photo-gallery__status" aria-live={running ? 'off' : 'polite'} aria-atomic="true">Image {index + 1} of {count}</span>
    </div>}
  </Frame>
}
