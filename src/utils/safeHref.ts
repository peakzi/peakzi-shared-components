export function safeHref(value: unknown, image = false): string | null {
  if (typeof value !== 'string') return null
  const href = value.trim()
  if (!href) return null
  if (href.includes('\\') || Array.from(href).some((character) => {
    const code = character.charCodeAt(0)
    return code < 32 || code === 127
  })) return null
  if (href.startsWith('/') && !href.startsWith('//')) return href
  if (!image && (/^#[a-z0-9_-]+$/i.test(href) || href.startsWith('?'))) return href
  try {
    const protocol = new URL(href).protocol
    if (protocol === 'https:' || protocol === 'http:') return href
    if (!image && (protocol === 'tel:' || protocol === 'mailto:')) return href
  } catch {
    return null
  }
  return null
}
