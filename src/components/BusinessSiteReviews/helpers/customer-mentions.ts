import type { BusinessSiteReview } from './types'

export function customerMentions(items: readonly BusinessSiteReview[], mentionCounts?: Readonly<Record<string, number>>) {
  if (mentionCounts !== undefined) {
    return Object.entries(mentionCounts)
      .filter(([label, count]) => label.trim() && Number.isSafeInteger(count) && count > 0)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
  }
  const mentions = new Map<string, { label: string; count: number }>()
  for (const item of items) {
    const seen = new Set<string>()
    for (const tag of item.tags ?? []) {
      const label = tag.trim().replace(/\s+/g, ' ')
      const key = label.toLowerCase()
      if (!key || seen.has(key)) continue
      seen.add(key)
      const mention = mentions.get(key)
      if (mention) mention.count += 1
      else mentions.set(key, { label, count: 1 })
    }
  }
  // Counts describe these displayed reviews, not the overall API review total.
  return [...mentions.values()].sort((a, b) => b.count - a.count).slice(0, 5)
}
