import { useState, useCallback, type ReactNode } from 'react'
import { Copy, Check } from 'lucide-react'

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
  className,
}: CopyFieldProps) {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API may be unavailable (insecure context) — silently no-op.
    }
  }, [value])

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
          onClick={onCopy}
          aria-label={copyAriaLabel ?? `Copy ${label ?? 'value'}`}
          data-copied={copied || undefined}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span className="pz-copy-field__btn-label">
            {copied ? copiedLabel : 'Copy'}
          </span>
        </button>
      </div>
    </div>
  )
}
CopyField.displayName = 'CopyField'
