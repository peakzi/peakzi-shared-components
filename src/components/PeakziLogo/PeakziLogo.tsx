import { forwardRef } from 'react'
import type { AnchorHTMLAttributes, Ref } from 'react'
import colorLogoSrc from '../../../assets/peakzi-logo-color.png'
import whiteLogoSrc from '../../../assets/peakzi-logo-white.png'
import iconSrc from '../../../assets/peakzi-icon.png'
import iconNavySrc from '../../../assets/peakzi-icon-navy-bg.png'

/**
 * `'auto'` — renders both color and white images; CSS swaps them based on
 * `[data-theme="dark"]` on `<html>`. Use this when the logo sits on a themed
 * surface (e.g. the SideNav brand row) so it stays readable in both modes.
 */
export type LogoVariant = 'color' | 'white' | 'icon' | 'icon-navy' | 'auto'
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

const ASSET_SRCS: Record<Exclude<LogoVariant, 'auto'>, string> = {
  color: colorLogoSrc,
  white: whiteLogoSrc,
  icon: iconSrc,
  'icon-navy': iconNavySrc,
}

const DEFAULT_ALTS: Record<Exclude<LogoVariant, 'auto'>, string> = {
  color: 'Peakzi',
  white: 'Peakzi',
  icon: 'Peakzi icon',
  'icon-navy': 'Peakzi icon',
}

export const PeakziLogo = forwardRef<HTMLElement, PeakziLogoProps>(
  ({ variant = 'color', size = 'md', href, target, rel, alt, className }, ref) => {
    const cls = ['pz-logo', `pz-logo--${size}`, variant === 'auto' && 'pz-logo--auto', href && 'pz-logo--link', className]
      .filter(Boolean)
      .join(' ')

    // 'auto': render both images; CSS hides/shows based on [data-theme]
    const img =
      variant === 'auto' ? (
        <>
          <img
            src={colorLogoSrc}
            alt={alt ?? 'Peakzi'}
            className="pz-logo__img pz-logo__img--color"
            draggable={false}
          />
          <img
            src={whiteLogoSrc}
            alt=""
            aria-hidden
            className="pz-logo__img pz-logo__img--white"
            draggable={false}
          />
        </>
      ) : (
        <img
          src={ASSET_SRCS[variant]}
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
