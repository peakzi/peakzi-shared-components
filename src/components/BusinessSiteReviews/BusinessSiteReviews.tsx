import { useId } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { safeHref } from '../../utils/safeHref'
import { reviewsStyle } from './helpers/appearance'
import { uniqueReviews, validReviewRating } from './helpers/reviews'
import type { BusinessSiteReviewsProps } from './helpers/types'
import { ReviewRating } from './rating/ReviewRating'
import { Review } from './review/Review'

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
  const [featured, ...remaining] = uniqueReviews(items)
  if (!featured) return null

  const count = summary?.reviewCount
  const validCount = typeof count === 'number' && Number.isSafeInteger(count) && count >= 0
  const href = viewAll?.label.trim() ? safeHref(viewAll.href) : null
  const newTab = viewAll?.newTab === true && !!href && /^https?:\/\//i.test(href)

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
        <div className="pz-business-reviews__header">
          <div>
            {eyebrow.trim() && <p className="pz-business-reviews__eyebrow">{eyebrow}</p>}
            <h2 id={headingId}>{title.trim() || 'What our customers say'}</h2>
          </div>
          {(validReviewRating(summary?.rating) || validCount) && (
            <div className="pz-business-reviews__summary">
              <ReviewRating value={summary?.rating} showValue />
              {validCount && <span>{count.toLocaleString('en-US')} {summary?.label?.trim() || (count === 1 ? 'review' : 'reviews')}</span>}
            </div>
          )}
        </div>
        <div className="pz-business-reviews__layout" data-single={remaining.length === 0 ? 'true' : 'false'}>
          <Review item={featured} featured={appearance.density !== 'compact'} />
          {remaining.length > 0 && (
            <ul className="pz-business-reviews__list" role="list">
              {remaining.map((item) => <li key={item.id}><Review item={item} /></li>)}
            </ul>
          )}
        </div>
        {href && (
          <a className="pz-business-reviews__view-all" href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}>
            {viewAll?.label}<ArrowUpRight size={18} aria-hidden="true" />
          </a>
        )}
      </div>
    </section>
  )
}

BusinessSiteReviews.displayName = 'BusinessSiteReviews'
