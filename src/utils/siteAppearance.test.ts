import { describe, expect, it } from 'vitest'
import { safeFont } from './siteAppearance'

describe('business site font families', () => {
  it.each(['cursive', 'fantasy', 'system-ui', 'sans-serif', 'monospace',
    'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'math', 'emoji', 'fangsong'])(
    'leaves the generic family %s unquoted', (family) => {
      expect(safeFont(family)).toBe(family)
    },
  )

  it('normalizes casing and whitespace for generic families', () => {
    expect(safeFont(' CURSIVE ')).toBe('cursive')
    expect(safeFont('Fantasy')).toBe('fantasy')
  })

  it.each(['Nunito Sans', 'Open Sans', 'Georgia', 'Noto Sans Devanagari'])(
    'keeps named fonts quoted with safe fallbacks: %s', (family) => {
      expect(safeFont(` ${family} `)).toBe(`"${family}", Arial, sans-serif`)
    },
  )

  it('preserves existing named font presets', () => {
    expect(safeFont('archivo')).toBe('"Archivo", Arial, sans-serif')
    expect(safeFont('plex-sans')).toBe('"IBM Plex Sans", Arial, sans-serif')
    expect(safeFont('system')).toBe('system-ui, -apple-system, "Segoe UI", sans-serif')
    expect(safeFont('serif')).toBe('Georgia, "Times New Roman", serif')
  })

  it.each([undefined, null, 42, '', ' ', 'Arial, cursive', 'font";color:red', 'url(https://example.com)', 'x'.repeat(81)])(
    'rejects invalid font names without introducing arbitrary CSS: %j', (family) => {
      expect(safeFont(family)).toBe('"IBM Plex Sans", Arial, sans-serif')
    },
  )
})
