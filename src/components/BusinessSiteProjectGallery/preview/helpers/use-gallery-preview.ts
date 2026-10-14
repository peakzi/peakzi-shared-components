import { useEffect, useRef, useState } from 'react'
import { safeHref } from '../../../../utils/safeHref'
import type { BusinessSiteProjectImage } from '../../helpers/types'

export function useGalleryPreview(items: readonly BusinessSiteProjectImage[]) {
  const marker = useRef<HTMLSpanElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const launcher = useRef<HTMLElement | null>(null)
  const [index, setIndex] = useState<number | null>(null)
  const open = index !== null

  useEffect(() => {
    const section = marker.current?.closest('.pz-business-gallery')
    if (!section) return
    const onClick = (event: Event) => {
      const click = event as MouseEvent
      if (click.defaultPrevented || click.button !== 0 || click.ctrlKey || click.metaKey || click.altKey || click.shiftKey
        || typeof HTMLDialogElement === 'undefined' || typeof HTMLDialogElement.prototype.showModal !== 'function'
        || !(click.target instanceof Element)) return
      const link = click.target.closest<HTMLAnchorElement>('a[data-gallery-preview]')
      if (!link || !section.contains(link)) return
      const selected = items.findIndex((item) => safeHref(item.href ?? item.src) === link.getAttribute('href'))
      if (selected < 0) return
      click.preventDefault()
      launcher.current = link
      setIndex(selected)
    }
    section.addEventListener('click', onClick)
    return () => section.removeEventListener('click', onClick)
  }, [items])

  useEffect(() => {
    const element = dialog.current
    if (!open || !element) return
    const previousOverflow = document.body.style.overflow
    const trigger = launcher.current
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      if (element.open) element.close()
      document.body.style.overflow = previousOverflow
      if (trigger?.isConnected) trigger.focus()
    }
  }, [open])

  const close = () => setIndex(null)
  const move = (direction: number) => setIndex((current) => current === null ? null : (current + direction + items.length) % items.length)
  return { marker, dialog, index, close, move }
}
