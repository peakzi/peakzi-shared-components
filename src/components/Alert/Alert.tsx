import { type ReactNode, type HTMLAttributes } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

// ---------------------------------------------------------------------------
// Alert
// ---------------------------------------------------------------------------

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  /** Icon override — defaults to variant-specific icon */
  icon?: ReactNode
  /** Hides the icon when true */
  hideIcon?: boolean
  children?: ReactNode
}

const DEFAULT_ICONS: Record<AlertVariant, ReactNode> = {
  info: <Info size={16} aria-hidden />,
  success: <CheckCircle size={16} aria-hidden />,
  warning: <AlertTriangle size={16} aria-hidden />,
  danger: <XCircle size={16} aria-hidden />,
}

export function Alert({
  variant = 'info',
  title,
  icon,
  hideIcon = false,
  className,
  children,
  ...rest
}: AlertProps) {
  const resolvedIcon = icon ?? DEFAULT_ICONS[variant]

  return (
    <div
      role="alert"
      aria-live="polite"
      className={['pz-alert', `pz-alert--${variant}`, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {!hideIcon && (
        <span className="pz-alert__icon">{resolvedIcon}</span>
      )}
      <div>
        {title && <p className="pz-alert__title">{title}</p>}
        {children && <p className="pz-alert__desc">{children}</p>}
      </div>
    </div>
  )
}
Alert.displayName = 'Alert'
