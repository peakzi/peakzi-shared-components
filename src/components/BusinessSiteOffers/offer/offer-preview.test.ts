import { describe, expect, it } from 'vitest'
import { offerPreview } from './offer-preview'

describe('offerPreview', () => {
  it('normalizes whitespace without shortening a short description', () => {
    expect(offerPreview('  Save\n  on repairs. ')).toEqual({ description: 'Save on repairs.', shortened: false })
    expect(offerPreview()).toEqual({ description: '', shortened: false })
  })
  it('shortens long descriptions at a word boundary and keeps the full source unchanged', () => {
    const original = 'A complete maintenance membership with priority scheduling. '.repeat(8)
    const result = offerPreview(original)
    expect(result.shortened).toBe(true)
    expect(result.description.length).toBeLessThanOrEqual(181)
    expect(result.description.endsWith('…')).toBe(true)
    expect(original.length).toBeGreaterThan(181)
  })
  it('bounds long unbroken text', () => {
    expect(offerPreview('a'.repeat(200))).toEqual({ description: `${'a'.repeat(180)}…`, shortened: true })
  })
})
