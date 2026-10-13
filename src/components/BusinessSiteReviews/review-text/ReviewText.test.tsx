import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReviewText } from './ReviewText'

describe('ReviewText', () => {
  it('shows shorter reviews completely without a disclosure', () => {
    const html = renderToStaticMarkup(<ReviewText text="Helpful service." highlightedPhrases={['Helpful']} />)
    expect(html).toBe('<blockquote><mark>Helpful</mark> service.</blockquote>')
  })

  it('keeps the entire long review in one server-rendered quote with its highlights', () => {
    const text = 'A careful repair and clear communication. '.repeat(12)
    const { container } = render(<ReviewText text={text} highlightedPhrases={['clear communication']} />)
    expect(container.querySelectorAll('blockquote')).toHaveLength(1)
    expect(container.querySelector('blockquote')?.textContent).toBe(text)
    expect(container.querySelector('blockquote mark')?.textContent).toBe('clear communication')
    expect(container.querySelector('details')).not.toHaveAttribute('open')
    expect(container.querySelector('.pz-business-reviews__preview')!.textContent!.length).toBeLessThanOrEqual(161)
  })

  it('lets the native summary expand and collapse without client component state', async () => {
    const user = userEvent.setup()
    const { container } = render(<ReviewText text={'A helpful explanation. '.repeat(20)} />)
    await user.click(screen.getByText('Read full review'))
    expect(container.querySelector('details')).toHaveAttribute('open')
    await user.click(screen.getByText('Show less'))
    expect(container.querySelector('details')).not.toHaveAttribute('open')
  })

  it('allows more text in the featured review without prematurely truncating it', () => {
    const text = 'A clear explanation. '.repeat(10)
    expect(renderToStaticMarkup(<ReviewText text={text} />)).toContain('<details')
    expect(renderToStaticMarkup(<ReviewText text={text} featured />)).not.toContain('<details')
  })
})
