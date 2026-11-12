import { afterEach, describe, expect, it, vi } from 'vitest'
import { activateMobileMenu, mobileMenuFocusTargets, positionMobileMenu } from './mobile-menu-effects'

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); document.body.replaceChildren(); document.body.removeAttribute('style'); document.documentElement.removeAttribute('style') })

function example() {
  const wrapper = document.createElement('div')
  const header = document.createElement('header')
  const menu = document.createElement('details')
  menu.open = true
  menu.innerHTML = '<summary aria-label="Menu">Menu</summary><a href="/services">Services</a><details><summary>More</summary><a href="/hidden">Hidden link</a></details>'
  header.append(menu)
  const main = document.createElement('main')
  const footer = document.createElement('footer')
  footer.setAttribute('inert', 'existing')
  wrapper.append(header, main)
  document.body.append(wrapper, footer)
  return { header, menu, main, footer }
}

describe('mobile menu effects', () => {
  it('locks scrolling, compensates for the scrollbar, and restores exact styles and scroll position', () => {
    const { header, menu, main, footer } = example()
    vi.stubGlobal('scrollX', 12)
    vi.stubGlobal('scrollY', 180)
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(window.innerWidth - 15)
    document.documentElement.style.setProperty('overflow', 'auto', 'important')
    document.body.style.setProperty('padding-right', '7px')
    document.body.style.setProperty('position', 'relative')
    header.style.setProperty('--pz-business-header-menu-top', '99px')
    const restore = activateMobileMenu(header, menu)
    expect(document.body.style.position).toBe('fixed')
    expect(document.body.style.top).toBe('-180px')
    expect(document.body.style.left).toBe('-12px')
    expect(document.body.style.paddingRight).toBe('22px')
    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(main.hasAttribute('inert')).toBe(true)
    expect(menu.getAttribute('aria-modal')).toBe('true')
    expect(menu.querySelector('summary')!.getAttribute('aria-label')).toBe('Close menu')
    restore()
    expect(document.body.style.position).toBe('relative')
    expect(document.body.style.paddingRight).toBe('7px')
    expect(document.body.style.top).toBe('')
    expect(document.documentElement.style.overflow).toBe('auto')
    expect(document.documentElement.style.getPropertyPriority('overflow')).toBe('important')
    expect(header.style.getPropertyValue('--pz-business-header-menu-top')).toBe('99px')
    expect(main.hasAttribute('inert')).toBe(false)
    expect(footer.getAttribute('inert')).toBe('existing')
    expect(menu.hasAttribute('role')).toBe(false)
    expect(menu.querySelector('summary')!.getAttribute('aria-label')).toBe('Menu')
    expect(window.scrollTo).toHaveBeenCalledWith({ left: 12, top: 180, behavior: 'instant' })
  })


  it('keeps the header and close control pinned while locking a scrolled page, then restores its layout', () => {
    const { header, menu } = example()
    vi.stubGlobal('scrollY', 2400)
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const bounds = { top: 0, left: 0, bottom: 76, height: 76, width: 390 } as DOMRect
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(bounds)
    header.style.setProperty('position', 'sticky')
    header.style.setProperty('top', '6px', 'important')
    header.style.setProperty('width', '100%')
    const originalHeaderStyles = header.style.cssText
    const restore = activateMobileMenu(header, menu)
    const placeholder = header.previousElementSibling as HTMLElement
    expect(header.style.position).toBe('fixed')
    expect(header.style.top).toBe('0px')
    expect(header.style.width).toBe('390px')
    expect(header.style.getPropertyValue('--pz-business-header-menu-top')).toBe('76px')
    expect(placeholder.className).toBe('pz-business-header__placeholder')
    expect(placeholder.style.height).toBe('76px')
    expect(placeholder.getAttribute('aria-hidden')).toBe('true')
    expect(document.body.style.top).toBe('-2400px')
    restore()
    expect(header.style.cssText).toBe(originalHeaderStyles)
    expect(placeholder.isConnected).toBe(false)
    expect(document.querySelector('.pz-business-header__placeholder')).toBeNull()
    expect(window.scrollTo).toHaveBeenCalledWith({ left: window.scrollX, top: 2400, behavior: 'instant' })
  })

  it('updates the pinned header width on resize and stops using its placeholder after close', () => {
    const { header, menu } = example()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    let layoutWidth = 768
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return new DOMRect(this === header ? 0 : 12, 0, layoutWidth, 64)
    })
    const restore = activateMobileMenu(header, menu)
    layoutWidth = 320
    positionMobileMenu(header)
    expect(header.style.left).toBe('12px')
    expect(header.style.width).toBe('320px')
    expect(header.style.getPropertyValue('--pz-business-header-menu-top')).toBe('64px')
    restore()
    positionMobileMenu(header)
    expect(header.style.left).toBe('')
    expect(header.style.width).toBe('')
  })

  it('does not add scrollbar padding when none exists', () => {
    const { header, menu } = example()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(window.innerWidth)
    const restore = activateMobileMenu(header, menu)
    expect(document.body.style.paddingRight).toBe('')
    restore()
    expect(document.body.getAttribute('style')).toBe('')
  })

  it('positions the panel below the actual header, not a fixed assumed height', () => {
    const { header } = example()
    vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({ bottom: 76 } as DOMRect)
    positionMobileMenu(header)
    expect(header.style.getPropertyValue('--pz-business-header-menu-top')).toBe('76px')
  })

  it('excludes invisible controls and links in closed submenus from the focus loop', () => {
    const { menu } = example()
    const summary = menu.querySelector('summary')!
    const rectangle = new DOMRect()
    const rectangles = Object.assign([rectangle], { item: (index: number) => index === 0 ? rectangle : null })
    vi.spyOn(summary, 'getClientRects').mockReturnValue(rectangles)
    expect(mobileMenuFocusTargets(menu)).toEqual([summary])
  })
})
