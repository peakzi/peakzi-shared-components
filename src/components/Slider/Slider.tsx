import { type InputHTMLAttributes, forwardRef, useId } from 'react'

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------

export type SliderSize = 'sm' | 'md' | 'lg'
export type SliderTextPosition = 'top' | 'bottom' | 'left' | 'right'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  min?: number
  max?: number
  step?: number
  /** Visual size of the track and thumb. Defaults to `'md'`. */
  size?: SliderSize
  /** Optional label text rendered alongside the slider. */
  text?: string
  /** Position of the label relative to the slider track. Defaults to `'top'`. */
  textPosition?: SliderTextPosition
}

/**
 * Range slider with optional label, size variants, and branded thumb.
 *
 * @example
 * <Slider text="Volume" textPosition="left" min={0} max={100} defaultValue={50} />
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    { size = 'md', text, textPosition = 'top', className, min = 0, max = 100, step = 1, id: idProp, ...rest },
    ref,
  ) => {
    const generatedId = useId()
    const id = idProp ?? generatedId

    const cls = [
      'pz-slider',
      size !== 'md' && `pz-slider--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const input = (
      <input
        ref={ref}
        id={id}
        type="range"
        className={cls}
        min={min}
        max={max}
        step={step}
        {...rest}
      />
    )

    if (!text) return input

    const fieldCls = [
      'pz-slider-field',
      textPosition !== 'top' && `pz-slider-field--${textPosition}`,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={fieldCls}>
        <label className="pz-slider-field__label" htmlFor={id}>
          {text}
        </label>
        {input}
      </div>
    )
  },
)
Slider.displayName = 'Slider'
