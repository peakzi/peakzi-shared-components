/** Shared by Business Site sections that show a 0–5 rating. Invalid values are omitted, never defaulted. */
export function validReviewRating(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 5
}
