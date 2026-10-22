import { describe, expect, it } from 'vitest'
import { buildTierView } from './tiers'
import type { BusinessSiteServicePricingTier } from './types'

const repair: BusinessSiteServicePricingTier = {
  name: 'Repair', low: 180, high: 450, typicalLow: 220, typicalHigh: 500,
  included: ['Diagnostic visit'],
  factors: [{ label: 'Easy access', low: -40, high: -60 }, { label: 'Tankless', low: 120, high: 200 }],
}

describe('buildTierView', () => {
  it('formats a priced tier and splits factors by direction', () => {
    const view = buildTierView(repair, 'always')
    expect(view).toMatchObject({ name: 'Repair', hasPrice: true, priceRange: '$180 – $450', isBare: false })
    expect(view.lowers.map((factor) => factor.label)).toEqual(['Easy access'])
    expect(view.raisers.map((factor) => factor.label)).toEqual(['Tankless'])
  })

  it.each([
    [{ low: 100 }], [{ high: 200 }], [{ low: NaN, high: 10 }], [{ low: 1, high: Infinity }], [{}],
  ])('treats %j as unpriced', (prices) => {
    const view = buildTierView({ name: 'T', ...prices }, 'always')
    expect(view).toMatchObject({ hasPrice: false, priceRange: '', showTypical: false })
  })

  it.each([
    [{ low: 100, high: 150 }, 'Below typical', true],
    [{ low: 150, high: 200 }, 'Below typical', true],
    [{ low: 100, high: 300 }, 'Within typical', false],
    [{ low: 250, high: 300 }, 'Above typical', false],
  ])('labels %j as "%s"', (prices, note, below) => {
    const view = buildTierView({ name: 'T', ...prices, typicalLow: 120, typicalHigh: 200 }, 'always')
    expect(view).toMatchObject({ typicalNote: note, isBelowTypical: below, typicalRange: '$120 – $200', showTypical: true })
  })

  it('only shows the comparison under "lower-only" when at or below typical', () => {
    const typical = { typicalLow: 120, typicalHigh: 200 }
    expect(buildTierView({ name: 'T', low: 100, high: 150, ...typical }, 'lower-only').showTypical).toBe(true)
    expect(buildTierView({ name: 'T', low: 100, high: 300, ...typical }, 'lower-only').showTypical).toBe(false)
    expect(buildTierView({ name: 'T', low: 250, high: 300, ...typical }, 'lower-only').showTypical).toBe(false)
  })

  it('needs both typical bounds and a priced tier', () => {
    expect(buildTierView({ name: 'T', low: 1, high: 2, typicalLow: 1 }, 'always').showTypical).toBe(false)
    expect(buildTierView({ name: 'T', low: 1, high: 2, typicalHigh: 2 }, 'always').showTypical).toBe(false)
    expect(buildTierView({ name: 'T', typicalLow: 1, typicalHigh: 2 }, 'always').showTypical).toBe(false)
  })

  it('positions both bars against 108% of the larger upper bound', () => {
    const view = buildTierView(repair, 'always')
    expect(view.ourBarStyle).toEqual({ left: '33.33%', width: 'calc(83.33% - 33.33%)' })
    expect(view.typicalBarStyle).toEqual({ left: '40.74%', width: 'calc(92.59% - 40.74%)' })
  })

  it('drops factors without an amount and reports a bare tier', () => {
    const view = buildTierView({ name: 'T', low: 1, high: 2, factors: [{ label: 'Nothing' }, { label: 'Bad', percent: NaN }] }, 'always')
    expect(view).toMatchObject({ lowers: [], raisers: [], isBare: true })
  })

  it('is not bare when it has included items or usable factors', () => {
    expect(buildTierView({ name: 'T', included: ['One'] }, 'always').isBare).toBe(false)
    expect(buildTierView({ name: 'T', factors: [{ label: 'A', percent: 5 }] }, 'always').isBare).toBe(false)
  })
})
