const FONT_PRESETS: Record<string, string> = {
  archivo: '"Archivo", Arial, sans-serif',
  'plex-sans': '"IBM Plex Sans", Arial, sans-serif',
  system: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
}

export function safeFont(value: unknown): string {
  if (typeof value !== 'string') return FONT_PRESETS['plex-sans']!
  const name = value.trim()
  if (Object.prototype.hasOwnProperty.call(FONT_PRESETS, name)) return FONT_PRESETS[name]!
  if (!/^[\p{L}\p{N}][\p{L}\p{N} _.-]{0,79}$/u.test(name)) return FONT_PRESETS['plex-sans']!
  if (name === 'system-ui' || name === 'sans-serif' || name === 'monospace') return name
  return `"${name}", Arial, sans-serif`
}

function rgbHex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

export function safeColor(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const color = value.trim()
  if (/^#[0-9a-f]{6}$/i.test(color)) return color
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return `#${[...color.slice(1)].map((digit) => digit + digit).join('')}`
  }

  const rgb = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*1(?:\.0+)?)?\s*\)$/i.exec(color)
  if (rgb) {
    const channels = rgb.slice(1, 4).map(Number)
    return channels.every((channel) => channel <= 255)
      ? rgbHex(channels[0]!, channels[1]!, channels[2]!)
      : fallback
  }

  const hsl = /^hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%(?:\s*,\s*1(?:\.0+)?)?\s*\)$/i.exec(color)
  if (!hsl) return fallback
  const hue = Number(hsl[1])
  const saturation = Number(hsl[2]) / 100
  const lightness = Number(hsl[3]) / 100
  if (hue > 360 || saturation > 1 || lightness > 1) return fallback

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const secondary = chroma * (1 - Math.abs((hue / 60) % 2 - 1))
  const offset = lightness - chroma / 2
  const channels = hue < 60 ? [chroma, secondary, 0]
    : hue < 120 ? [secondary, chroma, 0]
      : hue < 180 ? [0, chroma, secondary]
        : hue < 240 ? [0, secondary, chroma]
          : hue < 300 ? [secondary, 0, chroma]
            : [chroma, 0, secondary]
  return rgbHex(
    Math.round((channels[0]! + offset) * 255),
    Math.round((channels[1]! + offset) * 255),
    Math.round((channels[2]! + offset) * 255),
  )
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((index) => {
    const value = Number.parseInt(hex.slice(index, index + 2), 16) / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722
}

function contrast(a: string, b: string): number {
  const light = Math.max(luminance(a), luminance(b))
  const dark = Math.min(luminance(a), luminance(b))
  return (light + 0.05) / (dark + 0.05)
}

export function readableText(preferred: string, background: string): string {
  if (contrast(preferred, background) >= 4.5) return preferred
  return contrast('#000000', background) >= contrast('#ffffff', background)
    ? '#000000'
    : '#ffffff'
}
