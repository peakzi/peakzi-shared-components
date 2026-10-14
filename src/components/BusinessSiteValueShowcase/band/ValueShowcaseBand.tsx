import { Award } from 'lucide-react'
import { businessSiteIcon } from '../../../utils/businessSiteIcon'
import type { ValidShowcase } from '../helpers/validate'

interface Props { headingId: string; data: ValidShowcase }

export function ValueShowcaseBand({ headingId, data }: Props) {
  const chips = data.gradeChip || data.trustSignals.length > 0
  return (
    <div className="pz-business-value-showcase__intro">
      <div className="pz-business-value-showcase__heading">
        {(data.eyebrow || data.methodHref) && <div className="pz-business-value-showcase__eyebrow-row">
          {data.eyebrow && <p className="pz-business-value-showcase__eyebrow">{data.eyebrow}</p>}
          {data.methodHref && <a className="pz-business-value-showcase__method" href={data.methodHref}>{data.methodLabel} <span aria-hidden="true">↗</span></a>}
        </div>}
        <h2 id={headingId}>{data.title}</h2>
        {data.lead && <p className="pz-business-value-showcase__lead">{data.lead}</p>}
      </div>
      {chips && <ul className="pz-business-value-showcase__chips" role="list" aria-label="Grades and trust signals">
        {data.gradeChip && <li><Award aria-hidden="true" size={14} strokeWidth={1.75} />{data.gradeChip}</li>}
        {data.trustSignals.map((signal) => <li key={signal.label}>{businessSiteIcon(signal.iconName)}{signal.label}</li>)}
      </ul>}
    </div>
  )
}
