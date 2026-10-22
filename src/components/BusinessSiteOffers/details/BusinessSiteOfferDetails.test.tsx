import { StrictMode } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BusinessSiteOffers } from '../BusinessSiteOffers'
import type { BusinessSiteOffer } from '../helpers/types'

const item: BusinessSiteOffer = {
  id: 'membership', title: 'Maintenance membership', badge: '$14.99', description: 'Join for $14.99/month.',
  features: ['Priority scheduling', 'Annual inspection', 'Two-year service guarantee'],
  terms: 'Included with membership. One offer per visit.', redemptionInstructions: 'Mention this offer when calling.',
  code: 'MEMBER', expiresOn: '2030-11-04', action: { label: 'Call to claim', href: 'tel:5125550188' },
}
const originalShow = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')

beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.setAttribute('open', '') } })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: function (this: HTMLDialogElement) { this.removeAttribute('open'); this.dispatchEvent(new Event('close')) } })
})
afterEach(() => {
  cleanup()
  document.body.style.overflow = ''
  if (originalShow) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShow)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})

const preview = <BusinessSiteOffers preview items={[item]} viewAll={{ label: 'View all offers', href: '/offers?domain=www.client.example' }} />

describe('homepage offer details', () => {
  it('keeps key copy, dates, codes and a real fallback link in server HTML, including full dialog content', () => {
    const html = renderToStaticMarkup(preview)
    expect(html).toContain('data-content="preview"')
    expect(html).toContain('href="/offers?domain=www.client.example" aria-haspopup="dialog"')
    const cardCopy = html.match(/class="pz-business-offers__content"[\s\S]*?<\/div>/)?.[0]
    expect(cardCopy).toContain('Included with membership. One offer per visit.')
    expect(cardCopy).toContain('Mention this offer when calling.')
    expect(cardCopy).toContain('<strong>MEMBER</strong>')
    expect(cardCopy).not.toContain('Priority scheduling')
    expect(html).toContain('<time dateTime="2030-11-04">Nov 4, 2030</time>')
    expect(html).toContain('Two-year service guarantee')
    expect(html).not.toContain('<dialog open')
  })

  it('opens full details without expanding the cards, then restores scroll and focus on close', () => {
    document.body.style.overflow = 'scroll'
    render(<StrictMode>{preview}</StrictMode>)
    const link = screen.getByRole('link', { name: 'View details: Maintenance membership' })
    fireEvent.click(link)
    const dialog = screen.getByRole('dialog', { name: 'Maintenance membership' })
    expect(dialog).toHaveAttribute('open')
    expect(within(dialog).getByText('Two-year service guarantee')).toBeVisible()
    expect(within(dialog).getByRole('link', { name: /Call to claim/ })).toHaveAttribute('href', 'tel:5125550188')
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close offer details' }))
    expect(dialog).not.toHaveAttribute('open')
    expect(document.body.style.overflow).toBe('scroll')
    expect(link).toHaveFocus()
  })

  it('supports Escape, backdrop dismissal and cleanup on unmount', () => {
    const view = render(preview)
    const link = screen.getByRole('link', { name: /View details/ })
    fireEvent.click(link)
    const dialog = screen.getByRole('dialog')
    fireEvent(dialog, new Event('cancel', { bubbles: true, cancelable: true }))
    expect(dialog).not.toHaveAttribute('open')
    expect(document.body.style.overflow).toBe('')
    fireEvent.click(link)
    fireEvent.click(dialog, { clientX: -10, clientY: -10 })
    expect(dialog).not.toHaveAttribute('open')
    fireEvent.click(link)
    view.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('preserves normal navigation for modified clicks and unsupported dialogs', () => {
    render(preview)
    const link = screen.getByRole('link', { name: /View details/ })
    fireEvent.click(link, { ctrlKey: true })
    expect(screen.queryByRole('dialog')).toBeNull()
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })
    link.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(document.body.style.overflow).toBe('')
  })

  it('shortens long descriptions, but does not add details links to short coupons', () => {
    const { container } = render(<BusinessSiteOffers preview items={[
      { id: 'short', title: 'Short offer', description: 'A simple discount.' },
      { id: 'long', title: 'Long offer', description: 'Detailed description with useful service information. '.repeat(10) },
    ]} viewAll={{ label: 'All offers', href: '/offers' }} />)
    expect(screen.queryByRole('link', { name: 'View details: Short offer' })).toBeNull()
    expect(screen.getByRole('link', { name: 'View details: Long offer' })).toBeInTheDocument()
    expect(container.querySelectorAll('.pz-business-offers__content')[1]?.textContent?.length).toBeLessThan(220)
  })

  it('keeps the full variant unchanged when previews are not enabled', () => {
    for (const props of [{ layout: 'grid' as const }, {}]) {
      const html = renderToStaticMarkup(<BusinessSiteOffers {...props} items={[item]} />)
      expect(html).toContain('data-content="full"')
      expect(html).toContain('Two-year service guarantee')
      expect(html).not.toContain('pz-business-offers__details-link')
      expect(html).not.toContain('<dialog')
    }
  })

  it.each([undefined, { label: 'All', href: 'javascript:alert(1)' }])('provides a native fallback without a safe directory link: %j', (viewAll) => {
    const html = renderToStaticMarkup(<BusinessSiteOffers preview layout="grid" items={[item]} {...(viewAll ? { viewAll } : {})} />)
    expect(html).toContain('data-content="preview"')
    expect(html).toContain('<summary')
    expect(html).not.toContain('javascript:')
    const disclosure = html.match(/<details[\s\S]*?<\/details>/)?.[0]
    expect(disclosure).toContain('Two-year service guarantee')
    expect(disclosure).toContain('Included with membership. One offer per visit.')
    expect(disclosure).toContain('dateTime="2030-11-04"')
    expect(disclosure).not.toContain('href="/offers"')
  })

  it('enhances the native summary into the same modal without expanding the coupon', () => {
    const { container } = render(<BusinessSiteOffers preview layout="grid" items={[item]} />)
    const summary = container.querySelector('summary')!
    fireEvent.click(summary)
    expect(container.querySelector('details')).not.toHaveAttribute('open')
    const dialog = screen.getByRole('dialog', { name: 'Maintenance membership' })
    expect(within(dialog).getByText('Two-year service guarantee')).toBeVisible()
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close offer details' }))
    expect(summary).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('leaves native disclosure clicks unhandled when modal dialogs are unsupported', () => {
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
    const { container } = render(<BusinessSiteOffers preview layout="grid" items={[item]} />)
    const summary = container.querySelector('summary')!
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })
    summary.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(container.querySelector('details')).toHaveAttribute('open')
  })
})
