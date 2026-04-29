import { type HTMLAttributes } from 'react'

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

export type ProgressVariant = 'default' | 'gradient' | 'success' | 'warning' | 'danger'
export type ProgressSize = 'sm' | 'md' | 'lg'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Value between 0 and 100 */
  value: number
  variant?: ProgressVariant
  size?: ProgressSize
  /** Accessible label */
  label?: string
}

export function Progress({ value, variant = 'default', size, label, className, ...rest }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={[
        'pz-progress',
        variant !== 'default' && `pz-progress--${variant}`,
        size && `pz-progress--${size}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <div className="pz-progress__bar" style={{ width: `${clamped}%` }} />
    </div>
  )
}
Progress.displayName = 'Progress'

// ---------------------------------------------------------------------------
// Ring (circular progress)
// ---------------------------------------------------------------------------

export interface RingProps extends HTMLAttributes<HTMLDivElement> {
  /** Value between 0 and 100 */
  value: number
  /** Circle size in px */
  size?: number
  strokeWidth?: number
  /** Text label in the centre */
  label?: string
  /** Accessible label */
  'aria-label'?: string
}

export function Ring({
  value,
  size = 80,
  strokeWidth = 7,
  label,
  className,
  ...rest
}: RingProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div
      className={['pz-ring', className].filter(Boolean).join(' ')}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ width: size, height: size }}
      {...rest}
    >
      <svg className="pz-ring__svg" width={size} height={size} aria-hidden="true">
        <circle
          className="pz-ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="pz-ring__indicator"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="url(#pz-ring-gradient)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="pz-ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EB55FF" />
            <stop offset="50%" stopColor="#A070F0" />
            <stop offset="100%" stopColor="#7080F0" />
          </linearGradient>
        </defs>
      </svg>
      {label && <span className="pz-ring__label">{label}</span>}
    </div>
  )
}
Ring.displayName = 'Ring'

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

export type SpinnerSize = 'sm' | 'md' | 'lg'
export type SpinnerVariant = 'default' | 'gradient'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize
  variant?: SpinnerVariant
  /** Accessible label — defaults to "Loading" */
  label?: string
}

export function Spinner({
  size,
  variant = 'default',
  label = 'Loading',
  className,
  ...rest
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={[
        'pz-spinner',
        size && `pz-spinner--${size}`,
        variant !== 'default' && `pz-spinner--${variant}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  )
}
Spinner.displayName = 'Spinner'

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

export type SkeletonVariant = 'text' | 'circle' | 'rect'

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: SkeletonVariant
  width?: number | string
  height?: number | string
}

export function Skeleton({ variant = 'rect', width, height, className, style, ...rest }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={[
        'pz-skeleton',
        variant === 'text' && 'pz-skeleton--text',
        variant === 'circle' && 'pz-skeleton--circle',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        width: width ?? (variant === 'circle' ? height : '100%'),
        height: height ?? (variant === 'text' ? undefined : 20),
        ...style,
      }}
      {...rest}
    />
  )
}
Skeleton.displayName = 'Skeleton'
