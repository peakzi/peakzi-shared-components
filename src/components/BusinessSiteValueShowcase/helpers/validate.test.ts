import { describe, expect, it } from 'vitest'
import { showcaseIcon } from './icons'
import { fillLabel, sealScale, validShowcase } from './validate'

describe('validShowcase', () => {
  it('keeps every string exactly as sent, only trimming whitespace', () => {
    const data = validShowcase({ title: '  A  title ', items: [{ name: 'AC repair', standing: 'Out of 213 businesses', proof: '558 DFW reviews' }] })
    expect(data.title).toBe('A title')
    expect(data.items[0]).toMatchObject({ standing: 'Out of 213 businesses', proof: '558 DFW reviews' })
  })

  it('drops items with no name, or with neither standing nor proof', () => {
    const data = validShowcase({ title: 't', items: [{ name: ' ', standing: 'x' }, { name: 'Only name' }, { name: 'Standing only', standing: 'In top 6%' }, { name: 'Proof only', proof: 'Measured across DFW' }] })
    expect(data.items.map((item) => item.name)).toEqual(['Standing only', 'Proof only'])
  })

  it('dedupes by id and generates ids when missing', () => {
    const data = validShowcase({ title: 't', items: [{ id: 'a', name: 'One', proof: 'p' }, { id: 'a', name: 'Two', proof: 'p' }, { name: 'Three', proof: 'p' }] })
    expect(data.items.map((item) => item.id)).toEqual(['a', 'item-2'])
  })

  it('dedupes highlights and drops empty titles', () => {
    const data = validShowcase({ title: 't', highlights: [{ title: 'Award' }, { title: 'award ' }, { title: '' }, { title: 'Award', detail: '2025' }] })
    expect(data.highlights.map((entry) => entry.title + (entry.detail ? ` ${entry.detail}` : ''))).toEqual(['Award', 'Award 2025'])
  })

  it('treats empty seal text as no seal and shows stars or an icon only when sent', () => {
    expect(validShowcase({ title: 't', seal: { text: ' ' } }).seal).toBeNull()
    expect(validShowcase({ title: 't', seal: { text: 'Most reviewed' } }).seal).toMatchObject({ stars: false, iconName: '' })
    expect(validShowcase({ title: 't', seal: { text: 'x', iconName: 'award', stars: true } }).seal).toMatchObject({ stars: true, iconName: 'award' })
    expect(validShowcase({ title: 't', seal: { text: 'x', stars: false } }).seal?.stars).toBe(false)
  })

  it('adds no default copy or icons', () => {
    const data = validShowcase({ title: 't', highlights: [{ title: 'A' }], items: [{ name: 'B', proof: 'p' }] })
    expect(data.highlightsLabel).toBe('')
    expect(data.itemsLabel).toBe('')
    expect(data.highlights[0]!.iconName).toBe('')
    expect(data.items[0]!.iconName).toBe('')
  })

  it('reads the mobile visible count and button labels, with safe defaults', () => {
    const none = validShowcase({ title: 't' })
    expect(none).toMatchObject({ mobileVisibleItems: 3, showMoreLabel: 'Show {count} more', showLessLabel: 'Show fewer' })
    expect(validShowcase({ title: 't', mobileVisibleItems: 0 }).mobileVisibleItems).toBe(1)
    expect(validShowcase({ title: 't', mobileVisibleItems: 2.7 }).mobileVisibleItems).toBe(2)
    expect(validShowcase({ title: 't', mobileVisibleItems: Number.NaN }).mobileVisibleItems).toBe(3)
    expect(validShowcase({ title: 't', showMoreLabel: ' See all ', showLessLabel: ' ' })).toMatchObject({ showMoreLabel: 'See all', showLessLabel: 'Show fewer' })
  })

  it('defaults heading level to 2 and accepts 3', () => {
    expect(validShowcase({ title: 't' }).level).toBe(2)
    expect(validShowcase({ title: 't', headingLevel: 3 }).level).toBe(3)
  })
})

describe('sealScale', () => {
  it('is 1 for short text and never below 0.8', () => {
    expect(sealScale('Top pro')).toBe(1)
    expect(sealScale('One of Baltimore’s top-hired home service pros')).toBe(0.8)
    const mid = sealScale('One of DFW’s most-reviewed pros')
    expect(mid).toBeGreaterThan(0.8)
    expect(mid).toBeLessThan(1)
  })
})

describe('fillLabel', () => {
  it('fills {total} and {count}, and leaves other text alone', () => {
    expect(fillLabel('View all {total}', 6, 3)).toBe('View all 6')
    expect(fillLabel('Show {count} more of {total}', 6, 3)).toBe('Show 3 more of 6')
    expect(fillLabel('Show fewer', 6, 3)).toBe('Show fewer')
  })
})

describe('showcaseIcon', () => {
  it('maps design-system names to Lucide and passes others through', () => {
    expect(showcaseIcon('bolt')).toBe('zap')
    expect(showcaseIcon('home')).toBe('house')
    expect(showcaseIcon('wrench')).toBe('wrench')
    expect(showcaseIcon(undefined)).toBe('')
    expect(showcaseIcon(' ')).toBe('')
  })
})
