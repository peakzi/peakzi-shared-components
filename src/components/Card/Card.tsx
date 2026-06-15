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
  /** Icon node rendered before the title text. Pass a fully-formed JSX element, e.g. <CheckCircle2 size={16} />. */
  titleIcon?: ReactNode
  /** Action element (Button or anchor) pinned to the trailing edge. */
  actionButton?: ReactNode
  /** Centers all title content. Defaults to leading alignment. */
  centerAlign?: boolean
  children?: ReactNode
}

export function CardTitle({ as: Tag = 'h3', titleIcon, actionButton, centerAlign = false, className, children, ...rest }: CardTitleProps) {
  return (
    <Tag className={['pz-card__title', centerAlign && 'pz-card__title--center', className].filter(Boolean).join(' ')} {...rest}>
      {titleIcon && <span className="pz-card__title-icon" aria-hidden="true">{titleIcon}</span>}
      <span className="pz-card__title-text">{children}</span>
      {actionButton && <span className="pz-card__title-action">{actionButton}</span>}
    </Tag>
  )
}
CardTitle.displayName = 'CardTitle'

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function CardBody({ className, children, ...rest }: CardBodyProps) {
  return (
    <div className={['pz-card__body', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  )
}
CardBody.displayName = 'CardBody'

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function CardFooter({ className, children, ...rest }: CardFooterProps) {
  return (
    <div className={['pz-card__footer', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  )
}
CardFooter.displayName = 'CardFooter'

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
