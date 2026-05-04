import {
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from 'react'
import { ChevronDown } from 'lucide-react'

// =============================================================================
// Accordion — context
// =============================================================================

type AccordionContextValue = {
  type: 'single' | 'multiple'
  open: Set<string>
  toggle: (id: string) => void
  collapsible: boolean
}

const AccordionCtx = createContext<AccordionContextValue | null>(null)

function useAccordion() {
  const ctx = useContext(AccordionCtx)
  if (!ctx) throw new Error('Accordion sub-components must be inside <Accordion>.')
  return ctx
}

const ItemCtx = createContext<{ id: string; isOpen: boolean } | null>(null)

function useItem() {
  const ctx = useContext(ItemCtx)
  if (!ctx) throw new Error('AccordionTrigger/Content must be inside <AccordionItem>.')
  return ctx
}

// =============================================================================
// Accordion — root
// =============================================================================

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** `'single'` only allows one open item; `'multiple'` allows many. Defaults to `'single'`. */
  type?: 'single' | 'multiple'
  /** Item id(s) open by default. */
  defaultValue?: string | string[]
  /** Controlled open value(s). */
  value?: string | string[]
  /** Called when open value changes. */
  onValueChange?: (value: string[]) => void
  /** When `type='single'`, allow closing the open item. Defaults to true. */
  collapsible?: boolean
  children?: ReactNode
}

/**
 * **Accordion** — disclosure widget for vertical lists of expandable items.
 *
 * @example
 * <Accordion type="single" defaultValue="acct-1">
 *   <AccordionItem id="acct-1">
 *     <AccordionTrigger>Account #1</AccordionTrigger>
 *     <AccordionContent>…details…</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 */
export function Accordion({
  type = 'single',
  defaultValue,
  value,
  onValueChange,
  collapsible = true,
  children,
  className,
  ...rest
}: AccordionProps) {
  const initial = useMemo(() => {
    const seed = value ?? defaultValue
    if (seed == null) return new Set<string>()
    return new Set(Array.isArray(seed) ? seed : [seed])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [internal, setInternal] = useState<Set<string>>(initial)

  const open = useMemo(() => {
    if (value == null) return internal
    return new Set(Array.isArray(value) ? value : [value])
  }, [value, internal])

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(open)
      const isOpen = next.has(id)

      if (type === 'single') {
        next.clear()
        if (!isOpen) next.add(id)
        else if (!collapsible) next.add(id)
      } else {
        if (isOpen) next.delete(id)
        else next.add(id)
      }

      if (value == null) setInternal(next)
      onValueChange?.([...next])
    },
    [open, type, collapsible, value, onValueChange]
  )

  const cls = ['pz-accordion', className].filter(Boolean).join(' ')

  return (
    <AccordionCtx.Provider value={{ type, open, toggle, collapsible }}>
      <div className={cls} {...rest}>
        {children}
      </div>
    </AccordionCtx.Provider>
  )
}
Accordion.displayName = 'Accordion'

// =============================================================================
// AccordionItem
// =============================================================================

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Stable id used to track open state. */
  id: string
  children?: ReactNode
}

export function AccordionItem({ id, children, className, ...rest }: AccordionItemProps) {
  const { open } = useAccordion()
  const isOpen = open.has(id)
  const cls = [
    'pz-accordion__item',
    isOpen && 'pz-accordion__item--open',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <ItemCtx.Provider value={{ id, isOpen }}>
      <div className={cls} {...rest}>
        {children}
      </div>
    </ItemCtx.Provider>
  )
}
AccordionItem.displayName = 'AccordionItem'

// =============================================================================
// AccordionTrigger
// =============================================================================

export interface AccordionTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Hide the chevron indicator. */
  hideIndicator?: boolean
  children?: ReactNode
}

export function AccordionTrigger({
  hideIndicator,
  children,
  className,
  onClick,
  ...rest
}: AccordionTriggerProps) {
  const { toggle } = useAccordion()
  const { id, isOpen } = useItem()
  const cls = ['pz-accordion__trigger', className].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      className={cls}
      aria-expanded={isOpen}
      aria-controls={`${id}-panel`}
      id={`${id}-trigger`}
      onClick={(e) => {
        toggle(id)
        onClick?.(e)
      }}
      {...rest}
    >
      <span className="pz-accordion__trigger-content">{children}</span>
      {!hideIndicator && (
        <ChevronDown
          size={16}
          className="pz-accordion__indicator"
          aria-hidden="true"
        />
      )}
    </button>
  )
}
AccordionTrigger.displayName = 'AccordionTrigger'

// =============================================================================
// AccordionContent
// =============================================================================

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function AccordionContent({ children, className, ...rest }: AccordionContentProps) {
  const { id, isOpen } = useItem()
  const cls = ['pz-accordion__content', className].filter(Boolean).join(' ')

  return (
    <div
      id={`${id}-panel`}
      role="region"
      aria-labelledby={`${id}-trigger`}
      hidden={!isOpen}
      className={cls}
      {...rest}
    >
      {children}
    </div>
  )
}
AccordionContent.displayName = 'AccordionContent'
