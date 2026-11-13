import { reviewDate } from '../helpers/reviews'
import type { BusinessSiteReview } from '../helpers/types'

export interface ReviewAttributionProps {
  item: BusinessSiteReview
  featured?: boolean
}

export function ReviewAttribution({ item, featured = false }: ReviewAttributionProps) {
  const name = item.reviewerName?.trim()
  const date = reviewDate(item.reviewDate)
  if (!name && !date) return null
  return <figcaption>
    {featured && name && <span className="pz-business-reviews__avatar" aria-hidden="true">{Array.from(name)[0]?.toUpperCase()}</span>}
    <div className="pz-business-reviews__attribution">
      {name && <span className="pz-business-reviews__name">{name}</span>}
      <div className="pz-business-reviews__meta">
        {date && <time dateTime={date.dateTime}>{date.label}</time>}
      </div>
    </div>
  </figcaption>
}
