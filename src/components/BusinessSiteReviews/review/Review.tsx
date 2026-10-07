import { reviewDate, validReviewRating } from '../helpers/reviews'
import type { BusinessSiteReview } from '../helpers/types'
import { ReviewRating } from '../rating/ReviewRating'

interface ReviewProps {
  item: BusinessSiteReview
  featured?: boolean
}

export function Review({ item, featured = false }: ReviewProps) {
  const name = item.reviewerName?.trim()
  const date = reviewDate(item.reviewDate)
  return (
    <figure className={`pz-business-reviews__review${featured ? ' pz-business-reviews__featured' : ''}`}>
      {featured && <span className="pz-business-reviews__quote-mark" aria-hidden="true">“</span>}
      {!featured && <ReviewRating value={item.rating} />}
      <blockquote>{item.text}</blockquote>
      {(name || date || (featured && validReviewRating(item.rating))) && <figcaption>
        {featured && name && <span className="pz-business-reviews__avatar" aria-hidden="true">{Array.from(name)[0]?.toUpperCase()}</span>}
        <div className="pz-business-reviews__attribution">
          {name && <span className="pz-business-reviews__name">{name}</span>}
          <div className="pz-business-reviews__meta">
            {date && <time dateTime={date.dateTime}>{date.label}</time>}
            {featured && <ReviewRating value={item.rating} />}
          </div>
        </div>
      </figcaption>}
    </figure>
  )
}
