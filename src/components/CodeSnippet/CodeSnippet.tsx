import { type CSSProperties, type ReactNode } from 'react'
import { AlertTriangle, Check, Copy } from 'lucide-react'
import { useClipboard } from '../../hooks/ClipBoard/useClipboard'

export interface CodeSnippetProps {
  /** Optional heading rendered above the code. */
  label?: ReactNode
  /** Code displayed and copied to the clipboard. */
  code: string
  /** Optional language or request-method badge. */
  language?: string
  /** Shows the copy action. Defaults to true. */
  copyable?: boolean
  /** Wraps long lines instead of scrolling horizontally. Defaults to false. */
  wrap?: boolean
  /** Limits the scrollable code region height. */
  maxHeight?: number | string
  /** Accessible label for the copy button. */
  copyAriaLabel?: string
  /** Copy-success button label. Defaults to "Copied". */
  copiedLabel?: string
  /** Copy-error button label. Defaults to "Copy failed". */
  errorLabel?: string
  /** Milliseconds before copy feedback resets. Defaults to 1500. */
  resetDelay?: number
  onCopySuccess?: (value: string) => void
  onCopyError?: (error: Error, value: string) => void
  className?: string
}

/**
 * **CodeSnippet** — a responsive, copyable block for API examples, commands,
 * request bodies, and response payloads.
 */
export function CodeSnippet({
  label,
  code,
  language,
  copyable = true,
  wrap = false,
  maxHeight,
  copyAriaLabel,
  copiedLabel = 'Copied',
  errorLabel = 'Copy failed',
  resetDelay = 1500,
  onCopySuccess,
  onCopyError,
  className,
}: CodeSnippetProps) {
  const { copy, status } = useClipboard({
    resetDelay,
    onSuccess: onCopySuccess,
    onError: onCopyError,
  })
  const copied = status === 'success'
  const copyFailed = status === 'error'
  const feedbackLabel = copied ? copiedLabel : copyFailed ? errorLabel : 'Copy'
  const preStyle: CSSProperties | undefined = maxHeight === undefined ? undefined : { maxHeight }
  const accessibleLabel = typeof label === 'string' ? label : language ? `${language} code` : 'Code snippet'

  return (
    <div
      className={['pz-code-snippet', wrap && 'pz-code-snippet--wrap', className].filter(Boolean).join(' ')}
      role="region"
      aria-label={accessibleLabel}
    >
      {(label || language || copyable) && (
        <div className="pz-code-snippet__header">
          <div className="pz-code-snippet__meta">
            {label && <span className="pz-code-snippet__label">{label}</span>}
            {language && <span className="pz-code-snippet__language">{language}</span>}
          </div>
          {copyable && (
            <button
              type="button"
              className="pz-code-snippet__copy"
              onClick={() => void copy(code)}
              aria-label={copyAriaLabel ?? `Copy ${accessibleLabel}`}
              data-copy-status={status}
              disabled={!code}
            >
              {copied ? <Check size={14} /> : copyFailed ? <AlertTriangle size={14} /> : <Copy size={14} />}
              <span aria-live="polite">{feedbackLabel}</span>
            </button>
          )}
        </div>
      )}
      <pre className="pz-code-snippet__pre" style={preStyle} tabIndex={0}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

CodeSnippet.displayName = 'CodeSnippet'
