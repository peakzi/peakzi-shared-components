import { describe, expect, it } from 'vitest'
import { servicePricing } from './pricing'

describe('servicePricing', () => {
  it('orders standard columns and maps Replace/Install to Install without rewriting prices', () => {
    const result = servicePricing([{ id: 'water', title: 'Water heater', tiers: [
      { label: 'Maintain', value: '$89 - $189' }, { label: 'Replace/Install', value: '$1,200 - $4,500' }, { label: 'Repair', value: '$300 - $550' },
    ] }])
    expect(result.hasPrices).toBe(true)
    expect(result.columns.map((column) => column.label)).toEqual(['Repair', 'Install', 'Maintain'])
    expect(result.rows[0]!.prices.get('install')).toEqual(['$1,200 - $4,500'])
  })
  it('uses a grid for missing or blank price data', () => {
    expect(servicePricing([{ id: 'empty', title: 'Empty' }, { id: 'blank', title: 'Blank', tiers: [{ label: 'Repair', value: ' ' }, { label: '', value: '$100' }] }]).hasPrices).toBe(false)
    expect(servicePricing([]).hasPrices).toBe(false)
  })
  it('preserves service order and retains rows with no prices in a partly priced trade', () => {
    const result = servicePricing([{ id: 'one', title: 'One', tiers: [{ label: 'Repair', value: '$100' }] }, { id: 'two', title: 'Two' }])
    expect(result.rows.map((row) => row.service.id)).toEqual(['one', 'two'])
    expect(result.rows[1]!.prices.size).toBe(0)
  })
  it('keeps explicitly supplied zero prices rather than treating them as missing', () => {
    expect(servicePricing([{ id: 'free', title: 'Free inspection', tiers: [{ label: 'Maintain', value: '$0' }] }]).rows[0]!.prices.get('maintain')).toEqual(['$0'])
  })
  it('supports case and spacing variations and does not lose duplicate alias values', () => {
    const result = servicePricing([{ id: 'one', title: 'One', tiers: [
      { label: ' replace / install ', value: ' $100 ' }, { label: 'Replacement', value: '$200' }, { label: 'MAINTENANCE', value: '$30' },
    ] }])
    expect(result.rows[0]!.prices.get('install')).toEqual(['$100', '$200'])
    expect(result.rows[0]!.prices.get('maintain')).toEqual(['$30'])
  })
  it('retains additional action prices under their own column instead of silently dropping them', () => {
    const result = servicePricing([{ id: 'one', title: 'One', tiers: [{ label: 'Inspection', value: '$75' }] }])
    expect(result.columns[3]).toEqual({ id: 'custom:inspection', label: 'Inspection' })
    expect(result.rows[0]!.prices.get('custom:inspection')).toEqual(['$75'])
  })
})
