import { describe, expect, it } from 'vitest'
import { servicesStyle } from './appearance'

describe('servicesStyle', () => {
  it('uses the website three-color palette without adding a fourth accent', () => {
    expect(servicesStyle({ backgroundColor: '#fff8ee', gradientStartColor: '#17392f', gradientEndColor: '#416951', accentColor: '#ff0000' })).toMatchObject({
      '--pz-business-services-background': '#fff8ee', '--pz-business-services-text': '#17392f',
      '--pz-business-services-accent': '#17392f', '--pz-business-services-fill': 'linear-gradient(135deg, #17392f, #416951)',
      '--pz-business-services-on-gradient': '#fff8ee',
    })
  })
  it('falls back safely for invalid colors, font and radius', () => {
    const style = servicesStyle({ backgroundColor: 'url(unsafe)', gradientStartColor: 'red; unsafe', gradientEndColor: 'var(--unsafe)', font: 'bad; font' })
    expect(style).toMatchObject({ '--pz-business-services-background': '#ffffff', '--pz-business-services-fill': 'linear-gradient(135deg, #12171c, #12171c)', '--pz-business-services-radius': '8px' })
    expect(JSON.stringify(style)).not.toContain('unsafe')
  })
  it('keeps older explicit appearance props compatible when no palette is supplied', () => {
    expect(servicesStyle({ textColor: '#223344', accentColor: '#1d4f8c' })).toMatchObject({ '--pz-business-services-text': '#223344', '--pz-business-services-accent': '#1d4f8c' })
  })
})
