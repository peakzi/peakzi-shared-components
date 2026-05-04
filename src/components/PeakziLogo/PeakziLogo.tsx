import type { AnchorHTMLAttributes } from 'react'

export type LogoVariant = 'color' | 'white' | 'icon' | 'icon-navy'
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface PeakziLogoProps {
  /** Which asset to render */
  variant?: LogoVariant
  /** Height of the logo */
  size?: LogoSize
  /** Wraps the logo in an <a href> — renders <span> when omitted */
  href?: string
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target']
  /** Defaults to 'noopener noreferrer' when target="_blank" */
  rel?: string
  /** Accessible label — defaults to 'Peakzi' or 'Peakzi icon' based on variant */
  alt?: string
  className?: string
}

const ASSET_FILES: Record<LogoVariant, string> = {
  color: 'peakzi-logo-color.png',
  white: 'peakzi-logo-white.png',
  icon: 'peakzi-icon.png',
  'icon-navy': 'peakzi-icon-navy-bg.png',
}

const DEFAULT_ALTS: Record<LogoVariant, string> = {
  color: 'Peakzi',
  white: 'Peakzi',
  icon: 'Peakzi icon',
  'icon-navy': 'Peakzi icon',
}

export function PeakziLogo({
  variant = 'color',
  size = 'md',
  href,
  target,
  rel,
  alt,
  className,
}: PeakziLogoProps) {
  const moduleUrl = import.meta.url
  const assetPrefix = moduleUrl?.includes('/src/') ? '../../../assets/' : '../assets/'
  const assetPath = `${assetPrefix}${ASSET_FILES[variant]}`
  const src = moduleUrl ? new URL(assetPath, moduleUrl).href : assetPath
  const cls = [
    'pz-logo',
    `pz-logo--${size}`,
    href && 'pz-logo--link',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const img = (
    <img
      src={src}
      alt={alt ?? DEFAULT_ALTS[variant]}
      className="pz-logo__img"
      draggable={false}
    />
  )

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? (rel ?? 'noopener noreferrer') : rel}
        className={cls}
      >
        {img}
      </a>
    )
  }

  return <span className={cls}>{img}</span>
}
PeakziLogo.displayName = 'PeakziLogo'
