import { type ReactNode, type HTMLAttributes } from 'react'

// =============================================================================
// EmptyState
// =============================================================================

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Icon node — typically a 28–32px lucide icon. */
  icon?: ReactNode
  /** Headline. */
  title: ReactNode
  /** Supporting copy. */
  body?: ReactNode
  /** Action area — primary CTA on the left, optional secondary on the right. */
  actions?: ReactNode
  /** Visual padding density. Defaults to `'md'`. */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * **EmptyState** — generic "no data yet" panel for empty tables, search
 * results, lists, and feature placeholders.
 *
 * @example
 * <EmptyState
 *   icon={<Inbox size={28} />}
 *   title="No accounts yet"
 *   body="Accounts you create will appear here."
 *   actions={<Button variant="primary">New account</Button>}
 * />
 */
export function EmptyState({
  icon,
  title,
  body,
  actions,
  size = 'md',
  className,
  ...rest
}: EmptyStateProps) {
  const cls = [
    'pz-empty',
    size !== 'md' && `pz-empty--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls} role="status" {...rest}>
      {icon && <div className="pz-empty__icon" aria-hidden="true">{icon}</div>}
      <div className="pz-empty__title">{title}</div>
      {body && <div className="pz-empty__body">{body}</div>}
      {actions && <div className="pz-empty__actions">{actions}</div>}
    </div>
  )
}
EmptyState.displayName = 'EmptyState'
