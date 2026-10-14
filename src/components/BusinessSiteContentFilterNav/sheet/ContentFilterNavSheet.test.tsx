import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ContentFilterNavSheet } from './ContentFilterNavSheet'
import type { BusinessSiteContentFilterNavTrade } from '../helpers/types'

const trades: BusinessSiteContentFilterNavTrade[] = [
  { key: 'plumbing', label: 'Plumbing', services: ['Water Filtration', 'Drain Cleaning'] },
  { key: 'hvac', label: 'HVAC', services: ['AC Repair'] },
  { key: 'electrical', label: 'Electrical', services: ['Panel Upgrade'] },
]

const hrefFor = (trade: string, service?: string | null) =>
  service ? `/blogs/${trade}/${service.toLowerCase().replace(/\s+/g, '-')}` : `/blogs/${trade}`

function setup(overrides: Partial<Parameters<typeof ContentFilterNavSheet>[0]> = {}) {
  return render(
    <ContentFilterNavSheet
      trades={trades}
      currentTradeKey="plumbing"
      activeService={null}
      hrefFor={hrefFor}
      dialogTitle="Browse topics"
      {...overrides}
    />
  )
}

describe('ContentFilterNavSheet', () => {
  it('falls back the closed trigger to the current trade\'s first service when no activeService is given', () => {
    setup()
    const trigger = screen.getByRole('button', { name: /change/i })
    expect(trigger).toHaveTextContent('Plumbing')
    expect(trigger).toHaveTextContent('Water Filtration')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows the active service label when one is selected', () => {
    setup({ activeService: 'Drain Cleaning' })
    expect(screen.getByRole('button', { name: /change/i })).toHaveTextContent('Drain Cleaning')
  })

  it('opens the dialog on trigger click and closes it on the close button', () => {
    const { container } = setup()
    const dialog = container.querySelector('[role="dialog"]')!
    expect(dialog).toHaveAttribute('aria-hidden', 'true')

    fireEvent.click(screen.getByRole('button', { name: /change/i }))
    expect(dialog).toHaveAttribute('aria-hidden', 'false')
    expect(screen.getByRole('button', { name: /change/i })).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(dialog).toHaveAttribute('aria-hidden', 'true')
  })

  it('closes on Escape and restores focus to the trigger', () => {
    setup()
    const trigger = screen.getByRole('button', { name: /change/i })
    trigger.focus()
    fireEvent.click(trigger)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-hidden', 'false')

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('aria-hidden', 'true')
    expect(trigger).toHaveFocus()
  })

  it('closes on backdrop click', () => {
    const { container } = setup()
    fireEvent.click(screen.getByRole('button', { name: /change/i }))
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-hidden', 'false')

    fireEvent.click(container.querySelector('.pz-business-content-filter-nav__backdrop')!)
    expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('aria-hidden', 'true')
  })

  it('switches the previewed trade on tab click without navigating', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: /change/i }))

    expect(screen.getByRole('link', { name: /water filtration/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: 'HVAC' }))
    expect(screen.queryByRole('link', { name: /water filtration/i })).toBeNull()
    expect(screen.getByRole('link', { name: /ac repair/i })).toBeInTheDocument()
    // Still closed only via explicit user action — tab switch alone must not navigate or close.
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-hidden', 'false')
  })

  it('moves preview and focus across tabs with arrow keys, and wraps at the ends', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: /change/i }))
    const plumbingTab = screen.getByRole('tab', { name: 'Plumbing' })
    plumbingTab.focus()

    fireEvent.keyDown(plumbingTab, { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'HVAC' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'HVAC' })).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(screen.getByRole('tab', { name: 'HVAC' }), { key: 'End' })
    expect(screen.getByRole('tab', { name: 'Electrical' })).toHaveFocus()

    fireEvent.keyDown(screen.getByRole('tab', { name: 'Electrical' }), { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'Plumbing' })).toHaveFocus()

    fireEvent.keyDown(screen.getByRole('tab', { name: 'Plumbing' }), { key: 'Home' })
    expect(screen.getByRole('tab', { name: 'Plumbing' })).toHaveFocus()
  })

  it('marks the active row with aria-current and resets the preview trade when the active trade changes', () => {
    const { rerender } = setup({ activeService: 'Drain Cleaning' })
    fireEvent.click(screen.getByRole('button', { name: /change/i }))
    expect(screen.getByRole('link', { name: /drain cleaning/i })).toHaveAttribute('aria-current', 'page')

    rerender(
      <ContentFilterNavSheet
        trades={trades}
        currentTradeKey="hvac"
        activeService={null}
        hrefFor={hrefFor}
        dialogTitle="Browse topics"
      />
    )
    expect(screen.getByRole('button', { name: /change/i })).toHaveTextContent('HVAC')
  })

  it('never renders a row link built from an unsafe hrefFor result', () => {
    setup({ hrefFor: () => 'javascript:alert(1)' })
    fireEvent.click(screen.getByRole('button', { name: /change/i }))
    expect(screen.queryByRole('link')).toBeNull()
  })
})
