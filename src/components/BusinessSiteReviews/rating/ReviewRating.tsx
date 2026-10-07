import { Star } from 'lucide-react'
import { validReviewRating } from '../helpers/reviews'

interface ReviewRatingProps {
  value: number | null | undefined
  showValue?: boolean
}

export function ReviewRating({ value, showValue = false }: ReviewRatingProps) {
  if (!validReviewRating(value)) return null
  return (
    <span className="pz-business-reviews__rating" role="img" aria-label={`${value} out of 5 stars`}>
      {showValue && <span className="pz-business-reviews__rating-value" aria-hidden="true">{value.toFixed(1)}</span>}
      <span className="pz-business-reviews__stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span className="pz-business-reviews__star" key={index}>
            <Star className="pz-business-reviews__star-outline" size={16} aria-hidden="true" />
            <span className="pz-business-reviews__star-fill" style={{ width: `${Math.min(1, Math.max(0, value - index)) * 100}%` }}>
              <Star size={16} fill="currentColor" aria-hidden="true" />
            </span>
          </span>
        ))}
      </span>
    </span>
  )
}
