import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { businessSiteIcon } from './businessSiteIcon'

describe('businessSiteIcon', () => {
  it.each([
    ['brand-chatgpt', 'chatgpt', 'monochrome'],
    ['brand-gemini', 'gemini', 'monochrome'],
    ['brand-gemini-color', 'gemini', 'color'],
    ['BrandGeminiColor', 'gemini', 'color'],
    ['brand-facebook', 'facebook', 'monochrome'],
    ['brand-instagram', 'instagram', 'monochrome'],
    ['brand-youtube', 'youtube', 'monochrome'],
    ['brand-x', 'x', 'monochrome'],
    ['brand-tiktok', 'tiktok', 'monochrome'],
    ['brand-linkedin', 'linkedin', 'monochrome'],
    ['brand-nextdoor', 'nextdoor', 'monochrome'],
    ['brand-yelp', 'yelp', 'monochrome'],
    ['brand-google-business', 'google-business', 'monochrome'],
    ['brand-angi', 'angi', 'monochrome'],
    ['brand-bbb', 'bbb', 'monochrome'],
    ['brand-facebook-color', 'facebook', 'color'],
    ['brand-instagram-color', 'instagram', 'color'],
    ['brand-youtube-color', 'youtube', 'color'],
    ['brand-linkedin-color', 'linkedin', 'color'],
    ['brand-angi-color', 'angi', 'color'],
    ['brand-bbb-color', 'bbb', 'monochrome'],
  ])('renders %s synchronously in server HTML', (name, icon, variant) => {
    const html = renderToStaticMarkup(<>{businessSiteIcon(name)}</>)
    expect(html).toContain(`data-icon="${icon}"`)
    expect(html).toContain(`data-icon-variant="${variant}"`)
    expect(html).toContain('width="17"')
    expect(html).toContain('aria-hidden="true"')
    expect(html).not.toContain('<span')
  })

  it('preserves existing Lucide icons and invalid-name handling', () => {
    expect(renderToStaticMarkup(<>{businessSiteIcon('phone')}</>)).toContain('lucide-phone')
    expect(businessSiteIcon(undefined)).toBeNull()
    expect(businessSiteIcon('<svg>')).toBeNull()
  })
})
