import { useId, useState } from 'react'
import type { CSSProperties } from 'react'
import { Minus, Plus, Star } from 'lucide-react'
import { businessSiteIcon } from '../../utils/businessSiteIcon'
import { valueShowcaseStyle } from './helpers/appearance'
import type { BusinessSiteValueShowcaseProps } from './helpers/types'
import { fillLabel, validShowcase } from './helpers/validate'

const STARS = [0, 1, 2, 3, 4]

export function BusinessSiteValueShowcase(props: BusinessSiteValueShowcaseProps) {
  const baseId = useId()
  const headingId = `${baseId}-heading`
  const cardsId = `${baseId}-cards`
  const [expanded, setExpanded] = useState(false)
  const { appearance = {}, sectionId, className } = props
  const data = validShowcase(props)
  if (!data.title || (!data.items.length && !data.highlights.length)) return null
  const Heading = data.level === 3 ? 'h3' : 'h2'
  const ItemHeading = data.level === 3 ? 'h4' : 'h3'
  // Every card stays in the page. In narrow containers the ones past `mobileVisibleItems` are hidden by CSS until "View all".
  const hidden = Math.max(0, data.items.length - data.mobileVisibleItems)

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={['pz-business-value-showcase', className].filter(Boolean).join(' ')}
      data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'}
      data-divider={appearance.divider === false ? 'false' : 'true'}
      style={valueShowcaseStyle(appearance)}
    >
      <div className="pz-business-value-showcase__inner">
        <div className="pz-business-value-showcase__header" data-seal={data.seal ? 'true' : 'false'}>
          <div className="pz-business-value-showcase__intro">
            <Heading id={headingId} className="pz-business-value-showcase__title">{data.title}</Heading>
            {data.lead && <p className="pz-business-value-showcase__lead">{data.lead}</p>}
          </div>
          {data.seal && <p
            className="pz-business-value-showcase__seal"
            style={{ '--pz-business-value-showcase-seal-scale': data.seal.scale } as CSSProperties}
          >
            {data.seal.iconName && <span className="pz-business-value-showcase__seal-icon" aria-hidden="true">{businessSiteIcon(data.seal.iconName)}</span>}
            <span className="pz-business-value-showcase__seal-text">{data.seal.text}</span>
            {data.seal.stars && <span className="pz-business-value-showcase__seal-stars" aria-hidden="true">
              {STARS.map((index) => <Star key={index} size={11} fill="currentColor" strokeWidth={0} />)}
            </span>}
          </p>}
        </div>

        {data.highlights.length > 0 && <ul className="pz-business-value-showcase__highlights" role="list" aria-label={data.highlightsLabel || undefined}>
          {data.highlights.map((entry) => <li key={entry.key}>
            {entry.iconName && <span className="pz-business-value-showcase__highlight-icon" aria-hidden="true">{businessSiteIcon(entry.iconName)}</span>}
            <span className="pz-business-value-showcase__highlight-copy">
              <span className="pz-business-value-showcase__highlight-title">{entry.title}</span>
              {entry.detail && <span className="pz-business-value-showcase__highlight-detail">{entry.detail}</span>}
            </span>
          </li>)}
        </ul>}

        {data.items.length > 0 && <ul
          id={cardsId}
          className="pz-business-value-showcase__cards"
          role="list"
          aria-label={data.itemsLabel || undefined}
          data-count={data.items.length}
          data-expanded={expanded || hidden === 0 ? 'true' : 'false'}
        >
          {data.items.map((item, index) => <li key={item.id} data-collapsible={index >= data.mobileVisibleItems ? 'true' : undefined}>
            <article className="pz-business-value-showcase__card">
              {item.iconName && <span className="pz-business-value-showcase__medallion" aria-hidden="true">{businessSiteIcon(item.iconName)}</span>}
              <div className="pz-business-value-showcase__card-body">
                <div className="pz-business-value-showcase__card-head">
                  <ItemHeading className="pz-business-value-showcase__card-title">{item.name}</ItemHeading>
                  {item.label && <span className="pz-business-value-showcase__label">{item.label}</span>}
                </div>
                {item.standing && <p className="pz-business-value-showcase__standing">{item.standing}</p>}
                {item.proof && <p className="pz-business-value-showcase__proof">{item.proof}</p>}
              </div>
            </article>
          </li>)}
        </ul>}

        {hidden > 0 && <button
          type="button"
          className="pz-business-value-showcase__more"
          aria-expanded={expanded}
          aria-controls={cardsId}
          onClick={() => setExpanded((value) => !value)}
        >
          {fillLabel(expanded ? data.showLessLabel : data.showMoreLabel, data.items.length, hidden)}
          {expanded ? <Minus aria-hidden="true" size={16} /> : <Plus aria-hidden="true" size={16} />}
        </button>}

        {data.note && <p className="pz-business-value-showcase__note">{data.note}</p>}
      </div>
    </section>
  )
}

BusinessSiteValueShowcase.displayName = 'BusinessSiteValueShowcase'
