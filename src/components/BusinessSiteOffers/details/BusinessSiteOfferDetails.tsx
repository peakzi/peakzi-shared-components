'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { X } from 'lucide-react'
import { safeHref } from '../../../utils/safeHref'

/** Full copy is always server-rendered: in a dialog, or a native disclosure on the offers page. */
export function BusinessSiteOfferDetails({ title, href, children }: { title: string; href?: string | undefined; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLElement>(null)
  const [dialogContentReady, setDialogContentReady] = useState(false)
  const fallbackHref = safeHref(href)
  const restore = useRef<(() => void) | null>(null)
  const headingId = `${useId()}-offer-details`
  useEffect(() => () => { restore.current?.() }, [])

  const finish = () => { restore.current?.(); restore.current = null }
  const close = () => { dialog.current?.close(); finish() }
  const open = (event: MouseEvent<HTMLElement>) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey
      || typeof dialog.current?.showModal !== 'function') return
    if (dialog.current.open) { event.preventDefault(); return }
    setDialogContentReady(true)
    dialog.current.showModal()
    event.preventDefault()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    restore.current = () => {
      document.body.style.overflow = previousOverflow
      if (trigger.current?.isConnected) trigger.current.focus()
    }
  }

  return <>
    {fallbackHref
      ? <a ref={(node) => { trigger.current = node }} className="pz-business-offers__details-link" href={fallbackHref} aria-haspopup="dialog" onClick={open}>View details<span className="pz-business-offers__sr-only">: {title}</span></a>
      : <details className="pz-business-offers__disclosure">
        <summary ref={(node) => { trigger.current = node }} className="pz-business-offers__details-link" onClick={open}>View details<span className="pz-business-offers__sr-only">: {title}</span></summary>
        <div className="pz-business-offers__disclosure-body">{children}</div>
      </details>}
    <dialog ref={dialog} className="pz-business-offers__details" aria-labelledby={headingId}
      onClose={finish} onCancel={(event) => { event.preventDefault(); close() }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const box = event.currentTarget.getBoundingClientRect()
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close()
      }}>
      <header className="pz-business-offers__details-header">
        <h3 id={headingId}>{title}</h3>
        <button type="button" onClick={close} aria-label="Close offer details"><X size={20} aria-hidden="true" /></button>
      </header>
      <div className="pz-business-offers__details-body">{(fallbackHref || dialogContentReady) && children}</div>
    </dialog>
  </>
}
