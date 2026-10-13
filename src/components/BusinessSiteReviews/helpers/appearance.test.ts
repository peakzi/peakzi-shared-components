import { describe, expect, it } from 'vitest'
import { reviewsStyle } from './appearance'

describe('reviewsStyle three-color palette', () => {
  it('uses safe default colors when no palette is supplied', () => {
    expect(reviewsStyle({})).toMatchObject({
      '--pz-business-reviews-summary-background': '#12171c',
      '--pz-business-reviews-summary-fill': 'linear-gradient(135deg, #12171c, #12171c)',
      '--pz-business-reviews-summary-text': '#ffffff',
      '--pz-business-reviews-summary-accent': '#ffffff',
      '--pz-business-reviews-summary-chip-background': 'color-mix(in srgb, #ffffff 8%, #12171c)',
    })
  })

  it('uses the supplied website gradient without adding a brand accent', () => {
    expect(reviewsStyle({
      backgroundColor: '#ffffff', gradientStartColor: '#12171c', gradientEndColor: '#716a64',
    })).toMatchObject({
      '--pz-business-reviews-background': '#ffffff',
      '--pz-business-reviews-text': '#12171c',
      '--pz-business-reviews-gradient-start': '#12171c',
      '--pz-business-reviews-gradient-end': '#716a64',
      '--pz-business-reviews-summary-fill': 'linear-gradient(135deg, #12171c, #716a64)',
      '--pz-business-reviews-summary-text': '#ffffff',
      '--pz-business-reviews-summary-accent': '#ffffff',
      '--pz-business-reviews-button-background': '#ffffff',
      '--pz-business-reviews-button-text': '#12171c',
      '--pz-business-reviews-summary-chip-background': 'color-mix(in srgb, #ffffff 8%, #12171c)',
    })
  })

  it('updates the summary gradient and light text when the palette changes', () => {
    expect(reviewsStyle({ backgroundColor: '#ffeedd', gradientStartColor: '#234', gradientEndColor: '#556677' })).toMatchObject({
      '--pz-business-reviews-summary-background': '#223344',
      '--pz-business-reviews-summary-fill': 'linear-gradient(135deg, #223344, #556677)',
      '--pz-business-reviews-summary-text': '#ffeedd',
    })
  })

  it('uses the gradient start when the end is omitted or invalid', () => {
    expect(reviewsStyle({ gradientStartColor: '#234', gradientEndColor: 'url(unsafe)' })).toMatchObject({
      '--pz-business-reviews-gradient-end': '#223344',
      '--pz-business-reviews-fill': 'linear-gradient(135deg, #223344, #223344)',
    })
  })

  it('rejects unsafe base colors and keeps every derived value safe', () => {
    const style = reviewsStyle({
      backgroundColor: 'url(unsafe)', gradientStartColor: 'red; background:url(unsafe)', gradientEndColor: 'var(--unsafe)',
    })
    expect(JSON.stringify(style)).not.toContain('unsafe')
    expect(style).toMatchObject({
      '--pz-business-reviews-background': '#ffffff',
      '--pz-business-reviews-text': '#12171c',
      '--pz-business-reviews-gradient-start': '#12171c',
      '--pz-business-reviews-gradient-end': '#12171c',
      '--pz-business-reviews-summary-fill': 'linear-gradient(135deg, #12171c, #12171c)',
      '--pz-business-reviews-summary-text': '#ffffff',
      '--pz-business-reviews-button-text': '#12171c',
    })
  })

  it('chooses readable text from a light gradient instead of white-on-white', () => {
    expect(reviewsStyle({ gradientStartColor: '#ffffff', gradientEndColor: '#eeeeee' })).toMatchObject({
      '--pz-business-reviews-button-text': '#000000',
      '--pz-business-reviews-avatar-text': '#000000',
      '--pz-business-reviews-summary-accent': '#000000',
    })
  })
})
