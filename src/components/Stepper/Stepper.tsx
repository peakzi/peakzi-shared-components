import { type ReactNode, type HTMLAttributes } from 'react'
import { Check, AlertCircle } from 'lucide-react'

// =============================================================================
// Stepper
// =============================================================================

export type StepperStatus = 'idle' | 'active' | 'done' | 'error'

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  /** `<StepperItem>` children. */
  children?: ReactNode
}

/**
 * **Stepper** — vertical progress stepper. Used for multi-step async flows
 * (e.g. AI Website generation: scrape → outline → write → publish).
 *
 * @example
 * <Stepper>
 *   <StepperItem status="done"   title="Scrape source" />
 *   <StepperItem status="active" title="Outline"        body="Drafting sections…" />
 *   <StepperItem status="idle"   title="Write copy" />
 *   <StepperItem status="idle"   title="Publish" />
 * </Stepper>
 */
export function Stepper({ children, className, ...rest }: StepperProps) {
  const cls = ['pz-stepper', className].filter(Boolean).join(' ')
  return (
    <ol className={cls} {...rest}>
      {children}
    </ol>
  )
}
Stepper.displayName = 'Stepper'

// =============================================================================
// StepperItem
// =============================================================================

export interface StepperItemProps {
  status?: StepperStatus
  title: ReactNode
  body?: ReactNode
  /** Optional step number override (otherwise inferred from order). */
  stepNumber?: number
  className?: string
}

export function StepperItem({
  status = 'idle',
  title,
  body,
  stepNumber,
  className,
}: StepperItemProps) {
  const cls = [
    'pz-stepper__item',
    `pz-stepper__item--${status}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li className={cls}>
      <div className="pz-stepper__marker" aria-hidden="true">
        {status === 'done' && <Check size={14} strokeWidth={3} />}
        {status === 'error' && <AlertCircle size={14} strokeWidth={2.5} />}
        {status === 'active' && <span className="pz-stepper__pulse" />}
        {status === 'idle' && stepNumber != null && (
          <span className="pz-stepper__num">{stepNumber}</span>
        )}
      </div>
      <div className="pz-stepper__content">
        <div className="pz-stepper__title">{title}</div>
        {body && <div className="pz-stepper__body">{body}</div>}
      </div>
    </li>
  )
}
StepperItem.displayName = 'StepperItem'
