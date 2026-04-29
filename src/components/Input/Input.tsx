import {
  type ReactNode,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  forwardRef,
} from 'react'

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
}

export function Field({ label, required, hint, error, id, children, className }: FieldProps) {
  return (
    <div className={['pz-field', className].filter(Boolean).join(' ')}>
      {label && (
        <label className="pz-field__label" htmlFor={id}>
          {label}
          {required && <span className="pz-field__label-required" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className="pz-field__hint">{hint}</span>}
      {error && (
        <span className="pz-field__error" role="alert" aria-live="polite">
          {error}
        </span>
      )}
    </div>
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
  /** Whether the field has a validation error (applies .is-error) */
  hasError?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size, leadIcon, trailIcon, hasError, className, ...rest }, ref) => {
    const inputClass = [
      'pz-input',
      size && size !== 'md' && `pz-input--${size}`,
      leadIcon && 'pz-input--with-lead',
      trailIcon && 'pz-input--with-trail',
      hasError && 'is-error',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const el = <input ref={ref} className={inputClass} {...rest} />

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
    return (
      <textarea
        ref={ref}
        className={['pz-input', 'pz-textarea', hasError && 'is-error', className]
          .filter(Boolean)
          .join(' ')}
        {...rest}
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
    return (
      <select
        ref={ref}
        className={['pz-input', 'pz-select', hasError && 'is-error', className]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {children}
      </select>
    )
  },
)
Select.displayName = 'Select'
