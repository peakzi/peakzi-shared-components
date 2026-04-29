import { type ReactNode, type InputHTMLAttributes, forwardRef, useId } from 'react'

// ---------------------------------------------------------------------------
// Switch
// ---------------------------------------------------------------------------

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label rendered next to the switch */
  children?: ReactNode
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ children, className, id: idProp, ...rest }, ref) => {
    const generatedId = useId()
    const id = idProp ?? generatedId

    return (
      <label
        className={['pz-switch', className].filter(Boolean).join(' ')}
        htmlFor={id}
      >
        <input ref={ref} id={id} type="checkbox" role="switch" {...rest} />
        <span className="pz-switch__track" aria-hidden="true">
          <span className="pz-switch__thumb" />
        </span>
        {children}
      </label>
    )
  },
)
Switch.displayName = 'Switch'

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  min?: number
  max?: number
  step?: number
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, min = 0, max = 100, step = 1, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type="range"
        className={['pz-slider', className].filter(Boolean).join(' ')}
        min={min}
        max={max}
        step={step}
        {...rest}
      />
    )
  },
)
Slider.displayName = 'Slider'
