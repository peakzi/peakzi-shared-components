import { describe, expect, it } from 'vitest'
import { reviewTextParts } from './highlight-review'

describe('reviewTextParts', () => {
  it('matches case-insensitively while keeping the original words and repeated occurrences', () => {
    const parts = reviewTextParts('Great service. GREAT service!', ['great service'])
    expect(parts.filter((part) => part.highlighted).map((part) => part.text)).toEqual(['Great service', 'GREAT service'])
    expect(parts.map((part) => part.text).join('')).toBe('Great service. GREAT service!')
  })

  it('treats regex metacharacters as literal text', () => {
    const text = 'We paid $100 (including parts). A+B [test] .*'
    const parts = reviewTextParts(text, ['$100 (including parts)', 'A+B [test]', '.*'])
    expect(parts.filter((part) => part.highlighted).map((part) => part.text)).toEqual(['$100 (including parts)', 'A+B [test]', '.*'])
    expect(parts.map((part) => part.text).join('')).toBe(text)
  })

  it('prefers the longer overlapping phrase without duplicating text or nesting marks', () => {
    expect(reviewTextParts('Great service.', ['Great', 'Great service', 'service', 'Great service']))
      .toEqual([{ text: 'Great service', highlighted: true }, { text: '.', highlighted: false }])
  })

  it('preserves Unicode text and offsets when case-folding could change string length', () => {
    const text = 'İstanbul — GREAT SERVICE, café.'
    const parts = reviewTextParts(text, ['great service', 'café'])
    expect(parts.filter((part) => part.highlighted).map((part) => part.text)).toEqual(['GREAT SERVICE', 'café'])
    expect(parts.map((part) => part.text).join('')).toBe(text)
  })

  it.each([undefined, [], [' ', ''], ['not in the text']])('does not invent highlights when there is no match: %j', (phrases) => {
    expect(reviewTextParts('Original copy.', phrases)).toEqual([{ text: 'Original copy.', highlighted: false }])
  })

  it('highlights adjacent phrases without adding spaces', () => {
    const parts = reviewTextParts('AB', ['A', 'B'])
    expect(parts).toEqual([{ text: 'A', highlighted: true }, { text: 'B', highlighted: true }])
  })
})
