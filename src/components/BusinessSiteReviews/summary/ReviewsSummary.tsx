import { ArrowUpRight } from 'lucide-react'
import { safeHref } from '../../../utils/safeHref'
import { customerMentions } from '../helpers/customer-mentions'
import { validReviewRating } from '../helpers/reviews'
import type { BusinessSiteReview, BusinessSiteReviewsProps } from '../helpers/types'
import { ReviewRating } from '../rating/ReviewRating'

interface ReviewsSummaryProps {
  headingId: string
  title: string
  eyebrow: string
  items: readonly BusinessSiteReview[]
  summary: BusinessSiteReviewsProps['summary']
  viewAll: BusinessSiteReviewsProps['viewAll']
}

export function ReviewsSummary({ headingId, title, eyebrow, items, summary, viewAll }: ReviewsSummaryProps) {
  const count = summary?.reviewCount
  const validCount = typeof count === 'number' && Number.isSafeInteger(count) && count >= 0
  const mentions = customerMentions(items)
  const href = viewAll?.label.trim() ? safeHref(viewAll.href) : null
  const newTab = viewAll?.newTab === true && !!href && /^https?:\/\//i.test(href)

  return (
    <div className="pz-business-reviews__aside">
      <div className="pz-business-reviews__heading">
        {eyebrow.trim() && <p className="pz-business-reviews__eyebrow">{eyebrow}</p>}
        <h2 id={headingId}>{title.trim() || 'What our customers say'}</h2>
      </div>
      {(validReviewRating(summary?.rating) || validCount) && (
        <div className="pz-business-reviews__summary">
          <ReviewRating value={summary?.rating} showValue />
          {validCount && <p>{count.toLocaleString('en-US')} {summary?.label?.trim() || (count === 1 ? 'review' : 'reviews')}</p>}
        </div>
      )}
      {mentions.length > 0 && <div className="pz-business-reviews__mentions">
        <p className="pz-business-reviews__mentions-heading">Customers mention</p>
        <ul aria-label="Customer mentions" role="list">
          {mentions.map(({ label, count: mentionCount }) => <li key={label}>
            <span>{label}</span><span className="pz-business-reviews__mention-count">{mentionCount}</span>
          </li>)}
        </ul>
        <p className="pz-business-reviews__mentions-note">Based on the reviews shown here.</p>
      </div>}
      {href && <a className="pz-business-reviews__view-all" href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}>
        {viewAll?.label}<ArrowUpRight size={16} aria-hidden="true" />
      </a>}
    </div>
  )
}
