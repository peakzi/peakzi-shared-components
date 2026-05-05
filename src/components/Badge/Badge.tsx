import { type ReactNode, type HTMLAttributes, type MouseEventHandler } from 'react'

// ---------------------------------------------------------------------------
// BadgeAnchor — positions a badge overlay on any element
// ---------------------------------------------------------------------------

export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface BadgeAnchorProps {
  /** The element the badge is anchored to */
  children: ReactNode
  /** Badge label (count, "New", etc.). Omit for a plain dot. */
  content?: ReactNode
  variant?: BadgeVariant
  /** Corner to pin the badge to. Defaults to 'top-right'. */
  position?: BadgePosition
  className?: string
}

export function BadgeAnchor({
  children,
  content,
  variant = 'danger',
  position = 'top-right',
  className,
}: BadgeAnchorProps) {
  const badgeCls = [
    'pz-badge-anchor__badge',
    `pz-badge-anchor__badge--${position}`,
    `pz-badge--${variant}`,
    !content && 'pz-badge-anchor__badge--dot',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={['pz-badge-anchor', className].filter(Boolean).join(' ')}>
      {children}
      <span className={badgeCls}>{content}</span>
    </span>
  )
}
BadgeAnchor.displayName = 'BadgeAnchor'

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

export type BadgeVariant =
  | 'neutral'
  | 'brand'
  | 'gradient'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline'

export type BadgeSize = 'sm' | 'lg'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  /** Renders a colored dot before the badge text */
  dot?: boolean
  children?: ReactNode
}

export function Badge({
  variant = 'neutral',
  size,
  dot,
  className,
  children,
  ...rest
}: BadgeProps) {
  const cls = [
    'pz-badge',
    `pz-badge--${variant}`,
    size && `pz-badge--${size}`,
    dot && 'pz-badge--dot',
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
Badge.displayName = 'Badge'

// ---------------------------------------------------------------------------
// Chip (dismissible tag)
// ---------------------------------------------------------------------------

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Called when the close button is clicked */
  onClose?: MouseEventHandler<HTMLButtonElement>
  /** aria-label for the close button; defaults to "Remove" */
  closeLabel?: string
  children?: ReactNode
}

export function Chip({ onClose, closeLabel = 'Remove', className, children, ...rest }: ChipProps) {
  return (
    <span className={['pz-chip', className].filter(Boolean).join(' ')} {...rest}>
      {children}
      {onClose && (
        <button
          type="button"
          className="pz-chip__close"
          onClick={onClose}
          aria-label={closeLabel}
        >
          ×
        </button>
      )}
    </span>
  )
}
Chip.displayName = 'Chip'
