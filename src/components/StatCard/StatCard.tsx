import { type ReactNode, type HTMLAttributes } from 'react'
import { Card, type CardTone } from '../Card'
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
  /**
   * Colors `value` and `footer` text by sentiment. Unset by default (plain, today's
   * behavior) — the card's background stays untinted either way, only the text reads
   * the sentiment. Independent of `Card`'s own `tone` (background wash).
   */
  tone?: CardTone
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
  tone,
  className,
  ...rest
}: StatCardProps) {
  const cls = ['pz-stat-card', tone && `pz-stat-card--tone-${tone}`, className].filter(Boolean).join(' ')
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
