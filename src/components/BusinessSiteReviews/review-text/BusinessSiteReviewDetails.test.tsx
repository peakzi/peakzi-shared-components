import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BusinessSiteReviews } from '../BusinessSiteReviews'
import { BusinessSiteReviewDetails } from './BusinessSiteReviewDetails'
import { reviewPreview } from '../helpers/review-preview'

const item = {
  id: 'long-review', reviewerName: 'Alex Morgan', rating: 5, reviewDate: '2026-09-20',
  text: 'A careful repair and clear communication. '.repeat(12),
  highlightedPhrases: ['clear communication'],
}
const showModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const close = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')

beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true, value(this: HTMLDialogElement) { this.setAttribute('open', '') },
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true, value(this: HTMLDialogElement) {
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    },
  })
})
afterEach(() => {
  cleanup()
  if (showModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', showModal)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  if (close) Object.defineProperty(HTMLDialogElement.prototype, 'close', close)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
  document.body.style.overflow = ''
})

describe('review details', () => {
  it('shows short reviews with highlights and no modal or disclosure', () => {
    expect(renderToStaticMarkup(<BusinessSiteReviewDetails item={{ id: 'short', text: 'Helpful service.', highlightedPhrases: ['Helpful'] }} />))
      .toBe('<blockquote><mark>Helpful</mark> service.</blockquote>')
  })

  it('preserves the standard and featured preview caps, word boundaries and Unicode', () => {
    expect(reviewPreview('a'.repeat(160))).toBeUndefined()
    expect(reviewPreview('a'.repeat(161))).toHaveLength(160)
    expect(reviewPreview('a'.repeat(320), true)).toBeUndefined()
    expect(reviewPreview('a'.repeat(321), true)).toHaveLength(320)
    expect(reviewPreview(`${'a'.repeat(150)} incomplete word`)).toBe('a'.repeat(150))
    expect(Array.from(reviewPreview('😀'.repeat(161))!)).toHaveLength(160)
    expect(renderToStaticMarkup(<BusinessSiteReviewDetails item={{ ...item, text: 'a'.repeat(200) }} featured />)).not.toContain('<details')
  })

  it('keeps the complete review and its highlights in server HTML exactly once', () => {
    const html = renderToStaticMarkup(<BusinessSiteReviewDetails item={item} />)
    const root = document.createElement('div')
    root.innerHTML = html
    expect(root.querySelectorAll('blockquote')).toHaveLength(1)
    expect(root.querySelector('blockquote')?.textContent).toBe(item.text)
    expect(root.querySelector('blockquote mark')).toHaveTextContent('clear communication')
    expect(root.querySelector('dialog')).not.toHaveAttribute('open')
    expect(root.querySelector('.pz-business-reviews__preview')?.textContent).toBe(`${reviewPreview(item.text)}…`)
  })

  it.each(['compact', 'comfortable'] as const)('opens a full themed review without expanding the %s card', async (density) => {
    const user = userEvent.setup()
    const { container } = render(<BusinessSiteReviews items={[item]} appearance={{ density, font: 'Outfit', backgroundColor: '#ffffff' }} />)
    const preview = container.querySelector('.pz-business-reviews__preview')!.textContent
    const trigger = screen.getByText('Read full review')
    document.body.style.overflow = 'clip'
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Review by Alex Morgan' })
    expect(dialog.closest('.pz-business-reviews')).toHaveAttribute('data-density', density)
    expect(within(dialog).getByRole('img', { name: '5 out of 5 stars' })).toBeVisible()
    expect(within(dialog).getByText('Alex Morgan')).toBeVisible()
    expect(within(dialog).getByText('Sep 20, 2026')).toBeVisible()
    expect(dialog.querySelector('blockquote')?.textContent).toBe(item.text)
    expect(dialog.querySelector('mark')).toHaveTextContent('clear communication')
    expect(container.querySelector('.pz-business-reviews__preview')?.textContent).toBe(preview)
    expect(container.querySelector('details')).not.toHaveAttribute('open')
    expect(document.body.style.overflow).toBe('hidden')
    await user.click(within(dialog).getByRole('button', { name: 'Close review details' }))
    expect(dialog).not.toHaveAttribute('open')
    expect(document.body.style.overflow).toBe('clip')
    expect(trigger).toHaveFocus()
    expect(screen.queryByText('Show less')).not.toBeInTheDocument()
  })

  it.each(['escape', 'backdrop'] as const)('closes on %s', async (action) => {
    const user = userEvent.setup()
    render(<BusinessSiteReviewDetails item={item} />)
    await user.click(screen.getByText('Read full review'))
    const dialog = screen.getByRole('dialog')
    if (action === 'escape') fireEvent(dialog, new Event('cancel', { cancelable: true }))
    else fireEvent.click(dialog, { clientX: -10, clientY: -10 })
    expect(dialog).not.toHaveAttribute('open')
    expect(document.body.style.overflow).toBe('')
  })

  it('does not close when the review content is clicked', async () => {
    const user = userEvent.setup()
    render(<BusinessSiteReviewDetails item={item} />)
    await user.click(screen.getByText('Read full review'))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(dialog.querySelector('blockquote')!)
    expect(dialog).toHaveAttribute('open')
  })

  it('restores scrolling when removed or replaced while open', async () => {
    const user = userEvent.setup()
    const { rerender, unmount } = render(<BusinessSiteReviewDetails item={item} />)
    await user.click(screen.getByText('Read full review'))
    rerender(<BusinessSiteReviewDetails item={{ ...item, id: 'replacement' }} />)
    expect(document.body.style.overflow).toBe('')
    await user.click(screen.getByText('Read full review'))
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('retains a native disclosure fallback when dialog is unsupported', async () => {
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
    const user = userEvent.setup()
    const { container } = render(<BusinessSiteReviewDetails item={item} />)
    await user.click(screen.getByText('Read full review'))
    expect(container.querySelector('details')).toHaveAttribute('open')
    expect(container.querySelector('dialog')).not.toHaveAttribute('open')
    expect(container.querySelector('blockquote')?.textContent).toBe(item.text)
    expect(document.body.style.overflow).toBe('')
  })

  it('releases the scroll lock when a card becomes featured and no longer needs truncation', async () => {
    const user = userEvent.setup()
    const medium = { ...item, text: 'a'.repeat(200) }
    const { rerender } = render(<BusinessSiteReviewDetails item={medium} />)
    await user.click(screen.getByText('Read full review'))
    expect(document.body.style.overflow).toBe('hidden')
    rerender(<BusinessSiteReviewDetails item={medium} featured />)
    expect(screen.queryByText('Read full review')).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
  })
})
