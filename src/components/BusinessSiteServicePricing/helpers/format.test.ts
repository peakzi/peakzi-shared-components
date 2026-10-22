import { describe, expect, it } from 'vitest'
import { hasNumber, lowercaseWords, money, percent, range } from './format'

describe('hasNumber', () => {
  it.each([[0], [-5], [12.5]])('accepts %s', (value) => expect(hasNumber(value)).toBe(true))
  it.each([[NaN], [Infinity], [-Infinity], [null], [undefined]])('rejects %s', (value) => expect(hasNumber(value)).toBe(false))
})

describe('money', () => {
  it('rounds to whole dollars and groups thousands', () => {
    expect(money(1234.56)).toBe('$1,235')
    expect(money(0)).toBe('$0')
    expect(money(1234567)).toBe('$1,234,567')
  })

  it('never prints a sign', () => {
    expect(money(-40)).toBe('$40')
  })
})

describe('range', () => {
  it('collapses equal bounds to one price', () => {
    expect(range(500, 500)).toBe('$500')
    expect(range(180, 450)).toBe('$180 – $450')
  })
})

describe('percent', () => {
  it.each([
    [12, '12%'], [12.34, '12.3%'], [12.56, '12.6%'], [7.25, '7.3%'], [0.04, '0%'], [-0.04, '0%'],
  ])('formats %s as %s', (value, expected) => expect(percent(value)).toBe(expected))
})

describe('lowercaseWords', () => {
  it.each([
    ['Water Heater', 'water heater'],
    ['Sewer line', 'sewer line'],
    ['HVAC', 'HVAC'],
    ['AC repair', 'AC repair'],
    ['24/7 Plumbing', '24/7 plumbing'],
    ['A', 'a'],
  ])('turns "%s" into "%s"', (label, expected) => expect(lowercaseWords(label)).toBe(expected))
})
