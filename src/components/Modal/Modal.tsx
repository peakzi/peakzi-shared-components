import {
  type ReactNode,
  type MouseEventHandler,
  type KeyboardEvent as ReactKeyboardEvent,
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
  /** Footer slot — typically action buttons */
  footer?: ReactNode
  children?: ReactNode
}

export function Modal({
  open,
  onClose,
  title,
  'aria-label': ariaLabel,
  description,
  size,
  footer,
  children,
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
      if (e.key === 'Escape') onClose()
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
  }, [open, onClose])

  if (!open) return null

  const handleBackdropClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleDialogKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), textarea:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
    )

    if (!focusable?.length) {
      e.preventDefault()
      dialogRef.current?.focus()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (!first || !last) return

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
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
        className={['pz-modal', size && size !== 'md' && `pz-modal--${size}`]
          .filter(Boolean)
          .join(' ')}
        tabIndex={-1}
        onKeyDown={handleDialogKeyDown}
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
          <button
            type="button"
            className="pz-modal__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={16} aria-hidden />
          </button>
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
