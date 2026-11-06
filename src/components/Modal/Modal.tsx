import {
  type ReactNode,
  type CSSProperties,
  type MouseEventHandler,
  useEffect,
  useRef,
  useId,
} from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ModalSize = 'md' | 'lg' | 'xl'

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  /** Accessible name used when no visible title is rendered. */
  'aria-label'?: string
  description?: string
  size?: ModalSize
  /** Optional scoped presentation supplied by a themed dialog. */
  className?: string
  style?: CSSProperties
  /** Footer slot — typically action buttons */
  footer?: ReactNode
  children?: ReactNode
  /** Disables Escape, backdrop click, and the close button, for a flow the viewer must complete. Defaults to `true`. */
  dismissible?: boolean
}

export function Modal({
  open,
  onClose,
  title,
  'aria-label': ariaLabel,
  description,
  size,
  className,
  style,
  footer,
  children,
  dismissible = true,
}: ModalProps) {
  const generatedId = useId()
  const labelId = `pz-modal-${generatedId}`
  const dialogRef = useRef<HTMLDivElement>(null)

  // Trap focus and handle Escape key
  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const previousOverflow = document.body.style.overflow

    const handleKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      if (e.key === 'Escape' && dismissible) onClose()
      if (e.key !== 'Tab') return

      const dialog = dialogRef.current
      if (!dialog) return
      const focusable = dialog.querySelectorAll<HTMLElement>(
        ':is(a[href], button:not(:disabled), textarea:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"]))',
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) {
        e.preventDefault()
        dialog.focus()
        return
      }

      // Opening and replacing form contents can leave focus on the dialog or body.
      const active = document.activeElement
      const enter = active === dialog || !dialog.contains(active)
      if (e.shiftKey && (enter || active === first)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (enter || active === last)) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKey)
    // Focus the dialog on open
    dialogRef.current?.focus()
    // Prevent body scroll
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [open, onClose, dismissible])

  if (!open) return null

  const handleBackdropClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (dismissible && e.target === e.currentTarget) onClose()
  }

  return createPortal(
    <div className="pz-modal-backdrop" onMouseDown={handleBackdropClick} aria-hidden={!open}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? labelId : undefined}
        aria-label={title ? undefined : (ariaLabel ?? 'Dialog')}
        aria-describedby={description ? `${labelId}-desc` : undefined}
        className={['pz-modal', size && size !== 'md' && `pz-modal--${size}`, className]
          .filter(Boolean)
          .join(' ')}
        style={style}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="pz-modal__header">
          <div className="pz-modal__title-block">
            {title && (
              <h2 id={labelId} className="pz-modal__title">
                {title}
              </h2>
            )}
            {description && (
              <p id={`${labelId}-desc`} className="pz-modal__desc">
                {description}
              </p>
            )}
          </div>
          {dismissible && (
            <button
              type="button"
              className="pz-modal__close"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <X size={16} aria-hidden />
            </button>
          )}
        </div>

        {/* Body */}
        {children && <div className="pz-modal__body">{children}</div>}

        {/* Footer */}
        {footer && <div className="pz-modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
Modal.displayName = 'Modal'
