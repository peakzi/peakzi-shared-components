'use client'

import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { safeHref } from '../../../utils/safeHref'
import type { BusinessSiteProjectImage } from '../helpers/types'
import { useGalleryPreview } from './helpers/use-gallery-preview'

export function BusinessSiteProjectGalleryPreview({ items }: { items: readonly BusinessSiteProjectImage[] }) {
  const { marker, dialog, index, close, move } = useGalleryPreview(items)
  const touchStart = useRef<number | null>(null)
  const [failedSources, setFailedSources] = useState<ReadonlySet<string>>(new Set())
  const [loadedSources, setLoadedSources] = useState<ReadonlySet<string>>(new Set())
  const item = index === null ? undefined : items[index]
  const source = item ? safeHref(item.previewSrc, true) ?? safeHref(item.href ?? item.src) : null

  return <>
    <span ref={marker} hidden aria-hidden="true" />
    {item && source && <dialog ref={dialog} className="pz-business-gallery__preview" aria-label="Project photo preview"
      onCancel={(event) => { event.preventDefault(); close() }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          move(event.key === 'ArrowLeft' ? -1 : 1)
        }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const rect = event.currentTarget.getBoundingClientRect()
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close()
      }}>
      <div className="pz-business-gallery__preview-header">
        <p aria-live="polite">Photo {index! + 1} of {items.length} on this page</p>
        <button type="button" onClick={close} aria-label="Close photo preview"><X size={22} aria-hidden="true" /></button>
      </div>
      <div className="pz-business-gallery__preview-media"
        data-single={items.length === 1 ? '' : undefined}
        onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null }}
        onTouchEnd={(event) => {
          const end = event.changedTouches[0]?.clientX
          if (touchStart.current !== null && end !== undefined && Math.abs(end - touchStart.current) > 50) move(end < touchStart.current ? 1 : -1)
          touchStart.current = null
        }}>
        {items.length > 1 && <button type="button" onClick={() => move(-1)} aria-label="Previous project photo"><ArrowLeft size={22} aria-hidden="true" /></button>}
        {failedSources.has(source) ? <p role="status">This photo could not be loaded.</p>
          : <>
            {!loadedSources.has(source) && <span className="pz-business-gallery__preview-loading" role="status">Loading photo…</span>}
            <img key={source} src={source} alt={item.alt} decoding="async" width={item.width} height={item.height}
              onLoad={() => setLoadedSources((current) => new Set([...current, source]))}
              onError={() => setFailedSources((current) => new Set([...current, source]))} />
          </>}
        {items.length > 1 && <button type="button" onClick={() => move(1)} aria-label="Next project photo"><ArrowRight size={22} aria-hidden="true" /></button>}
      </div>
      <div className="pz-business-gallery__preview-caption">
        {item.caption && <p>{item.caption}</p>}
        {item.location && <p>{item.location}</p>}
        {!!item.tags?.length && <p>{item.tags.join(' · ')}</p>}
      </div>
    </dialog>}
  </>
}
