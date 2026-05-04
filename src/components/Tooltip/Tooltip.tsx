import { type ReactNode, type HTMLAttributes, useId } from 'react'

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Tooltip text */
  content: string
  /** Preferred direction of the tooltip bubble. Defaults to `'top'`. */
  position?: TooltipPosition
  children: ReactNode
}

/**
 * CSS-only tooltip — no JS required, works on hover and focus-within.
 * Uses aria-describedby to associate the tooltip text with the trigger.
 *
 * For interactive children, the tooltip label is exposed via aria-describedby.
 * The tooltip bubble itself is aria-hidden to avoid double-reading.
 */
export function Tooltip({ content, position = 'top', className, children, ...rest }: TooltipProps) {
  const id = useId()

  return (
    <span
      className={['pz-tip', `pz-tip--${position}`, className].filter(Boolean).join(' ')}
      aria-describedby={id}
      {...rest}
    >
      {children}
      <span
        id={id}
        role="tooltip"
        className="pz-tip__bubble"
      >
        {content}
      </span>
    </span>
  )
}
Tooltip.displayName = 'Tooltip'
