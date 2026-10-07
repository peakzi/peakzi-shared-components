import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ReviewRating } from './ReviewRating'

describe('ReviewRating', () => {
  it.each([
    [0, ['0%', '0%', '0%', '0%', '0%']],
    [4, ['100%', '100%', '100%', '100%', '0%']],
    [4.5, ['100%', '100%', '100%', '100%', '50%']],
    [5, ['100%', '100%', '100%', '100%', '100%']],
  ] as const)('renders the actual %s rating with full, partial and empty stars', (value, fills) => {
    const { container, getByRole } = render(<ReviewRating value={value} />)
    expect(getByRole('img')).toHaveAttribute('aria-label', `${value} out of 5 stars`)
    expect([...container.querySelectorAll<HTMLElement>('.pz-business-reviews__star-fill')].map((star) => star.style.width)).toEqual(fills)
  })

  it('supports decimal ratings without rounding all stars to full', () => {
    const { container } = render(<ReviewRating value={4.9} showValue />)
    const fills = [...container.querySelectorAll<HTMLElement>('.pz-business-reviews__star-fill')]
    expect(Number.parseFloat(fills[4]!.style.width)).toBeCloseTo(90)
    expect(container).toHaveTextContent('4.9')
  })

  it.each([null, undefined, NaN, Infinity, -1, 5.1])('omits missing or invalid ratings %s', (value) => {
    expect(renderToStaticMarkup(<ReviewRating value={value} />)).toBe('')
  })
})
