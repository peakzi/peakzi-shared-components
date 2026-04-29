import { type ReactNode, type InputHTMLAttributes, forwardRef, useId } from 'react'

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text rendered next to the checkbox */
  children?: ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ children, className, id: idProp, ...rest }, ref) => {
    const generatedId = useId()
    const id = idProp ?? generatedId

    return (
      <label
        className={['pz-checkbox', className].filter(Boolean).join(' ')}
        htmlFor={id}
      >
        <input ref={ref} id={id} type="checkbox" {...rest} />
        <span className="pz-checkbox__box" aria-hidden="true" />
        {children}
      </label>
    )
  },
)
Checkbox.displayName = 'Checkbox'

// ---------------------------------------------------------------------------
// Radio
// ---------------------------------------------------------------------------

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text rendered next to the radio */
  children?: ReactNode
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ children, className, id: idProp, ...rest }, ref) => {
    const generatedId = useId()
    const id = idProp ?? generatedId

    return (
      <label
        className={['pz-radio', className].filter(Boolean).join(' ')}
        htmlFor={id}
      >
        <input ref={ref} id={id} type="radio" {...rest} />
        <span className="pz-radio__box" aria-hidden="true" />
        {children}
      </label>
    )
  },
)
Radio.displayName = 'Radio'
