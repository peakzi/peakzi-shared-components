import { type ReactNode, type HTMLAttributes } from 'react'

// =============================================================================
// Stack
// =============================================================================

export type StackGap = 'xs' | 'sm' | 'md' | 'lg'

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column'
  gap?: StackGap
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between'
  wrap?: boolean
  children?: ReactNode
}

/**
 * **Stack** — a single flex row or column, for a fixed handful of DIFFERENT
 * things sitting together. Covers card title rows, inline label/value rows,
 * and button groups. If you're laying out N copies of the same shape, use
 * `Grid` instead.
 *
 * @example
 * <Stack direction="row" align="start" gap="sm">
 *   <Icon />
 *   <span style={{ flex: 1 }}>Title text</span>
 *   <Badge variant="danger">Risk</Badge>
 * </Stack>
 */
export function Stack({ direction = 'column', gap = 'md', align, justify, wrap, className, style, children, ...rest }: StackProps) {
  const cls = ['pz-stack', `pz-stack--${direction}`, `pz-stack--gap-${gap}`, className].filter(Boolean).join(' ')
  const alignItems = align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align
  const justifyContent = justify === 'start' ? 'flex-start' : justify === 'end' ? 'flex-end' : justify === 'between' ? 'space-between' : justify
  return (
    <div className={cls} style={{ alignItems, justifyContent, flexWrap: wrap ? 'wrap' : undefined, ...style }} {...rest}>
      {children}
    </div>
  )
}
Stack.displayName = 'Stack'
