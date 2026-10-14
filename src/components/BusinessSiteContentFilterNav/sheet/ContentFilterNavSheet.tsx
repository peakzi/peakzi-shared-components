'use client'

import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useId, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import { safeHref } from '../../../utils/safeHref'
import type { BusinessSiteContentFilterNavTrade } from '../helpers/types'

interface ContentFilterNavSheetProps {
  trades: readonly BusinessSiteContentFilterNavTrade[]
  currentTradeKey: string
  activeService: string | null
  hrefFor: (trade: string, service?: string | null) => string
  dialogTitle: string
  className?: string
}

export function ContentFilterNavSheet({
  trades,
  currentTradeKey,
  activeService,
  hrefFor,
  dialogTitle,
  className,
}: ContentFilterNavSheetProps) {
  const titleId = `${useId()}-title`
  const dialogRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [previewTradeKey, setPreviewTradeKey] = useState(currentTradeKey)
  const [syncedTradeKey, setSyncedTradeKey] = useState(currentTradeKey)
  if (currentTradeKey !== syncedTradeKey) {
    setSyncedTradeKey(currentTradeKey)
    setPreviewTradeKey(currentTradeKey)
  }

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', handleKey)
    dialogRef.current?.focus()
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [open])

  const currentTrade = trades.find((trade) => trade.key === currentTradeKey) ?? trades[0]
  const previewTrade = trades.find((trade) => trade.key === previewTradeKey) ?? currentTrade
  if (!currentTrade || !previewTrade) return null

  const triggerLabel = activeService || currentTrade.services[0] || ''

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])',
    )
    if (!focusable?.length) return

    const first = focusable[0]!
    const last = focusable[focusable.length - 1]!
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const handleTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()

    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? trades.length - 1
        : event.key === 'ArrowRight'
          ? (index + 1) % trades.length
          : (index - 1 + trades.length) % trades.length
    const nextTrade = trades[nextIndex]
    if (!nextTrade) return

    setPreviewTradeKey(nextTrade.key)
    dialogRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus()
  }

  const rows = previewTrade.services.flatMap((service) => {
    const href = safeHref(hrefFor(previewTrade.key, service))
    if (!href) return []
    const on = previewTrade.key === currentTradeKey && service === activeService
    return [{ service, href, on }]
  })

  return (
    <div className={className}>
      <button
        type="button"
        className="pz-business-content-filter-nav__trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="pz-business-content-filter-nav__trigger-copy">
          <span className="pz-business-content-filter-nav__trigger-eyebrow">{currentTrade.label}</span>
          <span className="pz-business-content-filter-nav__trigger-value">{triggerLabel}</span>
        </span>
        <span className="pz-business-content-filter-nav__trigger-cta">Change</span>
      </button>

      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className="pz-business-content-filter-nav__backdrop"
        data-open={open || undefined}
        onClick={() => setOpen(false)}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-hidden={!open}
        data-open={open || undefined}
        className="pz-business-content-filter-nav__sheet"
        tabIndex={-1}
        onKeyDown={handleDialogKeyDown}
      >
        <div className="pz-business-content-filter-nav__sheet-handle" />
        <div className="pz-business-content-filter-nav__sheet-head">
          <h2 id={titleId} className="pz-business-content-filter-nav__sheet-title">{dialogTitle}</h2>
          <button
            type="button"
            className="pz-business-content-filter-nav__sheet-close"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div role="tablist" aria-label="Trade" className="pz-business-content-filter-nav__sheet-tabs">
          {trades.map((trade, index) => {
            const on = trade.key === previewTradeKey
            return (
              <button
                key={trade.key}
                type="button"
                role="tab"
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                className="pz-business-content-filter-nav__sheet-tab"
                data-active={on || undefined}
                onClick={() => setPreviewTradeKey(trade.key)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                {trade.label}
              </button>
            )
          })}
        </div>
        <ul className="pz-business-content-filter-nav__sheet-list" role="list">
          {rows.map(({ service, href, on }) => (
            <li key={service}>
              <a
                href={href}
                aria-current={on ? 'page' : undefined}
                className="pz-business-content-filter-nav__sheet-row"
                data-active={on || undefined}
                onClick={() => setOpen(false)}
              >
                <span>{service}</span>
                <Check aria-hidden="true" size={18} className="pz-business-content-filter-nav__sheet-row-mark" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

ContentFilterNavSheet.displayName = 'ContentFilterNavSheet'
