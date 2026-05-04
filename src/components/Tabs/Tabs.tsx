import {
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  createContext,
  useContext,
  useState,
  useId,
} from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TabsVariant = 'underline' | 'pill' | 'boxed'

interface TabsContextValue {
  activeId: string
  setActiveId: (id: string) => void
  variant: TabsVariant
  baseId: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs sub-components must be used inside <Tabs>')
  return ctx
}

// ---------------------------------------------------------------------------
// Tabs root
// ---------------------------------------------------------------------------

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  /** Initially active tab id */
  defaultTab?: string
  /** Controlled active tab id */
  activeTab?: string
  /** Called when the active tab changes */
  onTabChange?: (id: string) => void
  variant?: TabsVariant
  children?: ReactNode
}

export function Tabs({
  defaultTab,
  activeTab,
  onTabChange,
  variant = 'underline',
  className,
  children,
  ...rest
}: TabsProps) {
  const baseId = useId()
  const [internalActive, setInternalActive] = useState(defaultTab ?? '')

  const activeId = activeTab ?? internalActive
  const setActiveId = (id: string) => {
    if (activeTab === undefined) setInternalActive(id)
    onTabChange?.(id)
  }

  return (
    <TabsContext.Provider value={{ activeId, setActiveId, variant, baseId }}>
      <div className={['pz-tabs', className].filter(Boolean).join(' ')} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}
Tabs.displayName = 'Tabs'

// ---------------------------------------------------------------------------
// TabList
// ---------------------------------------------------------------------------

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function TabList({ className, children, ...rest }: TabListProps) {
  const { variant } = useTabsContext()
  return (
    <div
      role="tablist"
      className={[`pz-tabs__list pz-tabs__list--${variant}`, className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
TabList.displayName = 'TabList'

// ---------------------------------------------------------------------------
// Tab trigger
// ---------------------------------------------------------------------------

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Unique id matching a <TabPanel id> */
  tabId: string
  children?: ReactNode
}

export function Tab({ tabId, className, children, onKeyDown, onClick, ...rest }: TabProps) {
  const { activeId, setActiveId, baseId } = useTabsContext()
  const isActive = activeId === tabId

  const handleKeyDown: ButtonHTMLAttributes<HTMLButtonElement>['onKeyDown'] = (e) => {
    onKeyDown?.(e)
    if (e.defaultPrevented) return

    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(e.key)) return

    const tabList = e.currentTarget.closest('[role="tablist"]')
    const tabs = Array.from(tabList?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [])
    const currentIndex = tabs.indexOf(e.currentTarget)
    if (currentIndex < 0) return

    e.preventDefault()

    const nextIndex =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? tabs.length - 1
          : e.key === 'ArrowRight'
            ? (currentIndex + 1) % tabs.length
            : (currentIndex - 1 + tabs.length) % tabs.length

    const nextTab = tabs[nextIndex]
    const nextTabId = nextTab?.dataset['tabId']
    if (!nextTab || !nextTabId) return

    nextTab.focus()
    setActiveId(nextTabId)
  }

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${tabId}`}
      aria-controls={`${baseId}-panel-${tabId}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      data-tab-id={tabId}
      className={[
        'pz-tabs__trigger',
        isActive && 'is-active',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onKeyDown={handleKeyDown}
      {...rest}
      onClick={(e) => { setActiveId(tabId); onClick?.(e) }}
    >
      {children}
    </button>
  )
}
Tab.displayName = 'Tab'

// ---------------------------------------------------------------------------
// TabPanel
// ---------------------------------------------------------------------------

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Must match the tabId on the corresponding <Tab> */
  tabId: string
  children?: ReactNode
}

export function TabPanel({ tabId, className, children, ...rest }: TabPanelProps) {
  const { activeId, baseId } = useTabsContext()
  if (activeId !== tabId) return null

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${tabId}`}
      aria-labelledby={`${baseId}-tab-${tabId}`}
      className={['pz-tabs__panel', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
TabPanel.displayName = 'TabPanel'
