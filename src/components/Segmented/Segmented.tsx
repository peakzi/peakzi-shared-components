import { type ReactNode, type KeyboardEvent, useRef } from 'react'

// =============================================================================
// Segmented
// =============================================================================

export interface SegmentedOption<T extends string = string> {
  value: T
  label: ReactNode
  /** Optional leading icon. */
  icon?: ReactNode
  /** Disable this option only. */
  disabled?: boolean
}

export interface SegmentedProps<T extends string = string> {
  /** Currently selected value. */
  value: T
  /** Called with the new value when the user picks an option. */
  onChange: (next: T) => void
  /** Available options. */
  options: SegmentedOption<T>[]
  /** Visual size. Defaults to `'md'`. */
  size?: 'sm' | 'md'
  /** Accessible label for the group (required if no visible label nearby). */
  'aria-label'?: string
  className?: string
}

/**
 * **Segmented** — pill-style segmented control. Use for 2–4 short options
 * where users should see all choices at once (mode switchers, env switchers,
 * view toggles).
 *
 * For >4 options or long labels, use `<Select>` instead.
 *
 * @example
 * <Segmented
 *   aria-label="Generator mode"
 *   value={mode}
 *   onChange={setMode}
 *   options={[
 *     { value: 'blog',   label: 'Blog' },
 *     { value: 'social', label: 'Social' },
 *     { value: 'email',  label: 'Email' },
 *   ]}
 * />
 */
export function Segmented<T extends string = string>({
  value,
  onChange,
  options,
  size = 'md',
  className,
  'aria-label': ariaLabel,
}: SegmentedProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null)

  const enabledOptions = options.filter((o) => !o.disabled)

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return
    if (enabledOptions.length === 0) return
    e.preventDefault()

    const foundIndex = enabledOptions.findIndex((o) => o.value === value)
    const currentIndex = foundIndex >= 0 ? foundIndex : 0
    let nextIndex: number

    if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = enabledOptions.length - 1
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % enabledOptions.length
    } else {
      nextIndex = (currentIndex - 1 + enabledOptions.length) % enabledOptions.length
    }

    const next = enabledOptions[nextIndex]
    if (!next) return
    onChange(next.value)

    // Move DOM focus to the newly selected button
    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>('button[role="radio"]:not(:disabled)')
    buttons?.[nextIndex]?.focus()
  }

  const cls = [
    'pz-segmented',
    size !== 'md' && `pz-segmented--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={groupRef} className={cls} role="radiogroup" aria-label={ariaLabel} onKeyDown={handleKeyDown}>
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={opt.disabled}
            tabIndex={selected ? 0 : -1}
            className={[
              'pz-segmented__option',
              selected && 'pz-segmented__option--selected',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => !opt.disabled && onChange(opt.value)}
          >
            {opt.icon && (
              <span className="pz-segmented__icon" aria-hidden="true">
                {opt.icon}
              </span>
            )}
            <span>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
Segmented.displayName = 'Segmented'
