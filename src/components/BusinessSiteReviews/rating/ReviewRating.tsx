import { Star } from 'lucide-react'
import { useId } from 'react'
import { validReviewRating } from '../helpers/reviews'

interface ReviewRatingProps {
  value: number | null | undefined
  showValue?: boolean
}

export function ReviewRating({ value, showValue = false }: ReviewRatingProps) {
  const gradientId = `${useId()}-review-stars`
  if (!validReviewRating(value)) return null
  const paint = showValue ? 'currentColor' : `url(#${gradientId})`
  return (
    <span className="pz-business-reviews__rating" role="img" aria-label={`${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)} out of 5 stars`}>
      {!showValue && <svg className="pz-business-reviews__gradient-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--pz-business-reviews-gradient-start)" />
            <stop offset="100%" stopColor="var(--pz-business-reviews-gradient-end)" />
          </linearGradient>
        </defs>
      </svg>}
      {showValue && <span className="pz-business-reviews__rating-value" aria-hidden="true">{value.toFixed(1)}</span>}
      <span className="pz-business-reviews__stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span className="pz-business-reviews__star" key={index}>
            <Star className="pz-business-reviews__star-outline" size={16} stroke={paint} aria-hidden="true" />
            <span className="pz-business-reviews__star-fill" style={{ width: `${Math.min(1, Math.max(0, value - index)) * 100}%` }}>
              <Star size={16} fill={paint} stroke={paint} aria-hidden="true" />
            </span>
          </span>
        ))}
      </span>
    </span>
  )
}
