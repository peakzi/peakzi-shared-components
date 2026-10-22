import { describe, expect, it } from 'vitest'
import { factorAmount, hasAmount, isNegativeFactor } from './factors'

describe('hasAmount', () => {
  it('needs at least one finite number', () => {
    expect(hasAmount({ label: 'A', percent: -10 })).toBe(true)
    expect(hasAmount({ label: 'A', low: 5 })).toBe(true)
    expect(hasAmount({ label: 'A', high: 5 })).toBe(true)
    expect(hasAmount({ label: 'A' })).toBe(false)
    expect(hasAmount({ label: 'A', percent: NaN, low: Infinity })).toBe(false)
  })
})

describe('isNegativeFactor', () => {
  it('reads the sign from percent first, then the first dollar bound', () => {
    expect(isNegativeFactor({ label: 'A', percent: -10, low: 50 })).toBe(true)
    expect(isNegativeFactor({ label: 'A', percent: 10, low: -50 })).toBe(false)
    expect(isNegativeFactor({ label: 'A', low: -40, high: -60 })).toBe(true)
    expect(isNegativeFactor({ label: 'A', high: -60 })).toBe(true)
    expect(isNegativeFactor({ label: 'A', percent: NaN, low: -5 })).toBe(true)
  })
})

describe('factorAmount', () => {
  it.each([
    [{ label: 'A', low: -40, high: -60 }, '−$40 to $60'],
    [{ label: 'A', low: 120, high: 200 }, '+$120 to $200'],
    [{ label: 'A', low: -300, high: -300 }, '−$300'],
    [{ label: 'A', low: 60 }, '+$60'],
    [{ label: 'A', high: 50 }, '+$50'],
    [{ label: 'A', percent: -12.34 }, '−12.3%'],
    [{ label: 'A', percent: 7.25 }, '+7.3%'],
    [{ label: 'A', percent: -10, low: 50, high: 80 }, '−10%'],
  ])('formats %j as %s', (factor, expected) => expect(factorAmount(factor)).toBe(expected))
})
