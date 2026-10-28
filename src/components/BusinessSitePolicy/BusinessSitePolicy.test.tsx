import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { BusinessSitePolicy } from './BusinessSitePolicy'

describe('BusinessSitePolicy', () => {
  it('renders complete semantic content without invented headings, actions or scripts', () => {
    const html = renderToStaticMarkup(<BusinessSitePolicy breadcrumb={<nav aria-label="Breadcrumb">Home / Privacy policy</nav>}>
      <h1>Privacy Policy</h1><p>Effective date from the API.</p><h2>Information</h2><ul><li>Phone number</li></ul>
    </BusinessSitePolicy>)
    expect(html).toContain('<article class="pz-business-policy__body"><h1>Privacy Policy</h1>')
    expect(html).toContain('<li>Phone number</li>')
    expect(html).toContain('aria-label="Breadcrumb"')
    expect(html.match(/<h1>/g)).toHaveLength(1)
    expect(html).not.toMatch(/<script|<button|Call now|Read more/)
  })
  it('uses supplied website tokens and generic fonts without mutating the theme', () => {
    const appearance = { backgroundColor: '#fff8ee', textColor: '#17392f', accentColor: '#17392f', font: 'system-ui', headingFont: 'cursive', density: 'compact' as const }
    const before = { ...appearance }
    const html = renderToStaticMarkup(<BusinessSitePolicy appearance={appearance}><h1>Policy</h1></BusinessSitePolicy>)
    for (const token of ['background:#fff8ee', 'text:#17392f', 'accent:#17392f', 'font:system-ui', 'heading-font:cursive']) expect(html).toContain(`--pz-business-policy-${token}`)
    expect(html).toContain('data-density="compact"')
    expect(appearance).toEqual(before)
  })
  it('rejects CSS injection and preserves readable text', () => {
    const html = renderToStaticMarkup(<BusinessSitePolicy appearance={{ font: 'bad;color:red', backgroundColor: 'url(unsafe)', textColor: '#ffffff', accentColor: '#ffffff' }}>Policy</BusinessSitePolicy>)
    expect(html).not.toContain('unsafe')
    expect(html).not.toContain('bad;color:red')
    expect(html).toContain('--pz-business-policy-text:#000000')
    expect(html).toContain('--pz-business-policy-accent:#000000')
  })
})
