'use client'

import { useCallback, useEffect, useId, useRef, useState, type MouseEvent } from 'react'
import { X } from 'lucide-react'
import type { BusinessSiteReview } from '../helpers/types'
import { reviewPreview } from '../helpers/review-preview'
import { ReviewRating } from '../rating/ReviewRating'
import { ReviewAttribution } from '../review/ReviewAttribution'
import { HighlightedReviewText } from './HighlightedReviewText'

export interface BusinessSiteReviewDetailsProps {
  item: BusinessSiteReview
  featured?: boolean
}

/** Enhance the native fallback disclosure with a dialog, as offer details do. */
export function BusinessSiteReviewDetails({ item, featured = false }: BusinessSiteReviewDetailsProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLElement>(null)
  const restore = useRef<(() => void) | null>(null)
  const [contentReady, setContentReady] = useState(false)
  const headingId = `${useId()}-review-details`
  const preview = reviewPreview(item.text, featured)
  const phrases = item.highlightedPhrases ?? []
  const name = item.reviewerName?.trim()
  const title = name ? `Review by ${name}` : 'Customer review'

  const finish = useCallback(() => {
    const cleanup = restore.current
    restore.current = null
    cleanup?.()
  }, [])
  useEffect(() => {
    const element = dialog.current
    return () => {
      if (element?.open) element.close()
      finish()
    }
  }, [finish, item.id, item.text, featured])

  if (preview === undefined) return <blockquote><HighlightedReviewText text={item.text} highlightedPhrases={phrases} /></blockquote>

  const close = () => { dialog.current?.close(); finish() }
  const open = (event: MouseEvent<HTMLElement>) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey
      || typeof dialog.current?.showModal !== 'function') return
    if (dialog.current.open) { event.preventDefault(); return }
    setContentReady(true)
    dialog.current.showModal()
    event.preventDefault()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    restore.current = () => {
      document.body.style.overflow = previousOverflow
      if (trigger.current?.isConnected) trigger.current.focus()
    }
  }

  return <div className="pz-business-reviews__review-text">
    <span className="pz-business-reviews__preview"><HighlightedReviewText text={preview} highlightedPhrases={phrases} />…</span>
    <details className="pz-business-reviews__disclosure">
      <summary ref={(node) => { trigger.current = node }} className="pz-business-reviews__read-more"
        aria-haspopup="dialog" aria-label={name ? `Read full review by ${name}` : 'Read full review'} onClick={open}>Read full review</summary>
      <div className="pz-business-reviews__disclosure-body"><blockquote><HighlightedReviewText text={item.text} highlightedPhrases={phrases} /></blockquote></div>
    </details>
    <dialog ref={dialog} className="pz-business-reviews__details" aria-labelledby={headingId}
      onClose={finish} onCancel={(event) => { event.preventDefault(); close() }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const box = event.currentTarget.getBoundingClientRect()
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close()
      }}>
      <header className="pz-business-reviews__details-header">
        <h3 id={headingId}>{title}</h3>
        <button type="button" className="pz-business-reviews__details-close" onClick={close} aria-label="Close review details"><X size={20} aria-hidden="true" /></button>
      </header>
      <div className="pz-business-reviews__details-body">{contentReady && <figure className="pz-business-reviews__full-review">
        <ReviewRating value={item.rating} />
        <blockquote><HighlightedReviewText text={item.text} highlightedPhrases={phrases} /></blockquote>
        <ReviewAttribution item={item} />
      </figure>}</div>
    </dialog>
  </div>
}
