import { type ReactNode, type HTMLAttributes } from 'react'

// =============================================================================
// StatusPill
// =============================================================================

export type StatusPillStatus =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'
  | 'neutral'

export interface StatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic status. Maps to color variant. */
  status: StatusPillStatus
  /** Show a leading colored dot. Defaults to true. */
  dot?: boolean
  children?: ReactNode
}

/**
 * **StatusPill** — variant-mapped badge for status enums.
 *
 * Thin wrapper over `Badge` that maps domain statuses (`active`, `pending`,
 * `error`…) to badge variants. Keeps status colors consistent across the app.
 *
 * @example
 * <StatusPill status="active">Active</StatusPill>
 * <StatusPill status="pending">Pending review</StatusPill>
 */
export function StatusPill({
  status,
  dot = true,
  className,
  children,
  ...rest
}: StatusPillProps) {
  const cls = [
    'pz-badge',
    `pz-badge--${variantFor(status)}`,
    dot && 'pz-badge--dot',
    'pz-status-pill',
    `pz-status-pill--${status}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={cls} {...rest}>
      {children}
    </span>
  )
}
StatusPill.displayName = 'StatusPill'

function variantFor(status: StatusPillStatus) {
  switch (status) {
    case 'active':
    case 'success':
      return 'success'
    case 'pending':
    case 'warning':
      return 'warning'
    case 'error':
      return 'danger'
    case 'info':
      return 'info'
    case 'inactive':
    case 'neutral':
    default:
      return 'neutral'
  }
}
