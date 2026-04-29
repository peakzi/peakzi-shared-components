import { type ReactNode, type HTMLAttributes, type AnchorHTMLAttributes } from 'react'

// ---------------------------------------------------------------------------
// Navbar root
// ---------------------------------------------------------------------------

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
}

export function Navbar({ className, children, ...rest }: NavbarProps) {
  return (
    <header className={['pz-navbar', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </header>
  )
}
Navbar.displayName = 'Navbar'

// ---------------------------------------------------------------------------
// NavBrand
// ---------------------------------------------------------------------------

export interface NavBrandProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Logo image node (img, svg, etc.) */
  logo?: ReactNode
  children?: ReactNode
}

export function NavBrand({ logo, className, children, href = '/', ...rest }: NavBrandProps) {
  return (
    <a
      className={['pz-navbar__brand', className].filter(Boolean).join(' ')}
      href={href}
      {...rest}
    >
      {logo}
      {children}
    </a>
  )
}
NavBrand.displayName = 'NavBrand'

// ---------------------------------------------------------------------------
// NavLinks container
// ---------------------------------------------------------------------------

export interface NavLinksProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function NavLinks({ className, children, ...rest }: NavLinksProps) {
  return (
    <nav
      className={['pz-navbar__links', className].filter(Boolean).join(' ')}
      aria-label="Main navigation"
      {...rest}
    >
      {children}
    </nav>
  )
}
NavLinks.displayName = 'NavLinks'

// ---------------------------------------------------------------------------
// NavLink item
// ---------------------------------------------------------------------------

export interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marks the link as the currently active page */
  active?: boolean
  children?: ReactNode
}

export function NavLink({ active, className, children, ...rest }: NavLinkProps) {
  return (
    <a
      className={['pz-navbar__link', active && 'is-active', className]
        .filter(Boolean)
        .join(' ')}
      aria-current={active ? 'page' : undefined}
      {...rest}
    >
      {children}
    </a>
  )
}
NavLink.displayName = 'NavLink'

// ---------------------------------------------------------------------------
// NavActions container
// ---------------------------------------------------------------------------

export interface NavActionsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function NavActions({ className, children, ...rest }: NavActionsProps) {
  return (
    <div className={['pz-navbar__actions', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  )
}
NavActions.displayName = 'NavActions'
