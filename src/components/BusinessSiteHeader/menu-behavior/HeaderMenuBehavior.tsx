'use client'

import { useEffect, useRef } from 'react'
import { activateMobileMenu, mobileMenuFocusTargets, positionMobileMenu } from './helpers/mobile-menu-effects'

/** Enhances native details menus without moving navigation out of server HTML. */
export function HeaderMenuBehavior() {
  const marker = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const header = marker.current?.closest('header')
    if (!header) return
    const mobileMenu = header.querySelector<HTMLDetailsElement>('.pz-business-header__mobile-menu')
    const mobileViewport = window.matchMedia?.('(max-width: 1280px)')
    let restoreMobileMenu: (() => void) | undefined
    const openMenus = () => Array.from(header.querySelectorAll<HTMLDetailsElement>('details[open]'))
    const syncMobileMenu = () => {
      if (mobileMenu?.open && mobileViewport?.matches) {
        restoreMobileMenu ??= activateMobileMenu(header, mobileMenu)
      } else if (restoreMobileMenu) {
        restoreMobileMenu()
        restoreMobileMenu = undefined
        if (mobileMenu?.contains(document.activeElement)) mobileMenu.querySelector<HTMLElement>(':scope > summary')?.focus()
      }
    }
    // Deferred a frame: closing a native <details> in the same synchronous tick
    // as the inert/style/scroll/focus cleanup it triggers (via syncMobileMenu)
    // has crashed real Chrome (STATUS_BREAKPOINT) during the browser's own
    // post-event frame commit. One frame of delay is imperceptible, and the
    // callback re-runs syncMobileMenu itself rather than relying on the
    // native 'toggle' event, which some environments don't fire on a
    // script-set `open`.
    const closeMenu = (menu: HTMLDetailsElement) => {
      requestAnimationFrame(() => {
        menu.open = false
        syncMobileMenu()
      })
    }
    const closeMenus = () => {
      for (const menu of openMenus()) closeMenu(menu)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return
      if (event.target instanceof Element && event.target.closest('.pz-business-header__mobile-backdrop')) {
        // Cancel native pointer focus handling before closing details hides its
        // pressed backdrop; otherwise Chromium can crash while processing it.
        event.preventDefault()
        closeMenus()
        return
      }
      for (const menu of openMenus()) {
        if (!menu.contains(event.target)) closeMenu(menu)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && restoreMobileMenu && mobileMenu) {
        const targets = mobileMenuFocusTargets(mobileMenu)
        const first = targets[0]
        const last = targets[targets.length - 1]
        const active = document.activeElement
        if (first && last && (!mobileMenu.contains(active) || (event.shiftKey ? active === first : active === last))) {
          event.preventDefault()
          const target = event.shiftKey ? last : first
          target.focus()
        }
        return
      }
      if (event.key !== 'Escape') return
      const menus = openMenus()
      if (!menus.length) return
      // The outermost trigger remains visible after nested menus close.
      const focused = menus.find((menu) => menu.contains(document.activeElement))
      closeMenus()
      focused?.querySelector<HTMLElement>(':scope > summary')?.focus()
    }
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('a[href]')) return
      closeMenus()
    }
    const onFocusIn = (event: FocusEvent) => {
      if (restoreMobileMenu && mobileMenu && event.target instanceof Node && !mobileMenu.contains(event.target)) {
        mobileMenu.querySelector<HTMLElement>(':scope > summary')?.focus()
      }
    }
    const onResize = () => {
      if (!mobileViewport?.matches) closeMenus()
      else if (restoreMobileMenu) positionMobileMenu(header)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)
    header.addEventListener('click', onClick)
    header.addEventListener('toggle', syncMobileMenu, true)
    window.addEventListener('resize', onResize)
    mobileViewport?.addEventListener('change', onResize)
    syncMobileMenu()
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
      header.removeEventListener('click', onClick)
      header.removeEventListener('toggle', syncMobileMenu, true)
      window.removeEventListener('resize', onResize)
      mobileViewport?.removeEventListener('change', onResize)
      restoreMobileMenu?.()
    }
  }, [])

  return <span ref={marker} hidden aria-hidden="true" />
}
