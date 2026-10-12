import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ReviewRating } from './ReviewRating'

describe('ReviewRating', () => {
  it('uses a unique, server-rendered gradient for each card rating', () => {
    const { container } = render(<><ReviewRating value={4.5} /><ReviewRating value={5} /></>)
    const gradients = [...container.querySelectorAll('linearGradient')]
    expect(gradients).toHaveLength(2)
    expect(gradients[0]!.id).not.toBe(gradients[1]!.id)
    for (const rating of container.querySelectorAll('.pz-business-reviews__rating')) {
      const gradient = rating.querySelector('linearGradient')!
      expect(gradient.querySelector('stop[offset="0%"]')).toHaveAttribute('stop-color', 'var(--pz-business-reviews-gradient-start)')
      expect(gradient.querySelector('stop[offset="100%"]')).toHaveAttribute('stop-color', 'var(--pz-business-reviews-gradient-end)')
      for (const star of rating.querySelectorAll('.pz-business-reviews__star-fill > svg')) {
        expect(star).toHaveAttribute('fill', `url(#${gradient.id})`)
        expect(star).toHaveAttribute('stroke', `url(#${gradient.id})`)
      }
    }
    expect(renderToStaticMarkup(<ReviewRating value={4.5} />)).toContain('<linearGradient')
  })

  it('keeps summary stars solid so they contrast with the dark panel', () => {
    const { container } = render(<ReviewRating value={4.5} showValue />)
    expect(container.querySelector('linearGradient')).toBeNull()
    for (const star of container.querySelectorAll('.pz-business-reviews__star-fill > svg')) {
      expect(star).toHaveAttribute('fill', 'currentColor')
    }
  })

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

  it('avoids announcing backend floating-point noise while preserving partial star fills', () => {
    const { container, getByRole } = render(<ReviewRating value={4.900000095367432} showValue />)
    expect(getByRole('img')).toHaveAttribute('aria-label', '4.9 out of 5 stars')
    expect(Number.parseFloat(container.querySelectorAll<HTMLElement>('.pz-business-reviews__star-fill')[4]!.style.width)).toBeCloseTo(90)
  })

  it.each([null, undefined, NaN, Infinity, -1, 5.1])('omits missing or invalid ratings %s', (value) => {
    expect(renderToStaticMarkup(<ReviewRating value={value} />)).toBe('')
  })
})
