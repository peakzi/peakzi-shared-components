import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/** Enhance the server-rendered links in this section only; never intercept navigation. */
export function useAreaSelection(ref: RefObject<HTMLDivElement | null>, enabled: boolean) {
  const [selected, select] = useState<string | null>(null)

  useEffect(() => {
    const section = ref.current?.closest('.pz-business-areas')
    if (!section) return
    const areaId = (target: EventTarget | null) => target instanceof Element
      ? target.closest<HTMLElement>('[data-area-id]')?.dataset.areaId ?? null : null
    const enter = (event: Event) => {
      const id = areaId(event.target)
      if (id) select(id)
    }
    const leave = (event: Event) => {
      if (!areaId(event.target)) return
      const nextTarget = (event as FocusEvent | PointerEvent).relatedTarget
      if (areaId(nextTarget) === areaId(event.target)) return
      select(areaId(nextTarget) ?? areaId(document.activeElement))
    }
    const escape = (event: Event) => {
      if ((event as KeyboardEvent).key === 'Escape') select(null)
    }
    section.addEventListener('pointerover', enter)
    section.addEventListener('pointerout', leave)
    section.addEventListener('focusin', enter)
    section.addEventListener('focusout', leave)
    section.addEventListener('keydown', escape)
    return () => {
      section.removeEventListener('pointerover', enter)
      section.removeEventListener('pointerout', leave)
      section.removeEventListener('focusin', enter)
      section.removeEventListener('focusout', leave)
      section.removeEventListener('keydown', escape)
    }
  }, [ref, enabled])

  useEffect(() => {
    const links = ref.current?.closest('.pz-business-areas')?.querySelectorAll<HTMLElement>('[data-area-id]')
    links?.forEach((link) => {
      if (link.dataset.areaId === selected) link.dataset.mapActive = 'true'
      else delete link.dataset.mapActive
    })
    return () => links?.forEach((link) => { delete link.dataset.mapActive })
  }, [ref, selected, enabled])

  return { selected, select }
}
