/** Keep the existing 160-character card and 320-character featured-review caps. */
export function reviewPreview(text: string, featured = false): string | undefined {
  const characters = Array.from(text)
  const limit = featured ? 320 : 160
  return characters.length > limit
    ? characters.slice(0, limit).join('').replace(/\s+\S*$/u, '').trimEnd()
    : undefined
}
