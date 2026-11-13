import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { businessSiteIcon } from './businessSiteIcon'

describe('businessSiteIcon', () => {
  it.each([
    ['brand-chatgpt', 'chatgpt'],
    ['chatgpt', 'chatgpt'],
    ['brand-gemini', 'gemini'],
    ['brand-gemini-color', 'gemini-color'],
    ['BrandGeminiColor', 'gemini-color'],
    ['brand-facebook', 'facebook'],
    ['brand-instagram', 'instagram'],
    ['brand-youtube', 'youtube'],
    ['brand-x', 'twitter'],
    ['brand-tiktok', 'tiktok'],
    ['brand-linkedin', 'linkedin'],
    ['brand-nextdoor', 'nextdoor'],
    ['nextdoor', 'nextdoor'],
    ['brand-yelp', 'yelp'],
    ['brand-google-business', 'google-business'],
    ['google-business', 'google-business'],
    ['brand-angi', 'angi'],
    ['brand-bbb', 'bbb'],
  ])('renders %s synchronously in server HTML', (name, icon) => {
    const html = renderToStaticMarkup(<>{businessSiteIcon(name)}</>)
    expect(html).toContain(`data-icon="${icon}"`)
    expect(html).toContain('color="currentColor"')
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
