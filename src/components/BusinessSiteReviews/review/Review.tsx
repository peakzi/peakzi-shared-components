import { reviewDate } from '../helpers/reviews'
import type { BusinessSiteReview } from '../helpers/types'
import { ReviewRating } from '../rating/ReviewRating'
import { ReviewText } from '../review-text/ReviewText'

interface ReviewProps {
  item: BusinessSiteReview
  featured?: boolean
}

export function Review({ item, featured = false }: ReviewProps) {
  const name = item.reviewerName?.trim()
  const date = reviewDate(item.reviewDate)
  return (
    <figure className={`pz-business-reviews__review${featured ? ' pz-business-reviews__featured' : ''}`}>
      <ReviewRating value={item.rating} />
      <ReviewText text={item.text} highlightedPhrases={item.highlightedPhrases ?? []} featured={featured} />
      {(name || date) && <figcaption>
        {featured && name && <span className="pz-business-reviews__avatar" aria-hidden="true">{Array.from(name)[0]?.toUpperCase()}</span>}
        <div className="pz-business-reviews__attribution">
          {name && <span className="pz-business-reviews__name">{name}</span>}
          <div className="pz-business-reviews__meta">
            {date && <time dateTime={date.dateTime}>{date.label}</time>}
          </div>
        </div>
      </figcaption>}
    </figure>
  )
}
