import { resolve } from 'node:path'
import { compile } from 'sass'
import { describe, expect, it } from 'vitest'

const css = compile(resolve('src/components/BusinessSiteCta/BusinessSiteCta.scss')).css

describe('BusinessSiteCta style contract', () => {
  it('uses content-sized desktop buttons with the header button typography, padding and touch height', () => {
    const action = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
      .find(([, selector, declarations]) => selector?.trim() === '.pz-business-cta .pz-business-cta__action:any-link' && declarations?.includes('min-height:'))?.[2]
    expect(action).toContain('width: fit-content')
    expect(action).toContain('max-width: 100%')
    expect(action).toContain('font-size: var(--text-sm)')
    expect(action).toContain('padding: var(--space-2) var(--space-4)')
    expect(action).toContain('line-height: var(--leading-snug)')
    expect(action).toContain('min-height: var(--space-12)')
    const icon = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
      .find(([, selector]) => selector?.trim() === '.pz-business-cta__icon svg')?.[2]
    expect(icon).not.toMatch(/\b(?:width|height):/)
  })
  it('gives stacked service-desk buttons one compact, equal-width column and full-width mobile targets', () => {
    const actions = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
      .find(([, selector, declarations]) => selector?.includes('service-desk') && selector.includes('__actions') && declarations?.includes('align-self: stretch'))?.[2]
    expect(actions).toContain('display: grid')
    expect(actions).toContain('grid-template-columns: minmax(0, max-content)')
    expect(actions).toContain('align-items: stretch')
    expect(actions).toContain('align-content: center')
    expect(actions).toContain('justify-content: center')
    const button = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
      .find(([, selector]) => selector?.trim() === '.pz-business-cta[data-cta-variant=service-desk] .pz-business-cta__action:any-link')?.[2]
    expect(button).toContain('width: 100%')
    expect(actions).not.toMatch(/(?:min-)?width:\s*\d+(?:px|rem)/)
    const mobile = css.slice(css.indexOf('@media (max-width: 45em)'))
    expect(mobile).toMatch(/\.pz-business-cta \.pz-business-cta__action:any-link\s*\{\s*width: 100%;/)
    expect(mobile).toMatch(/service-desk[^{}]*__actions\s*\{[^{}]*grid-template-columns: minmax\(0, 1fr\)/)
    expect(mobile).toMatch(/service-desk[^{}]*__actions\s*\{[^{}]*align-items: stretch/)
  })
  it('gives direct line a full-width reading and action layout without stacked top padding', () => {
    expect(css).toContain('grid-template-columns: minmax(0, 2fr) minmax(0, 1fr)')
    expect(css).toContain('padding-block: 0 var(--space-5)')
    expect(css).toContain('padding-block: 0 var(--space-4)')
  })
  it('uses the existing theme gradient and on-dark text without changing panel geometry', () => {
    const panel = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
      .find(([, selector, declarations]) => selector?.includes('direct-line') && selector.includes('__panel') && declarations?.includes('linear-gradient'))?.[2]
    expect(panel).toContain('background: linear-gradient(135deg, var(--cta-background), var(--cta-end))')
    expect(panel).toContain('color: var(--cta-text)')
    expect(panel).not.toContain('color-mix')
    expect(panel).toContain('border-radius: var(--cta-radius)')
    expect(panel).toContain('border: 0')
    expect(panel).toContain('padding: var(--space-6)')
    expect(css).toContain('text-align: start')
  })
  it('keeps secondary buttons on the header-style page surface across every layout', () => {
    const rules = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
    const secondary = rules.find(([, selector, declarations]) => selector?.trim() === '.pz-business-cta .pz-business-cta__action:any-link' && declarations?.includes('--cta-action-background:'))?.[2]
    expect(secondary).toContain('--cta-action-background: var(--cta-surface)')
    expect(secondary).toContain('--cta-action-text: var(--cta-surface-text)')
    expect(secondary).toContain('--cta-action-border: color-mix(in srgb, var(--cta-action-text) 25%, var(--cta-surface))')
    const dark = rules.filter(([, selector]) => selector?.includes('direct-line') && selector.includes('service-desk'))
    expect(dark.some(([, , declarations]) => declarations?.includes('--cta-action-text: var(--cta-text)'))).toBe(false)
    const actions = rules.find(([, selector]) => selector?.trim() === '.pz-business-cta__actions')?.[2]
    expect(actions).toContain('gap: var(--space-2)')
  })
  it('shares the supplied primary palette and visible focus styling across both dark variants', () => {
    const darkRules = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
      .filter(([, selector]) => selector?.includes('direct-line') && selector.includes('service-desk'))
    const primary = darkRules.find(([, selector]) => selector?.includes('__action--primary'))?.[2]
    expect(primary).toContain('--cta-action-background: var(--cta-accent)')
    expect(primary).toContain('--cta-action-text: var(--cta-on-accent)')
    expect(darkRules.find(([, selector]) => selector?.includes(':focus-visible'))?.[2]).toContain('outline-color: var(--cta-text)')
  })
  it('tightens the Services-to-CTA gap only for adjacent shared sections', () => {
    const spacing = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
      .find(([, selector]) => selector?.includes('.pz-business-services + .pz-business-cta'))?.[2]
    expect(spacing).toContain('margin-block-start: calc(var(--space-3) * -1)')
  })
  it('uses the theme radius for actions without circle or square overrides', () => {
    const actionRules = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
      .filter(([, selector]) => /__action(?=[:\s,]|$)/.test(selector ?? ''))
    const radii = actionRules.flatMap(([, , declarations]) => [...(declarations ?? '').matchAll(/border-radius:\s*([^;]+);/g)].map((match) => match[1]))
    expect(radii).toEqual(['var(--cta-radius)'])
    expect(css).not.toContain('--radius-full')
  })
  it('contains no top/bottom separators, raised shadows or hover lift', () => {
    expect(css).not.toMatch(/border-(block|top|bottom)\s*:/)
    expect([...css.matchAll(/box-shadow:\s*([^;]+);/g)].map((match) => match[1])).toEqual(['none'])
    expect(css).not.toContain('translate:')
  })
  it('keeps a 48px minimum touch target instead of a fixed-size circular action', () => {
    expect(css).toContain('min-height: var(--space-12)')
    expect(css).not.toContain('width: var(--space-24)')
    expect(css).not.toContain('min-height: var(--space-20)')
  })
})
