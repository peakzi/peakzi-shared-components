import { useRef } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useChartTheme } from './useChartTheme'
import { isThemeMutation, pruneUndefined, toPx } from '../../internal/chartTheme'

const root = document.documentElement

afterEach(() => {
  root.style.removeProperty('--fg-1')
  root.style.removeProperty('--peakzi-purple')
  root.removeAttribute('data-theme')
  root.removeAttribute('class')
})

describe('useChartTheme', () => {
  it('returns undefined for tokens that do not resolve, instead of hardcoded fallbacks', () => {
    const { result } = renderHook(() => useChartTheme(useRef(null)))
    expect(result.current.textPrimary).toBeUndefined()
    expect(result.current.primary).toBeUndefined()
  })

  it('reads resolved token values', () => {
    root.style.setProperty('--fg-1', '#1f1e5a')
    const { result } = renderHook(() => useChartTheme(useRef(null)))
    expect(result.current.textPrimary).toBe('#1f1e5a')
  })

  it('re-reads tokens when data-theme changes, without the caller re-rendering', async () => {
    root.style.setProperty('--fg-1', '#1f1e5a')
    const { result } = renderHook(() => useChartTheme(useRef(null)))

    root.style.setProperty('--fg-1', '#ffffff')
    root.setAttribute('data-theme', 'dark')

    await waitFor(() => expect(result.current.textPrimary).toBe('#ffffff'))
  })
})

describe('theme mutation filter', () => {
  const nextFrames = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

  it('ignores class changes that do not add or remove a theme class', async () => {
    root.style.setProperty('--fg-1', '#1f1e5a')
    const { result } = renderHook(() => useChartTheme(useRef(null)))

    root.style.setProperty('--fg-1', '#ffffff')
    root.classList.add('some-unrelated-ui-state')
    await nextFrames()
    expect(result.current.textPrimary).toBe('#1f1e5a')

    root.classList.add('peakzi-dark')
    await waitFor(() => expect(result.current.textPrimary).toBe('#ffffff'))
  })

  it('classifies mutation records', () => {
    const el = document.createElement('div')
    const record = (attributeName: string, oldValue: string | null) => ({ attributeName, oldValue, target: el }) as unknown as MutationRecord

    el.className = 'card is-hovered'
    expect(isThemeMutation(record('class', 'card'))).toBe(false)
    el.className = 'card peakzi-dark'
    expect(isThemeMutation(record('class', 'card'))).toBe(true)
    expect(isThemeMutation(record('class', 'peakzi-dark card is-open'))).toBe(false)

    el.setAttribute('data-theme', 'dark')
    expect(isThemeMutation(record('data-theme', 'light'))).toBe(true)
    expect(isThemeMutation(record('data-theme', 'dark'))).toBe(false)
  })
})

describe('pruneUndefined', () => {
  it('removes undefined leaves at any depth but keeps functions, arrays and falsy values', () => {
    const formatter = () => 'x'
    const pruned = pruneUndefined<Record<string, unknown>>({
      a: undefined,
      b: { c: undefined, d: 0, e: '' },
      f: [{ g: undefined, h: null }],
      formatter,
    })
    expect(pruned).toEqual({ b: { d: 0, e: '' }, f: [{ h: null }], formatter })
  })
})

describe('toPx', () => {
  it('parses px token values and returns undefined for missing ones', () => {
    expect(toPx('6px')).toBe(6)
    expect(toPx(undefined)).toBeUndefined()
  })
})
