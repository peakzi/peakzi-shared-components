import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Pencil, Check, X } from 'lucide-react'

// =============================================================================
// EditableField
// =============================================================================

export type EditableFieldLayout = 'stacked' | 'inline'

export interface EditableFieldProps {
  /** Label rendered above the value (`stacked`) or beside it (`inline`). */
  label?: ReactNode
  /** Current saved value. */
  value: string
  /** Called when the user clicks Save. Return a promise to show loading. */
  onSave: (next: string) => void | Promise<void>
  /** Optional placeholder when value is empty. */
  placeholder?: string
  /** Custom rendering for the read-only value. */
  display?: (value: string) => ReactNode
  /** Disable editing entirely (read-only). */
  readOnly?: boolean
  /** Input type — text, email, url, etc. */
  type?: 'text' | 'email' | 'url' | 'tel'
  /**
   * `'stacked'` — label above value (default).
   * `'inline'` — label beside value in a horizontal row.
   */
  layout?: EditableFieldLayout
  className?: string
}

/**
 * **EditableField** — read → edit → save inline. Common pattern for admin
 * settings (cohort, primary business, Stripe ID, etc.).
 *
 * Esc cancels, Enter commits.
 */
export function EditableField({
  label,
  value,
  onSave,
  placeholder,
  display,
  readOnly = false,
  type = 'text',
  layout = 'stacked',
  className,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [prevValue, setPrevValue] = useState(value)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync draft when external value changes while not in edit mode.
  // Uses render-time state update (React docs pattern) instead of useEffect
  // to avoid the react-hooks/set-state-in-effect lint rule.
  if (!editing && prevValue !== value) {
    setPrevValue(value)
    setDraft(value)
  }

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const startEdit = () => {
    if (readOnly) return
    setDraft(value)
    setError(null)
    setEditing(true)
  }

  const cancel = () => {
    setEditing(false)
    setDraft(value)
    setError(null)
  }

  const commit = async () => {
    if (draft === value) { setEditing(false); return }
    setSaving(true)
    setError(null)
    try {
      await onSave(draft)
      setEditing(false)
    } catch (e) {
      setError((e as Error).message ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const cls = [
    'pz-editable-field',
    layout === 'inline' && 'pz-editable-field--inline',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={cls}>
      {label && <div className="pz-editable-field__label">{label}</div>}

      {editing ? (
        <div className="pz-editable-field__edit-row">
          <input
            ref={inputRef}
            type={type}
            className="pz-input pz-input--sm"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit()
              if (e.key === 'Escape') cancel()
            }}
            placeholder={placeholder}
            disabled={saving}
            aria-invalid={error ? true : undefined}
          />
          <button
            type="button"
            className="pz-editable-field__btn pz-editable-field__btn--save"
            onClick={commit}
            disabled={saving}
            aria-label="Save"
          >
            <Check size={14} />
          </button>
          <button
            type="button"
            className="pz-editable-field__btn"
            onClick={cancel}
            disabled={saving}
            aria-label="Cancel"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="pz-editable-field__read-row">
          <span className="pz-editable-field__value">
            {value
              ? display
                ? display(value)
                : value
              : <span className="pz-editable-field__placeholder">{placeholder ?? '—'}</span>}
          </span>
          {!readOnly && (
            <button
              type="button"
              className="pz-editable-field__btn"
              onClick={startEdit}
              aria-label={`Edit ${label ?? 'value'}`}
            >
              <Pencil size={14} />
            </button>
          )}
        </div>
      )}

      {error && <div className="pz-editable-field__error">{error}</div>}
    </div>
  )
}
EditableField.displayName = 'EditableField'
