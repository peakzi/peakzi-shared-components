export function offerExpiry(value: string | undefined): { dateTime: string; label: string } | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}(?:T.+)?$/.test(value) || !Number.isFinite(Date.parse(value))) return null
  const dateTime = value.slice(0, 10)
  const date = new Date(`${dateTime}T00:00:00Z`)
  if (date.toISOString().slice(0, 10) !== dateTime) return null
  return {
    dateTime,
    label: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date),
  }
}
