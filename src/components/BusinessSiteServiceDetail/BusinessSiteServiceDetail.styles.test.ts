import { resolve } from 'node:path'
import { compile } from 'sass'
import { describe, expect, it } from 'vitest'

const css = compile(resolve('src/components/BusinessSiteServiceDetail/BusinessSiteServiceDetail.scss')).css
const rules = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)]

describe('BusinessSiteServiceDetail primary button palette', () => {
  it('prefers the supplied button color and readable text with a backwards-compatible gradient fallback', () => {
    const primary = rules.find(([, selector]) => selector?.trim() === '.pz-service-detail__action--primary:any-link')?.[2]
    expect(primary).toContain('background: var(--pz-service-detail-button, var(--pz-business-services-fill))')
    expect(primary).toContain('color: var(--pz-service-detail-on-button, var(--pz-business-services-on-gradient))')
  })
  it('keeps the original gradient for trade icons and proof markers rather than the primary button color', () => {
    for (const selector of ['.pz-service-detail__trade-icon', '.pz-service-detail__check']) {
      const decoration = rules.find(([, candidate]) => candidate?.trim() === selector)?.[2]
      expect(decoration).toContain('background: var(--pz-business-services-fill)')
      expect(decoration).not.toContain('--pz-service-detail-button')
    }
    expect(css).toContain('border-radius: var(--pz-business-services-radius)')
    expect(css).toContain('.pz-service-detail__action:focus-visible')
  })
})
