import { describe, expect, it } from 'vitest'
import { contentListStyle } from './appearance'

describe('contentListStyle website palette', () => {
  it('derives readable text and the button gradient from three website colors', () => {
    expect(contentListStyle({ backgroundColor: '#fff8ee', gradientStartColor: '#17392f', gradientEndColor: '#416951' })).toMatchObject({
      '--pz-business-content-list-background': '#fff8ee',
      '--pz-business-content-list-text': '#17392f',
      '--pz-business-content-list-accent': '#17392f',
      '--pz-business-content-list-fill': 'linear-gradient(135deg, #17392f, #416951)',
      '--pz-business-content-list-on-accent': '#fff8ee',
    })
  })

  it('uses safe defaults without a separate brand accent', () => {
    expect(contentListStyle({})).toMatchObject({
      '--pz-business-content-list-background': '#ffffff',
      '--pz-business-content-list-text': '#12171c',
      '--pz-business-content-list-fill': 'linear-gradient(135deg, #12171c, #12171c)',
      '--pz-business-content-list-on-accent': '#ffffff',
    })
  })

  it('gives the website palette precedence over legacy text and accent overrides', () => {
    const style = contentListStyle({ gradientStartColor: '#17392f', gradientEndColor: '#416951', textColor: '#0000ff', accentColor: '#ff0000' })
    expect(style).toMatchObject({ '--pz-business-content-list-text': '#17392f', '--pz-business-content-list-accent': '#17392f' })
    expect(JSON.stringify(style)).not.toMatch(/#0000ff|#ff0000/)
  })

  it('retains legacy appearance when a consuming app has not supplied a gradient palette', () => {
    expect(contentListStyle({ textColor: '#223344', accentColor: '#1d4f8c' })).toMatchObject({
      '--pz-business-content-list-text': '#223344',
      '--pz-business-content-list-accent': '#1d4f8c',
      '--pz-business-content-list-fill': 'linear-gradient(135deg, #1d4f8c, #1d4f8c)',
    })
  })

  it('rejects unsafe color values', () => {
    const style = contentListStyle({ backgroundColor: 'url(unsafe)', gradientStartColor: 'red; color:unsafe', gradientEndColor: 'var(--unsafe)' })
    expect(style).toMatchObject({ '--pz-business-content-list-background': '#ffffff', '--pz-business-content-list-text': '#12171c' })
    expect(JSON.stringify(style)).not.toContain('unsafe')
  })

  it('avoids white-on-white labels when supplied a light gradient', () => {
    expect(contentListStyle({ gradientStartColor: '#ffffff', gradientEndColor: '#eeeeee' })).toMatchObject({
      '--pz-business-content-list-text': '#000000',
      '--pz-business-content-list-on-accent': '#000000',
    })
  })

  it('falls back to the font presets and defaults the radius', () => {
    expect(contentListStyle({})).toMatchObject({
      '--pz-business-content-list-font': '"IBM Plex Sans", Arial, sans-serif',
      '--pz-business-content-list-heading-font': '"Archivo", Arial, sans-serif',
      '--pz-business-content-list-radius': '8px',
    })
  })

  it('only accepts a known button radius', () => {
    expect(contentListStyle({ buttonRadius: '32px' })).toMatchObject({ '--pz-business-content-list-radius': '32px' })
    // @ts-expect-error — exercising an invalid value a non-TS caller (or stale data) could still pass at runtime
    expect(contentListStyle({ buttonRadius: '99px' })).toMatchObject({ '--pz-business-content-list-radius': '8px' })
  })
})
