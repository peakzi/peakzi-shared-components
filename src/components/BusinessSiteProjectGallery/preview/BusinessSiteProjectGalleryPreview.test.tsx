import { StrictMode } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { BusinessSiteProjectGallery } from '../BusinessSiteProjectGallery'
import type { BusinessSiteProjectImage } from '../helpers/types'

const items: BusinessSiteProjectImage[] = [
  { src: '/small-a.jpg', href: '/original-a.jpg', alt: 'First project', caption: 'First caption', tags: ['Plumbing'] },
  { src: '/small-b.jpg', href: '/original-b.jpg', alt: 'Second project', caption: 'Second caption' },
]
const originalShow = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')

beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.setAttribute('open', '') } })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: function (this: HTMLDialogElement) { this.removeAttribute('open') } })
})
afterEach(() => {
  cleanup()
  document.body.style.overflow = ''
  if (originalShow) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShow)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})

function openFirst() {
  const link = screen.getByRole('link', { name: /First project/ })
  fireEvent.click(link)
  return { link, dialog: screen.getByRole('dialog', { name: 'Project photo preview' }) }
}

describe('project gallery preview', () => {
  it('opens the original image, keeps full captions, locks scrolling, closes and restores focus/overflow', () => {
    document.body.style.overflow = 'scroll'
    render(<BusinessSiteProjectGallery items={items} enablePreview />)
    const { link, dialog } = openFirst()
    expect(dialog).toHaveAttribute('open')
    expect(within(dialog).getByRole('img', { name: 'First project' })).toHaveAttribute('src', '/original-a.jpg')
    expect(within(dialog).getByText('First caption')).toBeInTheDocument()
    expect(within(dialog).queryByRole('link')).toBeNull()
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close photo preview' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.body.style.overflow).toBe('scroll')
    expect(link).toHaveFocus()
  })

  it('moves between photos using buttons and arrow keys, wrapping at both ends', () => {
    render(<BusinessSiteProjectGallery items={items} enablePreview />)
    const { dialog } = openFirst()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Next project photo' }))
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', '/original-b.jpg')
    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', '/original-a.jpg')
    fireEvent.keyDown(dialog, { key: 'ArrowLeft' })
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', '/original-b.jpg')
    fireEvent(dialog, new Event('cancel', { bubbles: true, cancelable: true }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('handles swipe navigation but ignores short gestures', () => {
    render(<BusinessSiteProjectGallery items={items} enablePreview />)
    const { dialog } = openFirst()
    const media = dialog.querySelector('.pz-business-gallery__preview-media')!
    fireEvent.touchStart(media, { touches: [{ clientX: 200 }] })
    fireEvent.touchEnd(media, { changedTouches: [{ clientX: 180 }] })
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', '/original-a.jpg')
    fireEvent.touchStart(media, { touches: [{ clientX: 200 }] })
    fireEvent.touchEnd(media, { changedTouches: [{ clientX: 60 }] })
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', '/original-b.jpg')
  })

  it('does not hijack modified clicks, missing links or unsupported native dialogs', () => {
    render(<BusinessSiteProjectGallery items={items} enablePreview />)
    fireEvent.click(screen.getByRole('link', { name: /First project/ }), { ctrlKey: true })
    expect(screen.queryByRole('dialog')).toBeNull()
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })
    screen.getByRole('link', { name: /First project/ }).dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('supports a single photo without redundant previous/next controls', () => {
    render(<BusinessSiteProjectGallery items={[items[0]!]} enablePreview />)
    const { dialog } = openFirst()
    expect(within(dialog).queryByRole('button', { name: 'Next project photo' })).toBeNull()
    expect(within(dialog).getByText('Photo 1 of 1 on this page')).toBeInTheDocument()
  })

  it('reports failed images without an original-photo link and still allows navigation', () => {
    render(<BusinessSiteProjectGallery items={items} enablePreview />)
    const { dialog } = openFirst()
    fireEvent.error(within(dialog).getByRole('img'))
    expect(within(dialog).getByRole('status')).toHaveTextContent('This photo could not be loaded.')
    expect(within(dialog).queryByRole('link')).toBeNull()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Next project photo' }))
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', '/original-b.jpg')
  })

  it('restores scrolling when removed or when a new filtered photo set arrives', () => {
    const view = render(<BusinessSiteProjectGallery items={items} enablePreview />)
    openFirst()
    view.rerender(<BusinessSiteProjectGallery items={[items[1]!]} enablePreview />)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.body.style.overflow).toBe('')
    fireEvent.click(screen.getByRole('link', { name: /Second project/ }))
    expect(document.body.style.overflow).toBe('hidden')
    view.unmount()
    expect(document.body.style.overflow).toBe('')
  })
  it('uses an optimized preview with loading feedback and no original-photo link', () => {
    render(<BusinessSiteProjectGallery items={[{ ...items[0]!, previewSrc: '/preview-a.jpg' }]} enablePreview />)
    const { dialog } = openFirst()
    const image = within(dialog).getByRole('img')
    expect(image).toHaveAttribute('src', '/preview-a.jpg')
    expect(within(dialog).getByRole('status')).toHaveTextContent('Loading photo')
    fireEvent.load(image)
    expect(within(dialog).queryByRole('status')).toBeNull()
    expect(within(dialog).queryByRole('link')).toBeNull()
  })
  it('ignores unsafe preview sources and keeps the safe original', () => {
    render(<BusinessSiteProjectGallery items={[{ ...items[0]!, previewSrc: 'javascript:alert(1)' }]} enablePreview />)
    expect(within(openFirst().dialog).getByRole('img')).toHaveAttribute('src', '/original-a.jpg')
  })

  it('keeps the modal open under React Strict Mode', () => {
    render(<StrictMode><BusinessSiteProjectGallery items={items} enablePreview /></StrictMode>)
    expect(openFirst().dialog).toHaveAttribute('open')
  })

  it('does not open previews when disabled or when image URLs are unsafe', () => {
    const view = render(<BusinessSiteProjectGallery items={items} />)
    expect(view.container.querySelector('[data-gallery-preview]')).toBeNull()
    view.rerender(<BusinessSiteProjectGallery items={[{ src: 'javascript:alert(1)', alt: 'Bad' }]} enablePreview />)
    expect(view.container).toBeEmptyDOMElement()
  })
})
