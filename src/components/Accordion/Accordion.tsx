import {
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  createContext,
  useContext,
  useState,
  useId,
} from 'react'
import { ChevronDown } from 'lucide-react'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface AccordionContextValue {
  openIds: Set<string>
  toggle: (id: string) => void
  multiple: boolean
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

function useAccordionContext() {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error('AccordionItem must be used inside <Accordion>')
  return ctx
}

// ---------------------------------------------------------------------------
// Accordion root
// ---------------------------------------------------------------------------

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow multiple items open simultaneously */
  multiple?: boolean
  /** IDs of initially open items */
  defaultOpen?: string[]
  children?: ReactNode
}

export function Accordion({
  multiple = false,
  defaultOpen = [],
  className,
  children,
  ...rest
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpen))

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!multiple) next.clear()
        next.add(id)
      }
      return next
    })
  }

  return (
    <AccordionContext.Provider value={{ openIds, toggle, multiple }}>
      <div
        className={['pz-accordion', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  )
}
Accordion.displayName = 'Accordion'

// ---------------------------------------------------------------------------
// AccordionItem
// ---------------------------------------------------------------------------

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Unique identifier for this item */
  itemId: string
  children?: ReactNode
}

export function AccordionItem({ itemId, className, children, ...rest }: AccordionItemProps) {
  const { openIds } = useAccordionContext()
  const isOpen = openIds.has(itemId)

  return (
    <div
      className={['pz-accordion__item', isOpen && 'is-open', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
AccordionItem.displayName = 'AccordionItem'

// ---------------------------------------------------------------------------
// AccordionTrigger
// ---------------------------------------------------------------------------

export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Must match the parent AccordionItem's itemId */
  itemId: string
  children?: ReactNode
}

export function AccordionTrigger({ itemId, className, children, ...rest }: AccordionTriggerProps) {
  const { openIds, toggle } = useAccordionContext()
  const isOpen = openIds.has(itemId)
  const baseId = useId()
  const triggerId = `${baseId}-trigger`
  const panelId = `${baseId}-panel`

  return (
    <button
      type="button"
      id={triggerId}
      aria-expanded={isOpen}
      aria-controls={panelId}
      className={['pz-accordion__trigger', className].filter(Boolean).join(' ')}
      onClick={() => toggle(itemId)}
      data-panel-id={panelId}
      {...rest}
    >
      <span className="pz-accordion__trigger-text">{children}</span>
      <ChevronDown size={16} className="pz-accordion__chevron" aria-hidden />
    </button>
  )
}
AccordionTrigger.displayName = 'AccordionTrigger'

// ---------------------------------------------------------------------------
// AccordionContent
// ---------------------------------------------------------------------------

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional id hook for consumers mirroring the trigger's itemId */
  itemId?: string
  children?: ReactNode
}

export function AccordionContent({ itemId, className, children, ...rest }: AccordionContentProps) {
  return (
    <div
      role="region"
      data-item-id={itemId}
      className={['pz-accordion__content', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <div className="pz-accordion__content-inner">
        <div>{children}</div>
      </div>
    </div>
  )
}
AccordionContent.displayName = 'AccordionContent'
