import type { BusinessSiteReview } from './types'

export function validReviewRating(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 5
}

export function uniqueReviews(items: readonly BusinessSiteReview[]): BusinessSiteReview[] {
  const ids = new Set<string>()
  const content = new Set<string>()
  return items.filter((item) => {
    const text = item.text.trim()
    if (!text) return false
    const key = JSON.stringify([
      item.reviewerName?.trim().replace(/\s+/g, ' ').toLowerCase() ?? '',
      text.replace(/\s+/g, ' ').toLowerCase(),
    ])
    if (ids.has(item.id) || content.has(key)) return false
    ids.add(item.id)
    content.add(key)
    return true
  })
}

export function reviewDate(value: string | null | undefined): { dateTime: string; label: string } | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}(?:T.+)?$/.test(value) || !Number.isFinite(Date.parse(value))) return null
  const dateTime = value.slice(0, 10)
  const date = new Date(`${dateTime}T00:00:00Z`)
  if (date.toISOString().slice(0, 10) !== dateTime) return null
  return {
    dateTime,
    label: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date),
  }
}
