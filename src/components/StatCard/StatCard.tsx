import { type ReactNode, type HTMLAttributes } from 'react'
import { Card } from '../Card'
import { Stat, type StatDelta } from '../Card'

// =============================================================================
// StatCard
// =============================================================================

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string
  value: string | number
  delta?: string
  deltaType?: StatDelta
  /** Optional supporting content under the stat (sparkline, footnote, etc.). */
  footer?: ReactNode
}

/**
 * **StatCard** — `<Stat>` wrapped in a `<Card>` for KPI grids.
 *
 * Use directly inside a CSS grid:
 * ```tsx
 * <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
 *   <StatCard eyebrow="Active accounts" value="2,418" delta="12%" deltaType="up" />
 *   <StatCard eyebrow="MRR"             value="$184k" delta="3.4%" deltaType="up" />
 *   …
 * </div>
 * ```
 */
export function StatCard({
  eyebrow,
  value,
  delta,
  deltaType,
  footer,
  className,
  ...rest
}: StatCardProps) {
  const cls = ['pz-stat-card', className].filter(Boolean).join(' ')
  return (
    <Card className={cls} {...rest}>
      <Stat
        value={value}
        {...(eyebrow != null && { eyebrow })}
        {...(delta != null && { delta })}
        {...(deltaType != null && { deltaType })}
      />
      {footer && <div className="pz-stat-card__footer">{footer}</div>}
    </Card>
  )
}
StatCard.displayName = 'StatCard'
