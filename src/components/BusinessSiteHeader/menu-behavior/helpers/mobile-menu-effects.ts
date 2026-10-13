function preserveStyle(style: CSSStyleDeclaration, properties: readonly string[]) {
  const previous = properties.map((name) => [name, style.getPropertyValue(name), style.getPropertyPriority(name)] as const)
  return () => {
    for (const [name, value, priority] of previous) {
      if (value) style.setProperty(name, value, priority)
      else style.removeProperty(name)
    }
  }
}

export function positionMobileMenu(header: HTMLElement) {
  header.style.setProperty('--pz-business-header-menu-top', `${Math.max(0, header.getBoundingClientRect().bottom)}px`)
}

/** Keep the page stationary, including iOS, and restore the caller's styles on close. */
export function activateMobileMenu(header: HTMLElement, menu: HTMLDetailsElement) {
  const root = document.documentElement
  const body = document.body
  const { scrollX, scrollY } = window
  const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth)
  const paddingRight = Number.parseFloat(getComputedStyle(body).paddingRight) || 0
  const restoreRoot = preserveStyle(root.style, ['overflow'])
  const restoreBody = preserveStyle(body.style, ['position', 'top', 'left', 'right', 'overflow', 'padding-right'])
  const restoreHeader = preserveStyle(header.style, ['--pz-business-header-menu-top'])
  positionMobileMenu(header)
  root.style.setProperty('overflow', 'hidden')
  body.style.setProperty('position', 'fixed')
  body.style.setProperty('top', `${-scrollY}px`)
  body.style.setProperty('left', `${-scrollX}px`)
  body.style.setProperty('right', '0')
  body.style.setProperty('overflow', 'hidden')
  if (scrollbarWidth) body.style.setProperty('padding-right', `${paddingRight + scrollbarWidth}px`)

  // Mark siblings along the ancestor path inert without hiding server-rendered content.
  const background: Array<{ element: Element; inert: string | null }> = []
  let ancestor: Element = header
  while (ancestor.parentElement) {
    for (const sibling of ancestor.parentElement.children) {
      if (sibling === ancestor) continue
      background.push({ element: sibling, inert: sibling.getAttribute('inert') })
      sibling.setAttribute('inert', '')
    }
    ancestor = ancestor.parentElement
    if (ancestor === body) break
  }

  menu.setAttribute('role', 'dialog')
  menu.setAttribute('aria-modal', 'true')
  menu.setAttribute('aria-label', 'Site menu')
  const summary = menu.querySelector(':scope > summary')
  summary?.setAttribute('aria-label', 'Close menu')

  return () => {
    restoreRoot()
    restoreBody()
    restoreHeader()
    for (const { element, inert } of background) {
      if (inert === null) element.removeAttribute('inert')
      else element.setAttribute('inert', inert)
    }
    menu.removeAttribute('role')
    menu.removeAttribute('aria-modal')
    menu.removeAttribute('aria-label')
    summary?.setAttribute('aria-label', 'Menu')
    window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' })
  }
}

export function mobileMenuFocusTargets(menu: HTMLDetailsElement) {
  return Array.from(menu.querySelectorAll<HTMLElement>('summary, a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
    .filter((element) => element.getClientRects().length > 0)
}
