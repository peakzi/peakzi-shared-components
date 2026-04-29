import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs, TabList, Tab, TabPanel } from './Tabs'

function BasicTabs({ defaultTab = 'tab1', variant = 'underline' as const, onTabChange = undefined as ((id: string) => void) | undefined } = {}) {
  return (
    <Tabs defaultTab={defaultTab} variant={variant} onTabChange={onTabChange}>
      <TabList>
        <Tab tabId="tab1">Tab 1</Tab>
        <Tab tabId="tab2">Tab 2</Tab>
        <Tab tabId="tab3">Tab 3</Tab>
      </TabList>
      <TabPanel tabId="tab1">Panel 1</TabPanel>
      <TabPanel tabId="tab2">Panel 2</TabPanel>
      <TabPanel tabId="tab3">Panel 3</TabPanel>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('renders tab buttons', () => {
    render(<BasicTabs />)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it('renders tablist', () => {
    render(<BasicTabs />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('shows the default tab panel on mount', () => {
    render(<BasicTabs defaultTab="tab1" />)
    expect(screen.getByText('Panel 1')).toBeInTheDocument()
    expect(screen.queryByText('Panel 2')).not.toBeInTheDocument()
  })

  it('marks default tab as aria-selected', () => {
    render(<BasicTabs defaultTab="tab2" />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false')
  })

  it('switches panel when tab is clicked', () => {
    render(<BasicTabs defaultTab="tab1" />)
    fireEvent.click(screen.getByText('Tab 2'))
    expect(screen.getByText('Panel 2')).toBeInTheDocument()
    expect(screen.queryByText('Panel 1')).not.toBeInTheDocument()
  })

  it('calls onTabChange when a tab is clicked', () => {
    const onTabChange = vi.fn()
    render(<BasicTabs onTabChange={onTabChange} />)
    fireEvent.click(screen.getByText('Tab 2'))
    expect(onTabChange).toHaveBeenCalledWith('tab2')
  })

  it('tab has aria-controls pointing to panel id', () => {
    render(<BasicTabs />)
    const tab1 = screen.getAllByRole('tab')[0]
    const panel1 = screen.getByRole('tabpanel')
    expect(tab1.getAttribute('aria-controls')).toBe(panel1.id)
  })

  it('applies underline variant class to tablist', () => {
    render(<BasicTabs variant="underline" />)
    expect(screen.getByRole('tablist')).toHaveClass('pz-tabs__list--underline')
  })

  it('applies pill variant class to tablist', () => {
    render(<BasicTabs variant="pill" />)
    expect(screen.getByRole('tablist')).toHaveClass('pz-tabs__list--pill')
  })

  it('applies boxed variant class to tablist', () => {
    render(<BasicTabs variant="boxed" />)
    expect(screen.getByRole('tablist')).toHaveClass('pz-tabs__list--boxed')
  })

  it('active tab has is-active class', () => {
    render(<BasicTabs defaultTab="tab1" />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs[0]).toHaveClass('is-active')
    expect(tabs[1]).not.toHaveClass('is-active')
  })

  it('active tab has tabIndex 0, inactive tabs have -1', () => {
    render(<BasicTabs defaultTab="tab1" />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs[0]).toHaveAttribute('tabindex', '0')
    expect(tabs[1]).toHaveAttribute('tabindex', '-1')
  })

  it('moves to the next tab with ArrowRight', () => {
    render(<BasicTabs defaultTab="tab1" />)
    const tabs = screen.getAllByRole('tab')
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' })
    expect(tabs[1]).toHaveFocus()
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Panel 2')).toBeInTheDocument()
  })

  it('moves to the previous tab with ArrowLeft', () => {
    render(<BasicTabs defaultTab="tab1" />)
    const tabs = screen.getAllByRole('tab')
    fireEvent.keyDown(tabs[0], { key: 'ArrowLeft' })
    expect(tabs[2]).toHaveFocus()
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Panel 3')).toBeInTheDocument()
  })

  it('supports Home and End tab navigation', () => {
    render(<BasicTabs defaultTab="tab2" />)
    const tabs = screen.getAllByRole('tab')

    fireEvent.keyDown(tabs[1], { key: 'Home' })
    expect(tabs[0]).toHaveFocus()
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(tabs[0], { key: 'End' })
    expect(tabs[2]).toHaveFocus()
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true')
  })

  it('renders tabpanel with correct role', () => {
    render(<BasicTabs defaultTab="tab1" />)
    expect(screen.getByRole('tabpanel')).toBeInTheDocument()
  })

  it('controlled mode: respects activeTab prop', () => {
    render(
      <Tabs activeTab="tab2">
        <TabList>
          <Tab tabId="tab1">Tab 1</Tab>
          <Tab tabId="tab2">Tab 2</Tab>
        </TabList>
        <TabPanel tabId="tab1">Panel 1</TabPanel>
        <TabPanel tabId="tab2">Panel 2</TabPanel>
      </Tabs>,
    )
    expect(screen.getByText('Panel 2')).toBeInTheDocument()
    expect(screen.queryByText('Panel 1')).not.toBeInTheDocument()
  })
})
