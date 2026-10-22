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
  totalCount,
  viewAll,
  map,
  appearance = {},
  sectionId,
  className,
  variant = 'section',
  headingLevel = 'h2',
  controls,
}: BusinessSiteAreasProps) {
  const visibleAreas = areas.flatMap((area) => {
    const label = area.label?.trim()
    const href = safeHref(area.href)
    return label && (href || area.href === undefined)
      ? [{ id: area.id, label, href, favorite: area.favorite === true }] : []
  })
  if (visibleAreas.length === 0 && variant !== 'directory') return null
  const Heading = headingLevel

  const background = safeColor(appearance.backgroundColor, '#ffffff')
  const gradientEnd = appearance.gradientEndColor ? safeColor(appearance.gradientEndColor, '') : ''
  const angle = Number.isFinite(appearance.gradientAngle)
    ? Math.min(360, Math.max(0, Math.round(appearance.gradientAngle as number)))
    : 135
  const text = safeColor(appearance.textColor, '#12171c')
  const headingBackground = safeColor(appearance.headingBackgroundColor, background)
  const headingEnd = safeColor(appearance.headingGradientEndColor, '')
  const count = typeof totalCount === 'number' && Number.isFinite(totalCount)
    ? Math.max(visibleAreas.length, Math.floor(totalCount)) : visibleAreas.length
  const viewAllHref = safeHref(viewAll?.href)
  const viewAllLabel = viewAll?.label.trim()
  const style = {
    '--pz-business-areas-background': background,
    '--pz-business-areas-fill': gradientEnd
      ? `linear-gradient(${angle}deg, ${background}, ${gradientEnd})`
      : background,
    '--pz-business-areas-text': text,
    '--pz-business-areas-accent': safeColor(appearance.accentColor, '#1d4f8c'),
    '--pz-business-areas-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-areas-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-areas-radius': RADII.find((radius) => radius === appearance.buttonRadius) ?? '8px',
    ...(variant === 'directory' ? {
      '--pz-business-areas-heading-background': headingBackground,
      '--pz-business-areas-heading-fill': headingEnd
        ? `linear-gradient(${angle}deg, ${headingBackground}, ${headingEnd})`
        : headingBackground,
      '--pz-business-areas-heading-text': safeColor(appearance.headingTextColor, text),
    } : {}),
  } as CSSProperties

  const cities = <>
    <ul className="pz-business-areas__grid" aria-label="Cities served">
      {visibleAreas.map((area) => (
        <li key={area.id}>
          {area.href ? (
            <a className="pz-business-areas__tile" href={area.href} data-area-id={area.id}>
              <span aria-hidden="true" className="pz-business-areas__bullet" />
              {area.favorite ? <strong>{area.label}</strong> : <span>{area.label}</span>}
            </a>
          ) : variant === 'directory' ? (
            <button type="button" className="pz-business-areas__tile" data-area-id={area.id}>
              <span aria-hidden="true" className="pz-business-areas__bullet" />
              {area.favorite ? <strong>{area.label}</strong> : <span>{area.label}</span>}
            </button>
          ) : (
            <span className="pz-business-areas__tile" data-area-id={area.id}>
              <span aria-hidden="true" className="pz-business-areas__bullet" />
              {area.favorite ? <strong>{area.label}</strong> : <span>{area.label}</span>}
            </span>
          )}
        </li>
      ))}
    </ul>
    {viewAllHref && viewAllLabel && <a className="pz-business-areas__view-all" href={viewAllHref}>{viewAllLabel}<span aria-hidden="true"> →</span></a>}
    {visibleAreas.length === 0 && <p className="pz-business-areas__empty">No cities found.</p>}
  </>

  return (
    <section
      id={sectionId}
      className={['pz-business-areas', className].filter(Boolean).join(' ')}
      data-layout={map ? 'map' : 'list'}
      data-variant={variant}
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
              <Heading>{title.trim() || 'Areas we serve'}</Heading>
            </div>
            <div className="pz-business-areas__count">
              <strong>{count}</strong>
              <span>{countLabel?.trim() || (count === 1 ? 'city' : 'cities')}</span>
            </div>
          </div>
          {controls}
          {variant !== 'directory' && cities}
        </div>
        {map && <div className="pz-business-areas__map">{map}</div>}
        {variant === 'directory' && <div className="pz-business-areas__cities">{cities}</div>}
      </div>
    </section>
  )
}

BusinessSiteAreas.displayName = 'BusinessSiteAreas'
