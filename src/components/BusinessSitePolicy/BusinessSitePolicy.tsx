import type { CSSProperties, ReactNode } from 'react'
import { readableText, safeColor, safeFont } from '../../utils/siteAppearance'

export interface BusinessSitePolicyAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  textColor?: string
  accentColor?: string
  density?: 'comfortable' | 'compact'
}

export interface BusinessSitePolicyProps {
  /** The consuming app safely renders the complete policy, including its page heading. */
  children: ReactNode
  breadcrumb?: ReactNode
  appearance?: BusinessSitePolicyAppearance
  className?: string
}

/** Server-safe legal reading layout. No API calls, generated legal copy, or promotional actions. */
export function BusinessSitePolicy({ children, breadcrumb, appearance = {}, className }: BusinessSitePolicyProps) {
  const background = safeColor(appearance.backgroundColor, '#ffffff')
  const text = readableText(safeColor(appearance.textColor, '#12171c'), background)
  return <div className={['pz-business-policy', className].filter(Boolean).join(' ')}
    data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'} style={{
      '--pz-business-policy-background': background,
      '--pz-business-policy-text': text,
      '--pz-business-policy-accent': readableText(safeColor(appearance.accentColor, text), background),
      '--pz-business-policy-font': safeFont(appearance.font ?? 'plex-sans'),
      '--pz-business-policy-heading-font': safeFont(appearance.headingFont ?? 'archivo'),
    } as CSSProperties}>
    <div className="pz-business-policy__inner">
      {breadcrumb && <div className="pz-business-policy__breadcrumb">{breadcrumb}</div>}
      <article className="pz-business-policy__body">{children}</article>
    </div>
  </div>
}

BusinessSitePolicy.displayName = 'BusinessSitePolicy'
