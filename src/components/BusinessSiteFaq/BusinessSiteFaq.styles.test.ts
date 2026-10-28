import { resolve } from 'node:path'
import { compile } from 'sass'
import { describe, expect, it } from 'vitest'

const css = compile(resolve('src/components/BusinessSiteFaq/BusinessSiteFaq.scss')).css
const rules = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)]

describe('BusinessSiteFaq contact button styles', () => {
  it('matches header button dimensions, typography, spacing and content sizing', () => {
    const action = rules.find(([, selector]) => selector?.trim() === '.pz-business-faq__actions a')?.[2]
    for (const declaration of ['min-height: 48px', 'min-width: 48px', 'width: fit-content', 'max-width: 100%',
      'padding: 8px 16px', 'gap: 8px', 'font-family: inherit', 'font-size: 14px', 'font-weight: 600', 'line-height: 1.25',
      'border-radius: var(--pz-business-faq-radius)']) expect(action).toContain(declaration)
    expect(rules.find(([, selector]) => selector?.trim() === '.pz-business-faq__actions')?.[2]).toContain('gap: 8px')
    expect(css).toContain('.pz-business-faq__actions a {\n    flex: 1 1 auto;')
  })
  it('keeps secondary actions on the header surface with its text and subtle outline', () => {
    const action = rules.find(([, selector]) => selector?.trim() === '.pz-business-faq__actions a')?.[2]
    expect(action).toContain('--faq-action-background: var(--pz-business-faq-background)')
    expect(action).toContain('--faq-action-text: var(--pz-business-faq-contact-secondary-text)')
    expect(action).toContain('--faq-action-border: color-mix(in srgb, var(--faq-action-text) 25%, var(--pz-business-faq-background))')
  })
  it('uses the contact theme color and readable text for the primary action', () => {
    const primary = rules.find(([, selector]) => selector?.includes('data-action-type=primary'))?.[2]
    expect(primary).toContain('--faq-action-background: var(--pz-business-faq-contact-button)')
    expect(primary).toContain('--faq-action-text: var(--pz-business-faq-on-contact-button)')
  })
  it('keeps the same colors on hover and retains a visible on-dark focus outline', () => {
    const hover = rules.find(([, selector]) => selector?.trim() === '.pz-business-faq__actions a:hover')?.[2]
    expect(hover).toContain('background: var(--faq-action-background)')
    expect(hover).toContain('color: var(--faq-action-text)')
    expect(css).toContain('outline: 2px solid var(--pz-business-faq-contact-text)')
  })
})
