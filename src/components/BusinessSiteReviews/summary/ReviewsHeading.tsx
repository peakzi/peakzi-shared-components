export interface ReviewsHeadingProps {
  headingId: string
  title: string
  eyebrow: string
}

export function ReviewsHeading({ headingId, title, eyebrow }: ReviewsHeadingProps) {
  return <>
    {eyebrow.trim() && <p className="pz-business-reviews__eyebrow">{eyebrow}</p>}
    <h2 id={headingId}>{title.trim() || 'What our customers say'}</h2>
  </>
}
