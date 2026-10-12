import { describe, expect, it } from 'vitest'
import { blogsStyle } from './appearance'

describe('blogsStyle website palette', () => {
  it('derives readable text and the button gradient from three website colors', () => {
    expect(blogsStyle({ backgroundColor: '#fff8ee', gradientStartColor: '#17392f', gradientEndColor: '#416951' })).toMatchObject({
      '--pz-business-blogs-background': '#fff8ee',
      '--pz-business-blogs-text': '#17392f',
      '--pz-business-blogs-accent': '#17392f',
      '--pz-business-blogs-fill': 'linear-gradient(135deg, #17392f, #416951)',
      '--pz-business-blogs-on-accent': '#fff8ee',
    })
  })

  it('uses safe defaults without a separate brand accent', () => {
    expect(blogsStyle({})).toMatchObject({
      '--pz-business-blogs-background': '#ffffff',
      '--pz-business-blogs-text': '#12171c',
      '--pz-business-blogs-fill': 'linear-gradient(135deg, #12171c, #12171c)',
      '--pz-business-blogs-on-accent': '#ffffff',
    })
  })

  it('gives the website palette precedence over legacy text and accent overrides', () => {
    const style = blogsStyle({ gradientStartColor: '#17392f', gradientEndColor: '#416951', textColor: '#0000ff', accentColor: '#ff0000' })
    expect(style).toMatchObject({ '--pz-business-blogs-text': '#17392f', '--pz-business-blogs-accent': '#17392f' })
    expect(JSON.stringify(style)).not.toMatch(/#0000ff|#ff0000/)
  })

  it('retains legacy appearance when a consuming app has not supplied a gradient palette', () => {
    expect(blogsStyle({ textColor: '#223344', accentColor: '#1d4f8c' })).toMatchObject({
      '--pz-business-blogs-text': '#223344', '--pz-business-blogs-accent': '#1d4f8c', '--pz-business-blogs-fill': 'linear-gradient(135deg, #1d4f8c, #1d4f8c)',
    })
  })

  it('normalizes short colors and falls back to the start for an invalid end', () => {
    expect(blogsStyle({ gradientStartColor: '#234', gradientEndColor: 'url(unsafe)' })).toMatchObject({
      '--pz-business-blogs-gradient-start': '#223344', '--pz-business-blogs-gradient-end': '#223344',
    })
  })

  it('rejects unsafe color values', () => {
    const style = blogsStyle({ backgroundColor: 'url(unsafe)', gradientStartColor: 'red; color:unsafe', gradientEndColor: 'var(--unsafe)' })
    expect(style).toMatchObject({ '--pz-business-blogs-background': '#ffffff', '--pz-business-blogs-text': '#12171c' })
    expect(JSON.stringify(style)).not.toContain('unsafe')
  })

  it('avoids white-on-white labels when supplied a light gradient', () => {
    expect(blogsStyle({ gradientStartColor: '#ffffff', gradientEndColor: '#eeeeee' })).toMatchObject({
      '--pz-business-blogs-text': '#000000', '--pz-business-blogs-on-accent': '#000000',
    })
  })
})
