import { describe, expect, it } from 'vitest'
import { valueShowcaseBackground, valueShowcaseStyle } from './appearance'

const style = (appearance: Parameters<typeof valueShowcaseStyle>[0]) => valueShowcaseStyle(appearance) as Record<string, string>

describe('valueShowcaseStyle', () => {
  it('falls back to safe colors, fonts and radius', () => {
    const s = style({ backgroundColor: 'url(x)', gradientStartColor: 'red; color: blue', buttonRadius: '99px' as never, font: '<script>' })
    expect(s['--pz-business-value-showcase-background']).toBe('#ffffff')
    expect(s['--pz-business-value-showcase-radius']).toBe('8px')
    expect(s['--pz-business-value-showcase-font']).toContain('IBM Plex Sans')
  })

  it('keeps band text readable on every background', () => {
    for (const background of ['surface', 'tint', 'soft', 'gradient', 'ink'] as const) {
      const s = style({ background, backgroundColor: '#ffffff', gradientStartColor: '#000000', gradientEndColor: '#2c95b5' })
      const dark = background === 'gradient' || background === 'ink'
      expect(s['--pz-business-value-showcase-band-text']).toBe(dark ? '#ffffff' : '#000000')
    }
  })

  it('uses the accent for the primary action with readable text', () => {
    const s = style({ accentColor: '#2c95b5' })
    expect(s['--pz-business-value-showcase-accent']).toBe('#2c95b5')
    expect(['#000000', '#ffffff']).toContain(s['--pz-business-value-showcase-on-accent'])
  })

  it('defaults unknown backgrounds to gradient', () => {
    expect(valueShowcaseBackground('neon')).toBe('gradient')
  })
})
