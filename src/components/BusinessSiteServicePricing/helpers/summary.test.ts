import { describe, expect, it } from 'vitest'
import { pricingLede, pricingStats, resolveFairValue, showPerception, usableSentiments } from './summary'
import { buildTierView } from './tiers'
import type { BusinessSiteServicePricingSentiment, BusinessSiteServicePricingTier } from './types'

const views = (tiers: readonly BusinessSiteServicePricingTier[]) => tiers.map((tier) => buildTierView(tier, 'always'))
const ledeFor = (service: string, tiers: readonly BusinessSiteServicePricingTier[]) => pricingLede(service, tiers, views(tiers))

describe('resolveFairValue', () => {
  it('keeps it when the business is at or above the market', () => {
    expect(resolveFairValue({ businessPercentage: 88, marketPercentage: 74 })).toEqual({ businessPercentage: 88, marketPercentage: 74 })
    expect(resolveFairValue({ businessPercentage: 80, marketPercentage: 80 })).not.toBeNull()
  })

  it.each([
    [{ businessPercentage: 60, marketPercentage: 74 }],
    [{ businessPercentage: NaN, marketPercentage: 50 }],
    [{ businessPercentage: Infinity, marketPercentage: 50 }],
    [{ businessPercentage: 60, marketPercentage: NaN }],
    [null],
    [undefined],
  ])('drops %j', (fairValue) => expect(resolveFairValue(fairValue)).toBeNull())
})

describe('pricingStats', () => {
  it('shows vs-market only when below market, rounded to one decimal', () => {
    expect(pricingStats(-12.34, null)).toEqual([
      { value: '12.3%', label: 'below the local market average', sub: 'Same job types, same area' },
    ])
    ;[0, 8, null, undefined, NaN, Infinity, -Infinity].forEach((value) => expect(pricingStats(value, null)).toEqual([]))
  })

  it('adds the fair-value stat after vs-market', () => {
    const stats = pricingStats(-12, { businessPercentage: 87.66, marketPercentage: 74.04 })
    expect(stats.map((stat) => stat.value)).toEqual(['12%', '87.7%'])
    expect(stats[1]!.sub).toBe('Market average 74%')
  })
})

describe('usableSentiments and showPerception', () => {
  const great: BusinessSiteServicePricingSentiment = { key: 'great', label: 'Great', businessPercentage: 64, marketPercentage: 36 }

  it('drops null entries and entries without finite percentages', () => {
    const entries = [great, null, { ...great, key: 'ok', businessPercentage: NaN }, { ...great, key: 'ok', marketPercentage: Infinity }]
    expect(usableSentiments(entries as unknown as BusinessSiteServicePricingSentiment[])).toEqual([great])
  })

  it('needs two buckets, or one with no fair-value stat to repeat it', () => {
    const fair = { businessPercentage: 88, marketPercentage: 74 }
    expect(showPerception(0, null)).toBe(false)
    expect(showPerception(1, null)).toBe(true)
    expect(showPerception(1, fair)).toBe(false)
    expect(showPerception(2, fair)).toBe(true)
  })
})

describe('pricingLede', () => {
  it('describes a single priced tier with its own range', () => {
    expect(ledeFor('Water heater', [{ name: 'Install', low: 1200, high: 2400 }])).toBe('Install usually costs $1,200 – $2,400.')
  })

  it('spans the lowest and highest price across fully priced tiers only', () => {
    const tiers = [{ name: 'A', low: 100, high: 200 }, { name: 'B', low: 300, high: 400 }, { name: 'Partial', low: 50 }, { name: 'None' }]
    expect(ledeFor('Water heater', tiers)).toBe(
      'Water heater jobs cost $100 to $400, depending on the work. Each job type is broken down below.',
    )
  })

  it('explains on-site pricing when nothing is priced, keeping acronyms', () => {
    expect(ledeFor('HVAC', [{ name: 'Repair' }])).toBe(
      'Every HVAC job is priced after the technician sees it. You get the price in writing before work starts.',
    )
    expect(ledeFor('Water Heater', [{ name: 'Repair' }])).toContain('Every water heater job')
  })
})
