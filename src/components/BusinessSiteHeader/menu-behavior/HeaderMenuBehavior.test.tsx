import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HeaderMenuBehavior } from './HeaderMenuBehavior'

// Closing a menu is deferred a frame (see HeaderMenuBehavior.tsx) to avoid a
// real-Chrome crash, so tests that assert on the close must flush one first.
const flushRaf = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

function Example() {
  return <><header><HeaderMenuBehavior /><details open><summary>Menu</summary><button>Inside menu</button>
    <a href="/services" onClick={(event) => event.preventDefault()}>Services</a>
  </details></header><button>Outside menu</button></>
}

describe('HeaderMenuBehavior', () => {
  it('closes on an outside pointer press, but not an inside press', async () => {
    const { container } = render(<Example />)
    const menu = container.querySelector('details')!
    expect(fireEvent.pointerDown(screen.getByText('Inside menu'))).toBe(true)
    expect(menu.open).toBe(true)
    expect(fireEvent.pointerDown(screen.getByText('Outside menu'))).toBe(true)
    await flushRaf()
    expect(menu.open).toBe(false)
  })
  it('closes on Escape and restores the menu summary focus', async () => {
    const { container } = render(<Example />)
    screen.getByText('Inside menu').focus()
    fireEvent.keyDown(document, { key: 'Escape' })
    await flushRaf()
    expect(container.querySelector('details')!.open).toBe(false)
    expect(document.activeElement).toBe(screen.getByText('Menu'))
  })
  it('ignores other keys and does not steal outside focus', () => {
    const { container } = render(<Example />)
    screen.getByText('Outside menu').focus()
    fireEvent.keyDown(document, { key: 'Enter' })
    expect(container.querySelector('details')!.open).toBe(true)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.activeElement).toBe(screen.getByText('Outside menu'))
  })
  it('closes on a navigation click', async () => {
    const { container } = render(<Example />)
    fireEvent.click(screen.getByText('Services'))
    await flushRaf()
    expect(container.querySelector('details')!.open).toBe(false)
  })
  it('closes nested menus together', async () => {
    const { container } = render(<header><HeaderMenuBehavior /><details open><summary>Main</summary>
      <details open><summary>Services</summary><button>Nested</button></details>
    </details></header>)
    screen.getByText('Nested').focus()
    fireEvent.keyDown(document, { key: 'Escape' })
    await flushRaf()
    expect(Array.from(container.querySelectorAll('details')).every((menu) => !menu.open)).toBe(true)
    expect(document.activeElement).toBe(screen.getByText('Main'))
  })
  it('removes listeners on unmount and tolerates no parent header', () => {
    const remove = vi.spyOn(document, 'removeEventListener')
    const { unmount } = render(<Example />)
    unmount()
    expect(remove).toHaveBeenCalledWith('pointerdown', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('keydown', expect.any(Function))
    remove.mockRestore()
    expect(() => render(<HeaderMenuBehavior />)).not.toThrow()
  })
})

function MobileExample() {
  return <><header><HeaderMenuBehavior />
    <details className="pz-business-header__mobile-menu">
      <summary aria-label="Menu">Menu</summary>
      <div className="pz-business-header__mobile-backdrop" data-testid="backdrop" aria-hidden="true" />
      <a href="/services" onClick={(event) => event.preventDefault()}>Services</a>
      <a href="/book" onClick={(event) => event.preventDefault()}>Book online</a>
    </details>
  </header><main><button>Background control</button></main></>
}

describe('mobile menu overlay behavior', () => {
  const viewport = { matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }

  beforeEach(() => {
    viewport.matches = true
    viewport.addEventListener.mockClear()
    viewport.removeEventListener.mockClear()
    vi.stubGlobal('matchMedia', vi.fn(() => viewport))
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })
  afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals() })

  function openMenu(container: HTMLElement) {
    const menu = container.querySelector<HTMLDetailsElement>('.pz-business-header__mobile-menu')!
    menu.open = true
    fireEvent(menu, new Event('toggle'))
    return menu
  }

  it('locks only while the mobile menu is open and restores background scrolling on native close', () => {
    const { container } = render(<MobileExample />)
    expect(document.body.style.position).not.toBe('fixed')
    const menu = openMenu(container)
    expect(document.body.style.position).toBe('fixed')
    expect(container.querySelector('main')).toHaveAttribute('inert')
    expect(menu).toHaveAttribute('role', 'dialog')
    expect(menu.querySelector('summary')).toHaveAttribute('aria-label', 'Close menu')
    menu.open = false
    fireEvent(menu, new Event('toggle'))
    expect(document.body.style.position).not.toBe('fixed')
    expect(container.querySelector('main')).not.toHaveAttribute('inert')
    expect(menu).not.toHaveAttribute('aria-modal')
    expect(menu.querySelector('summary')).toHaveAttribute('aria-label', 'Menu')
  })

  it('cancels native backdrop pointer handling before closing and unlocking', async () => {
    const { container } = render(<MobileExample />)
    const menu = openMenu(container)
    screen.getByText('Services').focus()
    const pointer = new MouseEvent('pointerdown', { bubbles: true, cancelable: true })
    expect(fireEvent(screen.getByTestId('backdrop'), pointer)).toBe(false)
    expect(pointer.defaultPrevented).toBe(true)
    await flushRaf()
    expect(menu.open).toBe(false)
    expect(document.body.style.position).not.toBe('fixed')
    expect(document.activeElement).toBe(menu.querySelector('summary'))
  })

  it.each(['Escape', 'link'])('unlocks when closing with %s', async (method) => {
    const { container } = render(<MobileExample />)
    const menu = openMenu(container)
    screen.getByText('Services').focus()
    if (method === 'Escape') fireEvent.keyDown(document, { key: 'Escape' })
    else fireEvent.click(screen.getByText('Services'))
    await flushRaf()
    expect(menu.open).toBe(false)
    expect(document.body.style.position).not.toBe('fixed')
  })

  it('contains keyboard focus and prevents focus moving to the background', () => {
    const { container } = render(<MobileExample />)
    const menu = openMenu(container)
    const summary = menu.querySelector('summary')!
    const last = screen.getByText('Book online')
    for (const element of [summary, screen.getByText('Services'), last]) {
      const rectangle = new DOMRect()
      const rectangles = Object.assign([rectangle], { item: (index: number) => index === 0 ? rectangle : null })
      vi.spyOn(element, 'getClientRects').mockReturnValue(rectangles)
    }
    last.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(summary)
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(last)
    screen.getByText('Background control').focus()
    expect(document.activeElement).toBe(summary)
  })

  it('closes and releases scrolling when the viewport changes to desktop', async () => {
    const { container } = render(<MobileExample />)
    const menu = openMenu(container)
    viewport.matches = false
    const onChange = viewport.addEventListener.mock.calls[0]![1] as () => void
    onChange()
    await flushRaf()
    expect(menu.open).toBe(false)
    expect(document.body.style.position).not.toBe('fixed')
    menu.open = true
    fireEvent(menu, new Event('toggle'))
    expect(document.body.style.position).not.toBe('fixed')
  })

  it('releases styles, inert state and listeners if the header unmounts while open', () => {
    const { container, unmount } = render(<MobileExample />)
    openMenu(container)
    unmount()
    expect(document.body.style.position).not.toBe('fixed')
    expect(container.hasAttribute('inert')).toBe(false)
    expect(viewport.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
