import { useId } from 'react'
import { reviewsStyle } from './helpers/appearance'
import { uniqueReviews } from './helpers/reviews'
import type { BusinessSiteReviewsProps } from './helpers/types'
import { Review } from './review/Review'
import { ReviewsSummary } from './summary/ReviewsSummary'

export function BusinessSiteReviews({
  items,
  title = 'What our customers say',
  eyebrow = 'Reviews',
  summary,
  viewAll,
  appearance = {},
  sectionId,
  className,
}: BusinessSiteReviewsProps) {
  const headingId = `${useId()}-heading`
  const reviews = uniqueReviews(items)
  if (!reviews.length) return null

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={['pz-business-reviews', className].filter(Boolean).join(' ')}
      data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'}
      data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'}
      style={reviewsStyle(appearance)}
    >
      <div className="pz-business-reviews__inner">
        <ReviewsSummary headingId={headingId} title={title} eyebrow={eyebrow} items={reviews} summary={summary} viewAll={viewAll} />
        <ul className="pz-business-reviews__list" role="list" aria-label="Customer reviews" data-single={reviews.length === 1 ? 'true' : 'false'}>
          {reviews.map((item, index) => <li key={item.id}>
            <Review item={item} featured={index === 0 && appearance.density !== 'compact'} />
          </li>)}
        </ul>
      </div>
    </section>
  )
}

BusinessSiteReviews.displayName = 'BusinessSiteReviews'
