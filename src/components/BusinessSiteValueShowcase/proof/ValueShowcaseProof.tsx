import { ArrowRight } from 'lucide-react'
import { businessSiteIcon } from '../../../utils/businessSiteIcon'
import type { ValidShowcase } from '../helpers/validate'

const format = (value: number) => value.toLocaleString('en-US')

export function ValueShowcaseProof({ data }: { data: ValidShowcase }) {
  if (!data.hasProof) return null
  const hasSummary = data.rating !== null || data.reviewCount !== null
  return (
    <div className="pz-business-value-showcase__proof">
      {hasSummary && <div className="pz-business-value-showcase__summary">
        {data.rating !== null && <span className="pz-business-value-showcase__rating" role="img" aria-label={`${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(data.rating)} out of 5 stars`}>
          <span className="pz-business-value-showcase__rating-value" aria-hidden="true">{data.rating.toFixed(1)}</span>
          <span className="pz-business-value-showcase__rating-scale" aria-hidden="true">out of 5</span>
        </span>}
        {(data.reviewCount !== null || data.position) && <div className="pz-business-value-showcase__summary-text">
          {data.reviewCount !== null && <p className="pz-business-value-showcase__count">{format(data.reviewCount)} {data.reviewLabel}</p>}
          {data.position && <p className="pz-business-value-showcase__position">{data.position}</p>}
        </div>}
      </div>}
      {data.praise.length > 0 && <ul className="pz-business-value-showcase__praise" role="list" data-count={data.praise.length}>
        {data.praise.map((entry) => <li key={entry.text}>
          <span className="pz-business-value-showcase__praise-count">{format(entry.count)}</span>
          <span>{entry.text}</span>
        </li>)}
      </ul>}
      {data.actions.length > 0 && <div className="pz-business-value-showcase__actions">
        {data.actions.map((action, index) => <a
          key={action.href}
          className={`pz-business-value-showcase__action pz-business-value-showcase__action--${index === 0 ? 'primary' : 'secondary'}`}
          href={action.href}
          target={action.newTab ? '_blank' : undefined}
          rel={action.newTab ? 'noopener noreferrer' : undefined}
        >
          {action.iconName && <span aria-hidden="true">{businessSiteIcon(action.iconName)}</span>}
          {action.label}
          <span aria-hidden="true"><ArrowRight size={16} strokeWidth={1.75} /></span>
        </a>)}
      </div>}
    </div>
  )
}
