export function reviewTextParts(text: string, phrases: readonly string[] = []) {
  const literals = [...new Set(phrases.map((phrase) => phrase.trim()).filter(Boolean))]
    .sort((a, b) => b.length - a.length)
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!literals.length) return [{ text, highlighted: false }]

  const parts: { text: string; highlighted: boolean }[] = []
  let offset = 0
  for (const match of text.matchAll(new RegExp(literals.join('|'), 'giu'))) {
    const start = match.index
    if (start > offset) parts.push({ text: text.slice(offset, start), highlighted: false })
    parts.push({ text: match[0], highlighted: true })
    offset = start + match[0].length
  }
  if (offset < text.length) parts.push({ text: text.slice(offset), highlighted: false })
  return parts
}
