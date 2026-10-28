import { useId, type CSSProperties } from 'react'
import { Button } from '../Button'
import { businessSiteIcon } from '../../utils/businessSiteIcon'
import { safeHref } from '../../utils/safeHref'
import { readableText, safeColor, safeFont, type BusinessSiteMotion } from '../../utils/siteAppearance'

export type BusinessSiteCtaVariant = 'direct-line' | 'invitation' | 'service-desk'

export interface BusinessSiteCtaAction {
  id: string
  label: string
  href: string
  type?: 'primary' | 'secondary'
  iconName?: string
  newTab?: boolean
  /** @deprecated Contact metadata is no longer rendered as a duplicate action. Use label for visible copy. */
  displayValue?: string
  /** @deprecated Use label for the single visible action. */
  displayLabel?: string
}

export interface BusinessSiteCtaAppearance {
  font?: string
  headingFont?: string
  /** Page surface and foreground, shared by all three layouts. */
  surfaceColor?: string
  surfaceTextColor?: string
  backgroundColor?: string
  gradientEndColor?: string
  textColor?: string
  accentColor?: string
  /** Primary button on the page surface; uses the dark background when omitted. */
  buttonColor?: string
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  density?: 'comfortable' | 'compact'
  motion?: BusinessSiteMotion
}

export interface BusinessSiteCtaProps {
  title: string
  description?: string
  actions: readonly BusinessSiteCtaAction[]
  appearance?: BusinessSiteCtaAppearance
  variant?: BusinessSiteCtaVariant
  /** Opaque placement key for host-owned analytics; never inferred from CTA copy. */
  placement?: string
  sectionId?: string
  className?: string
}

function themeColor(value: unknown): string | undefined {
  if (typeof value === 'string' && /^#(?:[\da-f]{4}|[\da-f]{8})$/i.test(value.trim())) return value.trim()
  return safeColor(value, '') || undefined
}

function opaqueColor(color: string, background: string): string {
  const rgba = (value: string) => {
    const digits = value.slice(1)
    const hex = digits.length <= 4 ? [...digits].map((digit) => digit + digit).join('') : digits
    return [0, 2, 4, 6].map((index) => index === 6 && hex.length === 6 ? 1 : Number.parseInt(hex.slice(index, index + 2), 16) / 255)
  }
  const foreground = rgba(color), backdrop = rgba(background)
  return `#${foreground.slice(0, 3).map((value, index) => {
    const behind = backdrop[index]! * backdrop[3]! + 1 - backdrop[3]!
    return Math.round((value * foreground[3]! + behind * (1 - foreground[3]!)) * 255).toString(16).padStart(2, '0')
  }).join('')}`
}

function ctaStyle(appearance: BusinessSiteCtaAppearance, variant: BusinessSiteCtaVariant): CSSProperties {
  const background = themeColor(appearance.backgroundColor)
  const surface = themeColor(appearance.surfaceColor)
  const accent = themeColor(appearance.accentColor)
  const button = themeColor(appearance.buttonColor) ?? background
  return {
    '--pz-business-cta-surface': surface,
    '--pz-business-cta-surface-text': themeColor(appearance.surfaceTextColor),
    '--pz-business-cta-background': background,
    '--pz-business-cta-gradient-end': themeColor(appearance.gradientEndColor),
    '--pz-business-cta-text': themeColor(appearance.textColor),
    '--pz-business-cta-accent': accent,
    '--pz-business-cta-button': button,
    '--pz-business-cta-on-button': button ? readableText('#ffffff', opaqueColor(button, surface ?? '#ffffff')) : undefined,
    '--pz-business-cta-on-accent': accent ? readableText('#ffffff', opaqueColor(accent, (variant === 'invitation' ? surface : background) ?? '#ffffff')) : undefined,
    '--pz-business-cta-font': safeFont(appearance.font ?? 'plex-sans'),
    '--pz-business-cta-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    '--pz-business-cta-radius': ['2px', '8px', '16px', '32px'].find((radius) => radius === appearance.buttonRadius),
  } as CSSProperties
}

/** Server-safe CTA presentation. The consuming application supplies business data and placement. */
export function BusinessSiteCta({ title, description, actions, appearance = {}, variant = 'service-desk', placement, sectionId, className }: BusinessSiteCtaProps) {
  const headingId = `${useId()}-cta-heading`
  const seen = new Set<string>()
  const links = actions.flatMap((action) => {
    const href = safeHref(action.href)
    const label = action.label.trim()
    if (!href || !label || !action.id.trim() || seen.has(action.id)) return []
    seen.add(action.id)
    return [{ ...action, href, label }]
  })
  if (!title.trim() || !links.length) return null
  const primaryIndex = Math.max(0, links.findIndex((action) => action.type === 'primary'))
  const layout = variant === 'direct-line' || variant === 'invitation' ? variant : 'service-desk'
  const renderAction = (action: BusinessSiteCtaAction, index: number) => {
    const primary = index === primaryIndex
    const newTab = action.newTab === true && /^https?:\/\//i.test(action.href)
    return <Button key={action.id} href={action.href} variant={primary ? 'primary' : 'secondary'}
      className={['pz-business-cta__action', primary && 'pz-business-cta__action--primary'].filter(Boolean).join(' ')}
      {...(newTab ? { target: '_blank' as const } : {})} data-action-id={action.id}>
      {action.iconName && <span className="pz-business-cta__icon" aria-hidden="true">{businessSiteIcon(action.iconName)}</span>}
      <span className="pz-business-cta__label">{action.label}</span>
    </Button>
  }
  return <section id={sectionId} className={['pz-business-cta', className].filter(Boolean).join(' ')} aria-labelledby={headingId}
    data-cta-placement={placement} data-cta-variant={layout} data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'}
    data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'} data-motion-section style={ctaStyle(appearance, layout)}>
    <div className="pz-business-cta__panel">
      <div className="pz-business-cta__copy" data-motion-reveal>
        <h2 id={headingId}>{title}</h2>
        {description?.trim() && <p>{description}</p>}
      </div>
      <div className="pz-business-cta__actions" data-motion-reveal>
        {links.map(renderAction)}
      </div>
    </div>
  </section>
}

BusinessSiteCta.displayName = 'BusinessSiteCta'
