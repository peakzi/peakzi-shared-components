import { useState } from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AddressField } from './AddressField'
import type { BusinessSiteContactFormAddressSearch, BusinessSiteContactFormAddressSuggestion } from '../helpers/types'

const suggestions = [
  { id: 'one', label: '123 Oak Street, Dallas, TX 75001', description: 'Dallas, Texas' },
  { id: 'two', label: '123 Oak Avenue, Austin, TX 78701' },
]
function Example({ provider, disabled = false, onSubmit = () => {} }: {
  provider?: BusinessSiteContactFormAddressSearch | undefined; disabled?: boolean; onSubmit?: () => void
}) {
  const [value, setValue] = useState('')
  return <form onSubmit={(event) => { event.preventDefault(); onSubmit() }}>
    <AddressField id="test-address" label="Service address" value={value} onChange={setValue} disabled={disabled} provider={provider} />
  </form>
}
function query(value = '123') {
  const input = screen.getByLabelText('Service address')
  fireEvent.focus(input)
  fireEvent.change(input, { target: { value } })
  return input
}
afterEach(() => vi.useRealTimers())

describe('contact address search', () => {
  it('keeps manual entry when a consumer has not supplied a search API', () => {
    render(<Example />)
    expect(screen.getByLabelText('Service address')).toHaveAttribute('autocomplete', 'street-address')
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    query('An address entered manually')
    expect(screen.getByLabelText('Service address')).toHaveValue('An address entered manually')
  })

  it('debounces requests and does not search below the configured minimum length', async () => {
    vi.useFakeTimers()
    const search = vi.fn(() => suggestions)
    render(<Example provider={{ search, debounceMs: 50 }} />)
    const input = query('12')
    await act(async () => vi.advanceTimersByTime(100))
    expect(search).not.toHaveBeenCalled()
    fireEvent.change(input, { target: { value: '123' } })
    await act(async () => vi.advanceTimersByTime(25))
    fireEvent.change(input, { target: { value: '123 Oak' } })
    await act(async () => vi.advanceTimersByTime(49))
    expect(search).not.toHaveBeenCalled()
    await act(async () => vi.advanceTimersByTime(1))
    expect(search).toHaveBeenCalledOnce()
    expect(search).toHaveBeenCalledWith('123 Oak', { signal: expect.any(AbortSignal) })
    expect(screen.getAllByRole('option')).toHaveLength(2)
  })

  it('supports keyboard navigation and selection without submitting the form', async () => {
    const onSelect = vi.fn(), onSubmit = vi.fn()
    render(<Example onSubmit={onSubmit} provider={{ search: () => suggestions, onSelect, debounceMs: 0 }} />)
    const input = query()
    await screen.findAllByRole('option')
    expect(input).toHaveAttribute('aria-expanded', 'true')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input).toHaveAttribute('aria-activedescendant', 'test-address-option-1')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(input).toHaveValue(suggestions[1]!.label)
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(input).not.toHaveAttribute('aria-activedescendant')
    expect(onSelect).toHaveBeenCalledWith(suggestions[1])
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('supports pointer selection and closes the dropdown on Escape', async () => {
    render(<Example provider={{ search: () => suggestions, debounceMs: 0 }} />)
    const input = query()
    const options = await screen.findAllByRole('option')
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(screen.getByRole('listbox')).toBeVisible()
    fireEvent.mouseDown(screen.getAllByRole('option')[0]!)
    fireEvent.click(screen.getAllByRole('option')[0]!)
    expect(input).toHaveValue(suggestions[0]!.label)
    expect(options).toHaveLength(2)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('aborts old requests and ignores stale responses even if the provider ignores cancellation', async () => {
    const completions = new Map<string, (items: readonly BusinessSiteContactFormAddressSuggestion[]) => void>()
    const search = vi.fn<BusinessSiteContactFormAddressSearch['search']>((value) => new Promise((resolve) => completions.set(value, resolve)))
    render(<Example provider={{ search, debounceMs: 0 }} />)
    const input = query('123')
    await waitFor(() => expect(search).toHaveBeenCalledTimes(1))
    fireEvent.change(input, { target: { value: '456' } })
    await waitFor(() => expect(search).toHaveBeenCalledTimes(2))
    expect(search.mock.calls[0]![1].signal.aborted).toBe(true)
    await act(async () => completions.get('456')!([{ id: 'new', label: '456 Pine Road' }]))
    await act(async () => completions.get('123')!(suggestions))
    expect(screen.getByRole('option', { name: '456 Pine Road' })).toBeVisible()
    expect(screen.queryByRole('option', { name: /Oak/ })).not.toBeInTheDocument()
  })

  it('shows loading and empty results without inventing an address', async () => {
    let resolve!: (items: readonly BusinessSiteContactFormAddressSuggestion[]) => void
    render(<Example provider={{ search: () => new Promise((done) => { resolve = done }), debounceMs: 0 }} />)
    const input = query()
    expect(screen.getByText('Searching addresses…')).toBeVisible()
    await waitFor(() => expect(resolve).toBeDefined())
    await act(async () => resolve([]))
    expect(screen.getByText(/No matching addresses/)).toBeVisible()
    expect(input).toHaveValue('123')
  })

  it('shows a linked field error if lookup fails and allows manual entry', async () => {
    render(<Example provider={{ search: async () => { throw new Error('Private diagnostic') }, debounceMs: 0 }} />)
    const input = query()
    await waitFor(() => expect(input).toHaveAccessibleDescription('Address search is unavailable. Please enter your address manually.'))
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryByText('Private diagnostic')).not.toBeInTheDocument()
    expect(input).not.toBeDisabled()
  })

  it('cancels pending lookup and hides results when disabled or unmounted', async () => {
    const search = vi.fn<BusinessSiteContactFormAddressSearch['search']>(() => new Promise(() => {}))
    const provider = { search, debounceMs: 0 }
    const { rerender, unmount } = render(<Example provider={provider} />)
    query()
    await waitFor(() => expect(search).toHaveBeenCalledOnce())
    rerender(<Example provider={provider} disabled />)
    expect(search.mock.calls[0]![1].signal.aborted).toBe(true)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeDisabled()
    unmount()
  })
})
