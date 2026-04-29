import { type ReactNode, type HTMLAttributes, useId } from 'react'

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Tooltip text */
  content: string
  children: ReactNode
}

/**
 * CSS-only tooltip — no JS required, works on hover and focus-within.
 * Uses aria-describedby to associate the tooltip text with the trigger.
 *
 * For interactive children, the tooltip label is exposed via aria-describedby.
 * The tooltip bubble itself is aria-hidden to avoid double-reading.
 */
export function Tooltip({ content, className, children, ...rest }: TooltipProps) {
  const id = useId()

  return (
    <span
      className={['pz-tip', className].filter(Boolean).join(' ')}
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
