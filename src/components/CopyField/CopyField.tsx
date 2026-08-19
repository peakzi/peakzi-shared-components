import { type ReactNode } from 'react'
import { AlertTriangle, Check, Copy } from 'lucide-react'
import { useClipboard } from '../../hooks/ClipBoard/useClipboard'

// =============================================================================
// CopyField
// =============================================================================

export interface CopyFieldProps {
  /** Label rendered above the value (uppercase, small). */
  label?: ReactNode
  /** The value displayed and copied to the clipboard. */
  value: string
  /** Optional override of the rendered representation (`value` is still copied). */
  display?: ReactNode
  /** Renders the value with a monospace font. Defaults to true. */
  mono?: boolean
  /** Accessible label for the copy button. Defaults to `Copy ${label || 'value'}`. */
  copyAriaLabel?: string
  /** Tooltip / button label after a successful copy. Defaults to "Copied". */
  copiedLabel?: string
  /** Button label after a failed copy. Defaults to "Copy failed". */
  errorLabel?: string
  /** Milliseconds before copy feedback resets. Defaults to 1500. */
  resetDelay?: number
  /** Called after the value is copied successfully. */
  onCopySuccess?: (value: string) => void
  /** Called when clipboard access is unavailable or rejected. */
  onCopyError?: (error: Error, value: string) => void
  className?: string
}

/**
 * **CopyField** — read-only label/value with a copy-to-clipboard button.
 *
 * Shows a "Copied" affordance for ~1.5s after a successful copy.
 *
 * @example
 * <CopyField label="Account ID" value="acct_8f2a91" />
 */
export function CopyField({
  label,
  value,
  display,
  mono = true,
  copyAriaLabel,
  copiedLabel = 'Copied',
  errorLabel = 'Copy failed',
  resetDelay = 1500,
  onCopySuccess,
  onCopyError,
  className,
}: CopyFieldProps) {
  const { copy, status } = useClipboard({
    resetDelay,
    onSuccess: onCopySuccess,
    onError: onCopyError,
  })
  const copied = status === 'success'
  const copyFailed = status === 'error'
  const feedbackLabel = copied ? copiedLabel : copyFailed ? errorLabel : 'Copy'

  const cls = ['pz-copy-field', className].filter(Boolean).join(' ')
  const valueCls = ['pz-copy-field__value', mono && 'pz-copy-field__value--mono']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls}>
      {label && <div className="pz-copy-field__label">{label}</div>}
      <div className="pz-copy-field__row">
        <span className={valueCls}>{display ?? value}</span>
        <button
          type="button"
          className="pz-copy-field__btn"
          onClick={() => void copy(value)}
          aria-label={copyAriaLabel ?? `Copy ${label ?? 'value'}`}
          data-copy-status={status}
        >
          {copied ? <Check size={14} /> : copyFailed ? <AlertTriangle size={14} /> : <Copy size={14} />}
          <span className="pz-copy-field__btn-label" aria-live="polite">
            {feedbackLabel}
          </span>
        </button>
      </div>
    </div>
  )
}
CopyField.displayName = 'CopyField'
