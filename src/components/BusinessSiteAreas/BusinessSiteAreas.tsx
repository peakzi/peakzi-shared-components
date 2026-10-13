import type { CSSProperties } from 'react'
import { safeColor, safeFont } from '../../utils/siteAppearance'
import { safeHref } from '../../utils/safeHref'

import type { BusinessSiteAreasProps } from './helpers/types'
export type { BusinessSiteArea, BusinessSiteAreasAppearance, BusinessSiteAreasProps } from './helpers/types'

const RADII = ['2px', '8px', '16px', '32px'] as const

export function BusinessSiteAreas({
  areas,
  title = 'Areas we serve',
  eyebrow = 'Service area',
  countLabel,
  map,
  appearance = {},
  sectionId,
  className,
}: BusinessSiteAreasProps) {
  const visibleAreas = areas.flatMap((area) => {
    const label = area.label?.trim()
    const href = safeHref(area.href)
    return label && href ? [{ id: area.id, label, href }] : []
  })
  if (visibleAreas.length === 0) return null

  const background = safeColor(appearance.backgroundColor, '#ffffff')
  const gradientEnd = appearance.gradientEndColor ? safeColor(appearance.gradientEndColor, '') : ''
  const angle = Number.isFinite(appearance.gradientAngle)
    ? Math.min(360, Math.max(0, Math.round(appearance.gradientAngle as number)))
    : 135
  const count = visibleAreas.length
  const style = {
    '--pz-business-areas-background': background,
    '--pz-business-areas-fill': gradientEnd
      ? `linear-gradient(${angle}deg, ${background}, ${gradientEnd})`
      : background,
    '--pz-business-areas-text': safeColor(appearance.textColor, '#12171c'),
    '--pz-business-areas-accent': safeColor(appearance.accentColor, '#1d4f8c'),
    '--pz-business-areas-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-areas-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-areas-radius': RADII.find((radius) => radius === appearance.buttonRadius) ?? '8px',
  } as CSSProperties

  return (
    <section
      id={sectionId}
      className={['pz-business-areas', className].filter(Boolean).join(' ')}
      data-layout={map ? 'map' : 'list'}
      data-surface={gradientEnd ? 'gradient' : 'solid'}
      data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'}
      data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'}
      style={style}
    >
      <div className="pz-business-areas__inner">
        <div className="pz-business-areas__panel">
          <div className="pz-business-areas__heading">
            <div>
              {eyebrow.trim() && <p className="pz-business-areas__eyebrow">{eyebrow.trim()}</p>}
              <h2>{title.trim() || 'Areas we serve'}</h2>
            </div>
            <div className="pz-business-areas__count">
              <strong>{count}</strong>
              <span>{countLabel?.trim() || (count === 1 ? 'city' : 'cities')}</span>
            </div>
          </div>
          <ul className="pz-business-areas__grid" aria-label="Cities served">
            {visibleAreas.map((area) => (
              <li key={area.id}>
                <a className="pz-business-areas__tile" href={area.href} data-area-id={area.id}>
                  <span aria-hidden="true" className="pz-business-areas__bullet" />
                  <span>{area.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        {map && <div className="pz-business-areas__map">{map}</div>}
      </div>
    </section>
  )
}

BusinessSiteAreas.displayName = 'BusinessSiteAreas'
