import { type ReactNode, type HTMLAttributes } from 'react'
import { Info, CheckCircle, AlertTriangle, XCircle, Sparkles, X } from 'lucide-react'
import './Banner.scss'

export type BannerVariant = 'info' | 'success' | 'warning' | 'danger' | 'brand' | 'neutral'
export type BannerSize    = 'sm' | 'md' | 'lg'
export type BannerPosition = 'inline' | 'top' | 'bottom'

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  variant?:    BannerVariant
  size?:       BannerSize
  /** `inline` flows in the document; `top` / `bottom` fixed to the viewport edge. */
  position?:   BannerPosition
  /** Bold heading rendered before the body text. */
  title?:      string
  /** Icon override. Pass `null` to suppress the default icon. */
  icon?:       ReactNode
  /** CTA rendered at the trailing edge (e.g. a Button or link). */
  action?:     ReactNode
  /** Renders a dismiss (×) button. */
  dismissible?: boolean
  /** Called when the dismiss button is clicked. */
  onDismiss?:  () => void
  children?:   ReactNode
}

const DEFAULT_ICONS: Record<BannerVariant, ReactNode> = {
  info:    <Info size={16} aria-hidden />,
  success: <CheckCircle size={16} aria-hidden />,
  warning: <AlertTriangle size={16} aria-hidden />,
  danger:  <XCircle size={16} aria-hidden />,
  brand:   <Sparkles size={16} aria-hidden />,
  neutral: null,
}

export function Banner({
  variant    = 'info',
  size       = 'md',
  position   = 'inline',
  title,
  icon,
  action,
  dismissible = false,
  onDismiss,
  children,
  className,
  ...rest
}: BannerProps) {
  const resolvedIcon = icon !== undefined ? icon : DEFAULT_ICONS[variant]

  const cls = [
    'pz-banner',
    `pz-banner--${variant}`,
    size !== 'md'       && `pz-banner--${size}`,
    position !== 'inline' && `pz-banner--${position}`,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={cls} {...rest}>
      {resolvedIcon && (
        <span className="pz-banner__icon" aria-hidden="true">
          {resolvedIcon}
        </span>
      )}
      <div className="pz-banner__content">
        {title    && <strong className="pz-banner__title">{title}</strong>}
        {children && <span  className="pz-banner__body">{children}</span>}
      </div>
      {action && <div className="pz-banner__action">{action}</div>}
      {dismissible && (
        <button
          type="button"
          className="pz-banner__close"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

Banner.displayName = 'Banner'
