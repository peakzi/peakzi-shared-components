import { type ReactNode, type InputHTMLAttributes, forwardRef, useId } from 'react'

export type CheckboxLabelPosition = 'left' | 'right' | 'top' | 'bottom'

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text rendered next to the checkbox */
  children?: ReactNode
  /** Position of the label relative to the checkbox control. Defaults to `'right'`. */
  labelPosition?: CheckboxLabelPosition
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ children, className, id: idProp, labelPosition = 'right', ...rest }, ref) => {
    const generatedId = useId()
    const id = idProp ?? generatedId

    const cls = [
      'pz-checkbox',
      labelPosition !== 'right' && `pz-checkbox--label-${labelPosition}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <label className={cls} htmlFor={id}>
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
  /** Position of the label relative to the radio control. Defaults to `'right'`. */
  labelPosition?: CheckboxLabelPosition
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ children, className, id: idProp, labelPosition = 'right', ...rest }, ref) => {
    const generatedId = useId()
    const id = idProp ?? generatedId

    const cls = [
      'pz-radio',
      labelPosition !== 'right' && `pz-radio--label-${labelPosition}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <label className={cls} htmlFor={id}>
        <input ref={ref} id={id} type="radio" {...rest} />
        <span className="pz-radio__box" aria-hidden="true" />
        {children}
      </label>
    )
  },
)
Radio.displayName = 'Radio'
