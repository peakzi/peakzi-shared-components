import { type ReactNode, type HTMLAttributes } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarVariant = 'default' | 'gradient'
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline'

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image source URL */
  src?: string
  /** Alt text for the image (or initials fallback) */
  alt?: string
  /** Initials to show when no image is provided */
  initials?: string
  size?: AvatarSize
  variant?: AvatarVariant
  /** Adds a purple ring */
  ring?: boolean
  /** Online status dot */
  status?: AvatarStatus
  children?: ReactNode
}

export function Avatar({
  src,
  alt = '',
  initials,
  size,
  variant = 'default',
  ring,
  status,
  className,
  children,
  ...rest
}: AvatarProps) {
  const cls = [
    'pz-avatar',
    size && `pz-avatar--${size}`,
    variant === 'gradient' && 'pz-avatar--gradient',
    ring && 'pz-avatar--ring',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={cls} {...rest}>
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        initials ?? children
      )}
      {status && (
        <span
          className={[
            'pz-avatar__status',
            status !== 'online' && `pz-avatar__status--${status}`,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label={`Status: ${status}`}
        />
      )}
    </span>
  )
}
Avatar.displayName = 'Avatar'

// ---------------------------------------------------------------------------
// AvatarStack
// ---------------------------------------------------------------------------

export interface AvatarStackProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function AvatarStack({ className, children, ...rest }: AvatarStackProps) {
  return (
    <div
      className={['pz-avatar-stack', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
AvatarStack.displayName = 'AvatarStack'
