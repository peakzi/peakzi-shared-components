'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/** Only user-initiated opening moves focus; initial server-rendered answers never scroll the page. */
export function FaqAccordion({ children, animate }: { children: ReactNode; animate: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = ref.current
    const view = list?.ownerDocument.defaultView
    if (!list || !view) return
    let pending: number | null = null
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || !(event.target instanceof Element)) return
      const summary = event.target.closest('summary')
      const details = summary?.parentElement
      if (!summary || !(details instanceof HTMLDetailsElement) || details.parentElement !== list) return
      if (pending !== null) view.cancelAnimationFrame(pending)
      pending = null
      if (details.open) return
      pending = view.requestAnimationFrame(() => {
        pending = null
        if (!details.open || !list.contains(details)) return
        list.querySelectorAll<HTMLDetailsElement>(':scope > details[open]').forEach((other) => {
          if (other !== details) other.open = false
        })
        summary.focus({ preventScroll: true })
        const header = list.ownerDocument.querySelector<HTMLElement>('.pz-business-header')
        const pinned = header && ['sticky', 'fixed'].includes(view.getComputedStyle(header).position)
        const offset = pinned ? Math.max(0, header.getBoundingClientRect().bottom) : 0
        const reducedMotion = view.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        view.scrollTo({
          top: Math.max(0, view.scrollY + summary.getBoundingClientRect().top - offset - 16),
          behavior: animate && !reducedMotion ? 'smooth' : 'instant',
        })
      })
    }
    list.addEventListener('click', onClick)
    return () => {
      list.removeEventListener('click', onClick)
      if (pending !== null) view.cancelAnimationFrame(pending)
    }
  }, [animate])

  return <div ref={ref} className="pz-business-faq__list" data-reveal-on-open="true">{children}</div>
}
