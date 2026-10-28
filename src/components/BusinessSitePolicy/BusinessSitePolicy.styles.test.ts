import { resolve } from 'node:path'
import { compile } from 'sass'
import { describe, expect, it } from 'vitest'

const css = compile(resolve('src/components/BusinessSitePolicy/BusinessSitePolicy.scss')).css
const rules = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
const declarations = (selector: string) => rules.find(([, rule]) => rule?.trim() === selector)?.[2]

describe('BusinessSitePolicy breadcrumb alignment', () => {
  it('keeps breadcrumb items on the same baseline with no individual vertical offset', () => {
    expect(declarations('.pz-business-policy__breadcrumb ol')).toContain('align-items: baseline')
    expect(declarations('.pz-business-policy__breadcrumb li')).toContain('align-items: baseline')
    expect(declarations('.pz-business-policy__breadcrumb li')).toContain('margin: 0')
    expect(declarations('.pz-business-policy__breadcrumb li')).toContain('padding: 0')
  })
  it('limits spacing between list items to policy body lists, never breadcrumbs', () => {
    expect(declarations('.pz-business-policy__body li + li')).toContain('margin-top: 6px')
    expect(declarations('.pz-business-policy li + li')).toBeUndefined()
  })
})
