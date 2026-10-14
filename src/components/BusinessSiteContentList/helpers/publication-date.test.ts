import { describe, expect, it } from 'vitest'
import { publicationDate } from './publication-date'

describe('publicationDate', () => {
  it('formats a valid ISO calendar date', () => {
    expect(publicationDate('2026-01-02')).toEqual({ dateTime: '2026-01-02', label: 'Jan 2, 2026' })
  })

  it('formats dates across different months correctly', () => {
    expect(publicationDate('2025-12-31')).toEqual({ dateTime: '2025-12-31', label: 'Dec 31, 2025' })
  })

  it('accepts a real leap day', () => {
    expect(publicationDate('2024-02-29')).toEqual({ dateTime: '2024-02-29', label: 'Feb 29, 2024' })
  })

  it('returns null for undefined', () => {
    expect(publicationDate(undefined)).toBeNull()
  })

  it('returns null for an empty string', () => {
    expect(publicationDate('')).toBeNull()
  })

  it.each([
    '01/02/2026',
    '2026-1-2',
    '2026/01/02',
    '2026-01-02T00:00:00Z',
    'not-a-date',
    '2026-01',
  ])('returns null for a non-ISO-shaped value %s', (value) => {
    expect(publicationDate(value)).toBeNull()
  })

  it('returns null for a calendar date that rolls over (Feb 30)', () => {
    expect(publicationDate('2026-02-30')).toBeNull()
  })

  it('returns null for a non-leap-year Feb 29', () => {
    expect(publicationDate('2023-02-29')).toBeNull()
  })

  it('returns null for an out-of-range month', () => {
    expect(publicationDate('2026-13-01')).toBeNull()
  })
})
