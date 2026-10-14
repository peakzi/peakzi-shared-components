import { useId } from 'react'
import { ValueShowcaseBand } from './band/ValueShowcaseBand'
import { valueShowcaseBackground, valueShowcaseStyle } from './helpers/appearance'
import type { BusinessSiteValueShowcaseProps } from './helpers/types'
import { validShowcase } from './helpers/validate'
import { ValueShowcaseProof } from './proof/ValueShowcaseProof'
import { ValueShowcaseTiles } from './tiles/ValueShowcaseTiles'

export function BusinessSiteValueShowcase(props: BusinessSiteValueShowcaseProps) {
  const headingId = `${useId()}-heading`
  const { appearance = {}, sectionId, className } = props
  const data = validShowcase(props)
  if (!data.title || (!data.items.length && data.rating === null)) return null

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={['pz-business-value-showcase', className].filter(Boolean).join(' ')}
      data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'}
      data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'}
      data-background={valueShowcaseBackground(appearance.background)}
      style={valueShowcaseStyle(appearance)}
    >
      <div className="pz-business-value-showcase__inner">
        <div className="pz-business-value-showcase__frame">
          <div className="pz-business-value-showcase__band" data-proof={data.hasProof ? 'true' : 'false'}>
            <ValueShowcaseBand headingId={headingId} data={data} />
            <ValueShowcaseProof data={data} />
          </div>
          {(data.items.length > 0 || data.note) && <div className="pz-business-value-showcase__body">
            <ValueShowcaseTiles items={data.items} visible={data.mobileVisibleItems} />
            {data.note && <div className="pz-business-value-showcase__footer">
              <p className="pz-business-value-showcase__note">{data.note}</p>
              {data.methodHref && <a className="pz-business-value-showcase__footer-link" href={data.methodHref}>{data.methodLabel} <span aria-hidden="true">↗</span></a>}
            </div>}
          </div>}
        </div>
      </div>
    </section>
  )
}

BusinessSiteValueShowcase.displayName = 'BusinessSiteValueShowcase'
