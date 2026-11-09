import type { BusinessSiteReview } from '../helpers/types'
import { ReviewRating } from '../rating/ReviewRating'
import { BusinessSiteReviewDetails } from '../review-text/BusinessSiteReviewDetails'
import { ReviewAttribution } from './ReviewAttribution'

interface ReviewProps {
  item: BusinessSiteReview
  featured?: boolean
}

export function Review({ item, featured = false }: ReviewProps) {
  return (
    <figure className={`pz-business-reviews__review${featured ? ' pz-business-reviews__featured' : ''}`}>
      <ReviewRating value={item.rating} />
      <BusinessSiteReviewDetails item={item} featured={featured} />
      <ReviewAttribution item={item} featured={featured} />
    </figure>
  )
}
