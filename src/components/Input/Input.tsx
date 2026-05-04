import {
  type ReactNode,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  forwardRef,
  createContext,
  useContext,
} from 'react'

// ---------------------------------------------------------------------------
// FieldContext — lets Input/Textarea/Select auto-wire aria-describedby
// ---------------------------------------------------------------------------

interface FieldCtxValue {
  hintId: string | undefined
  errorId: string | undefined
}

const FieldCtx = createContext<FieldCtxValue>({
  hintId: undefined,
  errorId: undefined,
})

// ---------------------------------------------------------------------------
// Field (label + hint + error wrapper)
// ---------------------------------------------------------------------------

export interface FieldProps {
  label?: string
  required?: boolean
  hint?: string
  error?: string
  id?: string
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Field({ label, required, hint, error, id, children, className, style }: FieldProps) {
  const hintId = hint && id ? `${id}-hint` : undefined
  const errorId = error && id ? `${id}-error` : undefined

  return (
    <FieldCtx.Provider value={{ hintId, errorId }}>
      <div className={['pz-field', className].filter(Boolean).join(' ')} style={style}>
        {label && (
          <label className="pz-field__label" htmlFor={id}>
            {label}
            {required && <span className="pz-field__label-required" aria-hidden="true">*</span>}
          </label>
        )}
        {children}
        {hint && !error && <span id={hintId} className="pz-field__hint">{hint}</span>}
        {error && (
          <span id={errorId} className="pz-field__error" role="alert" aria-live="polite">
            {error}
          </span>
        )}
      </div>
    </FieldCtx.Provider>
  )
}
Field.displayName = 'Field'

// ---------------------------------------------------------------------------
// Input sizes and types
// ---------------------------------------------------------------------------

export type InputSize = 'sm' | 'md' | 'lg'

// ---------------------------------------------------------------------------
// Input (text / email / password / number / etc.)
// ---------------------------------------------------------------------------

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize
  /** Node rendered on the left side inside the input group */
  leadIcon?: ReactNode
  /** Node rendered on the right side inside the input group */
  trailIcon?: ReactNode
  /** Whether the field has a validation error (applies aria-invalid) */
  hasError?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size, leadIcon, trailIcon, hasError, className, ...rest }, ref) => {
    const { hintId, errorId } = useContext(FieldCtx)
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

    const inputClass = [
      'pz-input',
      size && size !== 'md' && `pz-input--${size}`,
      leadIcon && 'pz-input--with-lead',
      trailIcon && 'pz-input--with-trail',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const el = (
      <input
        aria-describedby={describedBy}
        {...rest}
        ref={ref}
        className={inputClass}
        aria-invalid={hasError ? 'true' : undefined}
      />
    )

    if (!leadIcon && !trailIcon) return el

    return (
      <div className="pz-input-group">
        {leadIcon && (
          <span className="pz-input-group__icon pz-input-group__icon--lead" aria-hidden="true">
            {leadIcon}
          </span>
        )}
        {el}
        {trailIcon && (
          <span className="pz-input-group__icon pz-input-group__icon--trail">
            {trailIcon}
          </span>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ hasError, className, ...rest }, ref) => {
    const { hintId, errorId } = useContext(FieldCtx)
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

    return (
      <textarea
        aria-describedby={describedBy}
        {...rest}
        ref={ref}
        className={['pz-input', 'pz-textarea', className].filter(Boolean).join(' ')}
        aria-invalid={hasError ? 'true' : undefined}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ hasError, className, children, ...rest }, ref) => {
    const { hintId, errorId } = useContext(FieldCtx)
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

    return (
      <select
        aria-describedby={describedBy}
        {...rest}
        ref={ref}
        className={['pz-input', 'pz-select', className].filter(Boolean).join(' ')}
        aria-invalid={hasError ? 'true' : undefined}
      >
        {children}
      </select>
    )
  },
)
Select.displayName = 'Select'
