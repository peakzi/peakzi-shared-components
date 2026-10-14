import { describe, expect, it } from 'vitest'
import { trustSignalIcon } from './trust-icon'

describe('trustSignalIcon', () => {
  it('maps each kind to its icon', () => {
    expect(trustSignalIcon('financing')).toBe('dollar-sign')
    expect(trustSignalIcon('guarantee')).toBe('shield-check')
    expect(trustSignalIcon('warranty')).toBe('shield-check')
    expect(trustSignalIcon('license')).toBe('badge-check')
    expect(trustSignalIcon('certification')).toBe('award')
    expect(trustSignalIcon('availability')).toBe('clock')
    expect(trustSignalIcon('estimate')).toBe('clipboard-check')
    expect(trustSignalIcon('offer')).toBe('tag')
  })

  it('falls back to check for missing or unknown kinds', () => {
    expect(trustSignalIcon(undefined)).toBe('check')
    expect(trustSignalIcon('loyalty')).toBe('check')
    expect(trustSignalIcon('toString')).toBe('check')
  })
})
