import type { CSSProperties } from 'react'
import { MapPin } from 'lucide-react'
import { safeColor, safeFont } from '../../utils/siteAppearance'
import type { BusinessSiteMotion } from '../../utils/siteAppearance'
import { safeHref } from '../../utils/safeHref'

export interface BusinessSiteArea {
  id: string
  label: string
  href: string
}

export interface BusinessSiteAreasAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  /** Optional second color; when set the background becomes a gradient from backgroundColor to this (same name as the hero's). */
  gradientEndColor?: string
  /** Gradient angle in degrees (0-360). Default 135. */
  gradientAngle?: number
  textColor?: string
  accentColor?: string
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  density?: 'comfortable' | 'compact'
  /** Site-wide motion setting; disabled by default. `subtle` adds the scroll reveal. Reduced-motion preferences always win. */
  motion?: BusinessSiteMotion
}

export interface BusinessSiteAreasProps {
  areas: readonly BusinessSiteArea[]
  title?: string
  /** Label under the big city count. Default: "Cities served" ("City served" for one). */
  countLabel?: string
  appearance?: BusinessSiteAreasAppearance
  sectionId?: string
  className?: string
}

const RADII = ['2px', '8px', '16px', '32px'] as const

export function BusinessSiteAreas({
  areas,
  title = 'Areas we serve',
  countLabel,
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
      data-surface={gradientEnd ? 'gradient' : 'solid'}
      data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'}
      data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'}
      style={style}
    >
      <div className="pz-business-areas__inner">
        <div className="pz-business-areas__heading">
          <h2>{title.trim() || 'Areas we serve'}</h2>
          <div className="pz-business-areas__count">
            <strong>{count}</strong>
            <span>{countLabel?.trim() || (count === 1 ? 'City served' : 'Cities served')}</span>
          </div>
        </div>
        <div className="pz-business-areas__grid">
          {visibleAreas.map((area) => (
            <a className="pz-business-areas__tile" href={area.href} key={area.id}>
              <MapPin size={17} aria-hidden="true" />
              <span>{area.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

BusinessSiteAreas.displayName = 'BusinessSiteAreas'
