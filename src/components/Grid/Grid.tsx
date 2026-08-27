import { type ReactNode, type HTMLAttributes } from 'react'

// =============================================================================
// Grid
// =============================================================================

export type GridGap = 'sm' | 'md' | 'lg'

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Number of EQUAL columns, `"auto"` to size columns from `minColWidth`, or
   * an array of fractional weights for an UNEQUAL split — e.g. `[1.4, 1]` for
   * a main-content column beside a narrower side column.
   */
  columns: number | 'auto' | number[]
  /** Minimum column width when `columns="auto"`. Ignored otherwise. Defaults to `220px`. */
  minColWidth?: string
  gap?: GridGap
  /**
   * Collapse to a single column below 640px. Off by default — `columns="auto"` already
   * reflows on its own. Opt in for a fixed/weighted grid of full-content cards that would
   * otherwise stay cramped on a phone (e.g. a finding card's `[1.4, 1]` split). Leave off
   * for compact chip/tile rows, where a lone full-width item would look sparse instead.
   */
  stackOnMobile?: boolean
  children?: ReactNode
}

/**
 * **Grid** — lays out children in columns: equal, auto-flowing, or weighted.
 * Used for a signal strip, an actions row, a standing strip, and (with a
 * weight array) an asymmetric two-column split (e.g. main content beside a
 * narrower reasons panel).
 *
 * @example
 * <Grid columns={3} gap="md">
 *   <StatCard eyebrow="Busier" value="-1.3%" />
 *   <StatCard eyebrow="AI reads" value="2,847" />
 * </Grid>
 *
 * @example
 * <Grid columns={[1.4, 1]} gap="lg">
 *   <div>main content</div>
 *   <div>why this ranks first</div>
 * </Grid>
 */
export function Grid({ columns, minColWidth = '220px', gap = 'md', stackOnMobile, className, style, children, ...rest }: GridProps) {
  const cls = [
    'pz-grid',
    `pz-grid--gap-${gap}`,
    stackOnMobile && 'pz-grid--stack-mobile',
    className,
  ].filter(Boolean).join(' ')
  const gridTemplateColumns =
    columns === 'auto' ? `repeat(auto-fit, minmax(${minColWidth}, 1fr))`
    : Array.isArray(columns) ? columns.map((w) => `minmax(0, ${w}fr)`).join(' ')
    : `repeat(${columns}, minmax(0, 1fr))`
  return (
    <div className={cls} style={{ gridTemplateColumns, ...style }} {...rest}>
      {children}
    </div>
  )
}
Grid.displayName = 'Grid'
