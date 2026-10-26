import { describe, expect, it } from 'vitest'
import { heroStyle } from './appearance'

describe('hero rating icon appearance', () => {
  it('supports an independent rating accent without changing CTA or text colours', () => {
    expect(heroStyle({ ratingIconColor: '#efbf57', accentColor: '#01173c', textColor: '#ffffff' }, 'flat', 'gradient', undefined))
      .toMatchObject({
        '--pz-business-hero-rating-icon': '#efbf57',
        '--pz-business-hero-accent': '#01173c',
        '--pz-business-hero-text': '#ffffff',
      })
  })

  it.each([undefined, '', 'url(unsafe)', 'red; color:blue'])('defaults an invalid rating accent to the validated existing accent: %s', (ratingIconColor) => {
    const style = heroStyle({ ...(ratingIconColor !== undefined ? { ratingIconColor } : {}), accentColor: '#234' }, 'flat', 'surface', undefined)
    expect(style).toMatchObject({ '--pz-business-hero-rating-icon': '#223344', '--pz-business-hero-accent': '#223344' })
    expect(JSON.stringify(style)).not.toContain('unsafe')
  })
})
