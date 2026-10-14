import { describe, expect, it } from 'vitest'
import { contentFilterNavStyle } from './appearance'

describe('contentFilterNavStyle website palette', () => {
  it('derives readable text and the button gradient from three website colors', () => {
    expect(contentFilterNavStyle({ backgroundColor: '#fff8ee', gradientStartColor: '#17392f', gradientEndColor: '#416951' })).toMatchObject({
      '--pz-business-content-filter-nav-background': '#fff8ee',
      '--pz-business-content-filter-nav-text': '#17392f',
      '--pz-business-content-filter-nav-accent': '#17392f',
      '--pz-business-content-filter-nav-fill': 'linear-gradient(135deg, #17392f, #416951)',
      '--pz-business-content-filter-nav-on-accent': '#fff8ee',
    })
  })

  it('uses safe defaults without a separate brand accent', () => {
    expect(contentFilterNavStyle({})).toMatchObject({
      '--pz-business-content-filter-nav-background': '#ffffff',
      '--pz-business-content-filter-nav-text': '#12171c',
      '--pz-business-content-filter-nav-fill': 'linear-gradient(135deg, #12171c, #12171c)',
      '--pz-business-content-filter-nav-on-accent': '#ffffff',
    })
  })

  it('gives the website palette precedence over legacy text and accent overrides', () => {
    const style = contentFilterNavStyle({ gradientStartColor: '#17392f', gradientEndColor: '#416951', textColor: '#0000ff', accentColor: '#ff0000' })
    expect(style).toMatchObject({ '--pz-business-content-filter-nav-text': '#17392f', '--pz-business-content-filter-nav-accent': '#17392f' })
    expect(JSON.stringify(style)).not.toMatch(/#0000ff|#ff0000/)
  })

  it('retains legacy appearance when a consuming app has not supplied a gradient palette', () => {
    expect(contentFilterNavStyle({ textColor: '#223344', accentColor: '#1d4f8c' })).toMatchObject({
      '--pz-business-content-filter-nav-text': '#223344',
      '--pz-business-content-filter-nav-accent': '#1d4f8c',
      '--pz-business-content-filter-nav-fill': 'linear-gradient(135deg, #1d4f8c, #1d4f8c)',
    })
  })

  it('rejects unsafe color values', () => {
    const style = contentFilterNavStyle({ backgroundColor: 'url(unsafe)', gradientStartColor: 'red; color:unsafe', gradientEndColor: 'var(--unsafe)' })
    expect(style).toMatchObject({ '--pz-business-content-filter-nav-background': '#ffffff', '--pz-business-content-filter-nav-text': '#12171c' })
    expect(JSON.stringify(style)).not.toContain('unsafe')
  })

  it('only accepts a known button radius', () => {
    expect(contentFilterNavStyle({ buttonRadius: '32px' })).toMatchObject({ '--pz-business-content-filter-nav-radius': '32px' })
    // @ts-expect-error — exercising an invalid value a non-TS caller could still pass at runtime
    expect(contentFilterNavStyle({ buttonRadius: '99px' })).toMatchObject({ '--pz-business-content-filter-nav-radius': '8px' })
  })
})
