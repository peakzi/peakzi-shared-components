import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { businessSiteIcon } from './businessSiteIcon'

describe('businessSiteIcon', () => {
  it.each([
    ['brand-chatgpt', 'chatgpt', 'monochrome'],
    ['brand-gemini', 'gemini', 'monochrome'],
    ['brand-gemini-color', 'gemini', 'color'],
    ['BrandGeminiColor', 'gemini', 'color'],
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
