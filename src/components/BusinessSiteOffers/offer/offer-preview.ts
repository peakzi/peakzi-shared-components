/** Keep restrictions/redemption separate: only the description is shortened. */
export function offerPreview(description?: string) {
  const text = description?.trim().replace(/\s+/g, ' ') ?? ''
  if (text.length <= 180) return { description: text, shortened: false }
  const end = text.lastIndexOf(' ', 180)
  return { description: `${text.slice(0, end > 100 ? end : 180).trimEnd()}…`, shortened: true }
}
