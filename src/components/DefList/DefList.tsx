import { type ReactNode, type HTMLAttributes } from 'react'

// =============================================================================
// DefList — semantic <dl> key/value list
// =============================================================================

export interface DefListProps extends HTMLAttributes<HTMLDListElement> {
  /** Density. Defaults to `'md'`. */
  size?: 'sm' | 'md'
  /** Inline (term left, value right) or stacked (term above value). */
  layout?: 'inline' | 'stacked'
  children?: ReactNode
}

/**
 * **DefList** — definition list for key/value pairs (account details,
 * metadata panels, settings summaries).
 *
 * @example
 * <DefList>
 *   <DefRow term="Account ID" value="acct_8f2a91" />
 *   <DefRow term="Cohort" value="Beta" />
 *   <DefRow term="Status">
 *     <StatusPill status="active">Active</StatusPill>
 *   </DefRow>
 * </DefList>
 */
export function DefList({
  size = 'md',
  layout = 'inline',
  children,
  className,
  ...rest
}: DefListProps) {
  const cls = [
    'pz-deflist',
    size !== 'md' && `pz-deflist--${size}`,
    layout !== 'inline' && `pz-deflist--${layout}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <dl className={cls} {...rest}>
      {children}
    </dl>
  )
}
DefList.displayName = 'DefList'

// =============================================================================
// DefRow
// =============================================================================

export interface DefRowProps {
  term: ReactNode
  /** Use either `value` (string/node shorthand) or `children`. */
  value?: ReactNode
  children?: ReactNode
  className?: string
}

export function DefRow({ term, value, children, className }: DefRowProps) {
  const cls = ['pz-deflist__row', className].filter(Boolean).join(' ')
  return (
    <div className={cls}>
      <dt className="pz-deflist__term">{term}</dt>
      <dd className="pz-deflist__value">{children ?? value}</dd>
    </div>
  )
}
DefRow.displayName = 'DefRow'
