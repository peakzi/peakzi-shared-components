import { type ReactNode, type HTMLAttributes } from 'react'

// ---------------------------------------------------------------------------
// Card variants
// ---------------------------------------------------------------------------

export type CardVariant = 'default' | 'hoverable' | 'elevated' | 'inset' | 'dark' | 'gradient'

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  /** <Card.Title> shorthand — also accepts arbitrary children */
  children?: ReactNode
}

export function Card({ variant = 'default', className, children, ...rest }: CardProps) {
  const cls = [
    'pz-card',
    variant !== 'default' && `pz-card--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  )
}
Card.displayName = 'Card'

// ---------------------------------------------------------------------------
// Card sub-components
// ---------------------------------------------------------------------------

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children?: ReactNode
}

export function CardTitle({ as: Tag = 'h3', className, children, ...rest }: CardTitleProps) {
  return (
    <Tag className={['pz-card__title', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Tag>
  )
}
CardTitle.displayName = 'CardTitle'

export interface CardBodyProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode
}

export function CardBody({ className, children, ...rest }: CardBodyProps) {
  return (
    <p className={['pz-card__body', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </p>
  )
}
CardBody.displayName = 'CardBody'

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

export type StatDelta = 'up' | 'down'

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string
  value: string | number
  delta?: string
  deltaType?: StatDelta
}

export function Stat({ eyebrow, value, delta, deltaType = 'up', className, ...rest }: StatProps) {
  return (
    <div className={['pz-stat', className].filter(Boolean).join(' ')} {...rest}>
      {eyebrow && <span className="pz-stat__eyebrow">{eyebrow}</span>}
      <span className="pz-stat__value">{value}</span>
      {delta && (
        <span className={`pz-stat__delta pz-stat__delta--${deltaType}`}>
          {deltaType === 'up' ? '↑' : '↓'} {delta}
        </span>
      )}
    </div>
  )
}
Stat.displayName = 'Stat'
