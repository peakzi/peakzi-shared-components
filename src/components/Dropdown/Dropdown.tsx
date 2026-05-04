import {
  type ReactNode,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEventHandler,
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useId,
} from 'react'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface DropdownContextValue {
  open: boolean
  setOpen: (v: boolean) => void
  triggerId: string
  menuId: string
}

const DropdownContext = createContext<DropdownContextValue | null>(null)

function useDropdownContext() {
  const ctx = useContext(DropdownContext)
  if (!ctx) throw new Error('Dropdown sub-components must be used inside <Dropdown>')
  return ctx
}

// ---------------------------------------------------------------------------
// Dropdown root
// ---------------------------------------------------------------------------

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function Dropdown({ className, children, ...rest }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const triggerId = `${id}-trigger`
  const menuId = `${id}-menu`

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerId, menuId }}>
      <div
        ref={ref}
        className={['pz-dropdown', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  )
}
Dropdown.displayName = 'Dropdown'

// ---------------------------------------------------------------------------
// DropdownTrigger
// ---------------------------------------------------------------------------

export interface DropdownTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

export function DropdownTrigger({ className, children, onClick, ...rest }: DropdownTriggerProps) {
  const { open, setOpen, triggerId, menuId } = useDropdownContext()
  return (
    <button
      type="button"
      id={triggerId}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={menuId}
      className={className}
      {...rest}
      onClick={(e) => { setOpen(!open); onClick?.(e) }}
    >
      {children}
    </button>
  )
}
DropdownTrigger.displayName = 'DropdownTrigger'

// ---------------------------------------------------------------------------
// DropdownMenu
// ---------------------------------------------------------------------------

export type DropdownAlign = 'left' | 'right'

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  align?: DropdownAlign
  children?: ReactNode
}

export function DropdownMenu({ align = 'left', className, children, ...rest }: DropdownMenuProps) {
  const { open, menuId, triggerId } = useDropdownContext()
  return (
    <div
      id={menuId}
      role="menu"
      hidden={!open}
      aria-labelledby={triggerId}
      className={[
        'pz-dropdown__menu',
        align === 'right' && 'pz-dropdown__menu--right',
        open && 'is-open',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
DropdownMenu.displayName = 'DropdownMenu'

// ---------------------------------------------------------------------------
// DropdownItem
// ---------------------------------------------------------------------------

export interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Renders item in danger/destructive style */
  danger?: boolean
  /** Leading icon */
  icon?: ReactNode
  children?: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export function DropdownItem({
  danger,
  icon,
  className,
  children,
  onClick,
  ...rest
}: DropdownItemProps) {
  const { setOpen } = useDropdownContext()

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    onClick?.(e)
    setOpen(false)
  }

  return (
    <button
      type="button"
      role="menuitem"
      className={[
        'pz-dropdown__item',
        danger && 'pz-dropdown__item--danger',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handleClick}
      {...rest}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  )
}
DropdownItem.displayName = 'DropdownItem'

// ---------------------------------------------------------------------------
// DropdownSeparator
// ---------------------------------------------------------------------------

export function DropdownSeparator() {
  return <div className="pz-dropdown__sep" role="separator" />
}
DropdownSeparator.displayName = 'DropdownSeparator'

// ---------------------------------------------------------------------------
// DropdownLabel
// ---------------------------------------------------------------------------

export interface DropdownLabelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function DropdownLabel({ className, children, ...rest }: DropdownLabelProps) {
  return (
    <div className={['pz-dropdown__label', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  )
}
DropdownLabel.displayName = 'DropdownLabel'
