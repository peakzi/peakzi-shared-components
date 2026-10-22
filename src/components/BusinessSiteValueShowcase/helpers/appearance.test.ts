import { describe, expect, it } from 'vitest'
import { mixHex, valueShowcaseStyle } from './appearance'

const style = (appearance: Parameters<typeof valueShowcaseStyle>[0]) => valueShowcaseStyle(appearance) as Record<string, string>

describe('valueShowcaseStyle', () => {
  it('falls back to safe colours, fonts and radius', () => {
    const s = style({ backgroundColor: 'url(x)', gradientStartColor: 'red; color: blue', buttonRadius: '99px' as never, font: '<script>' })
    expect(s['--pz-business-value-showcase-background']).toBe('#ffffff')
    expect(s['--pz-business-value-showcase-radius']).toBe('8px')
    expect(s['--pz-business-value-showcase-font']).toContain('IBM Plex Sans')
  })

  it('steps the accent to a readable colour', () => {
    const s = style({ backgroundColor: '#ffffff', accentColor: '#afe0e8' })
    expect(s['--pz-business-value-showcase-accent']).toBe('#000000')
    expect(style({ backgroundColor: '#ffffff', accentColor: '#1d6f87' })['--pz-business-value-showcase-accent']).toBe('#1d6f87')
  })

  it('keeps text on the gradient fill readable', () => {
    for (const end of ['#2c95b5', '#ffd400', '#0a0a0a']) {
      const s = style({ gradientStartColor: '#000000', gradientEndColor: end })
      expect(['#ffffff', '#000000']).toContain(s['--pz-business-value-showcase-on-fill'])
    }
  })

  it('caps the small radius at 8px', () => {
    expect(style({ buttonRadius: '32px' })['--pz-business-value-showcase-radius-sm']).toBe('min(32px, 8px)')
  })
})

describe('mixHex', () => {
  it('matches a plain sRGB mix', () => {
    expect(mixHex('#ffffff', '#000000', 0.5)).toBe('#808080')
    expect(mixHex('#2c95b5', '#000000', 1)).toBe('#2c95b5')
  })
})
