import { describe, expect, it } from 'vitest'
import { faqStyle } from './appearance'

describe('faqStyle website palette', () => {
  it('uses the same website gradient for the contact card and disclosure controls', () => {
    expect(faqStyle({ backgroundColor: '#fff8ee', gradientStartColor: '#17392f', gradientEndColor: '#416951' })).toMatchObject({
      '--pz-business-faq-background': '#fff8ee',
      '--pz-business-faq-text': '#17392f',
      '--pz-business-faq-accent': '#17392f',
      '--pz-business-faq-fill': 'linear-gradient(135deg, #17392f, #416951)',
      '--pz-business-faq-contact-text': '#fff8ee',
    })
  })

  it('uses safe defaults without an independent blue accent', () => {
    expect(faqStyle({})).toMatchObject({
      '--pz-business-faq-background': '#ffffff', '--pz-business-faq-text': '#12171c',
      '--pz-business-faq-accent': '#12171c', '--pz-business-faq-contact-text': '#ffffff',
    })
  })

  it('gives the website palette precedence over all legacy color overrides', () => {
    const style = faqStyle({
      gradientStartColor: '#17392f', gradientEndColor: '#416951', textColor: '#0000ff', accentColor: '#ff0000',
      contactBackgroundColor: '#ff0000', contactGradientEndColor: '#0000ff', contactTextColor: '#ff0000',
    })
    expect(style).toMatchObject({ '--pz-business-faq-fill': 'linear-gradient(135deg, #17392f, #416951)', '--pz-business-faq-contact-text': '#ffffff' })
    expect(JSON.stringify(style)).not.toMatch(/#0000ff|#ff0000/)
  })

  it('preserves legacy contact colors until a consuming app switches to the new palette', () => {
    expect(faqStyle({ contactBackgroundColor: '#223344', contactGradientEndColor: '#445566', accentColor: '#1d4f8c' })).toMatchObject({
      '--pz-business-faq-fill': 'linear-gradient(135deg, #223344, #445566)', '--pz-business-faq-accent': '#1d4f8c',
    })
  })

  it('normalizes short colors and uses the start when the end is omitted', () => {
    expect(faqStyle({ gradientStartColor: '#234' })).toMatchObject({
      '--pz-business-faq-contact-background': '#223344', '--pz-business-faq-contact-end': '#223344',
    })
  })

  it('rejects unsafe colors and prevents legacy values from overriding an invalid new palette', () => {
    const style = faqStyle({
      backgroundColor: 'url(unsafe)', gradientStartColor: 'red; color:unsafe', gradientEndColor: 'var(--unsafe)', contactBackgroundColor: '#ff0000',
    })
    expect(style).toMatchObject({ '--pz-business-faq-background': '#ffffff', '--pz-business-faq-fill': 'linear-gradient(135deg, #12171c, #12171c)' })
    expect(JSON.stringify(style)).not.toContain('unsafe')
    expect(JSON.stringify(style)).not.toContain('#ff0000')
  })

  it('chooses readable text for a light contact gradient', () => {
    expect(faqStyle({ gradientStartColor: '#ffffff', gradientEndColor: '#eeeeee' })).toMatchObject({
      '--pz-business-faq-text': '#000000', '--pz-business-faq-contact-text': '#000000',
    })
  })
})
