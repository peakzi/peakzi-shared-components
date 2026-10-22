/** Design-system icon names that differ from Lucide. Everything else passes through unchanged. */
const ALIASES: Record<string, string> = {
  bolt: 'zap',
  home: 'house',
  dollar: 'dollar-sign',
  pin: 'map-pin',
}

/** Returns '' when no icon was sent. There is no fallback icon. */
export function showcaseIcon(name: unknown): string {
  const value = typeof name === 'string' ? name.trim() : ''
  if (!value) return ''
  return ALIASES[value.toLowerCase()] ?? value
}
