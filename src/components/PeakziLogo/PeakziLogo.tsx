import { forwardRef } from 'react'
import type { AnchorHTMLAttributes, Ref } from 'react'
import colorLogoSrc from '../../../assets/peakzi-logo-color.png'
import whiteLogoSrc from '../../../assets/peakzi-logo-white.png'
import iconSrc from '../../../assets/peakzi-icon.png'
import iconNavySrc from '../../../assets/peakzi-icon-navy-bg.png'

export type LogoVariant = 'color' | 'white' | 'icon' | 'icon-navy'
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface PeakziLogoProps {
  variant?: LogoVariant
  size?: LogoSize
  href?: string
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target']
  rel?: string
  alt?: string
  className?: string
}

const ASSET_SRCS: Record<LogoVariant, string> = {
  color: colorLogoSrc,
  white: whiteLogoSrc,
  icon: iconSrc,
  'icon-navy': iconNavySrc,
}

const DEFAULT_ALTS: Record<LogoVariant, string> = {
  color: 'Peakzi',
  white: 'Peakzi',
  icon: 'Peakzi icon',
  'icon-navy': 'Peakzi icon',
}

export const PeakziLogo = forwardRef<HTMLElement, PeakziLogoProps>(
  ({ variant = 'color', size = 'md', href, target, rel, alt, className }, ref) => {
    const src = ASSET_SRCS[variant]
    const cls = ['pz-logo', `pz-logo--${size}`, href && 'pz-logo--link', className]
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
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={target === '_blank' ? (rel ?? 'noopener noreferrer') : rel}
          className={cls}
        >
          {img}
        </a>
      )
    }

    return (
      <span ref={ref as Ref<HTMLSpanElement>} className={cls}>
        {img}
      </span>
    )
  },
)
PeakziLogo.displayName = 'PeakziLogo'
