import { Loader2, MapPin } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Field, Input } from '../../Input'
import { DEFAULT_DEBOUNCE_MS } from '../helpers/validation'
import type { BusinessSiteContactFormAddressSearch, BusinessSiteContactFormAddressSuggestion } from '../helpers/types'

/** Trailing in-field loader shown while a backend call for the field is in flight; typing stays enabled. */
export function InputSpinner() {
  return <span className="pz-business-contact-form__input-spinner" aria-hidden="true"><Loader2 size={16} /></span>
}

interface AddressFieldProps {
  id: string
  label: string
  value: string
  error?: string | undefined
  hint?: string | undefined
  placeholder?: string | undefined
  required?: boolean
  maxLength?: number
  disabled: boolean
  provider?: BusinessSiteContactFormAddressSearch | undefined
  onChange: (value: string) => void
}

function validSuggestions(items: readonly BusinessSiteContactFormAddressSuggestion[]) {
  const seen = new Set<string>()
  return (Array.isArray(items) ? items : []).filter((item): item is BusinessSiteContactFormAddressSuggestion => {
    if (!item || typeof item.id !== 'string' || !item.id.trim() || typeof item.label !== 'string' || !item.label.trim() || seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

/** API-neutral autocomplete: the host maps its backend response to suggestions. */
export function AddressField({ id, label, value, error, hint, placeholder, required = false, maxLength, disabled, provider, onChange }: AddressFieldProps) {
  const [focused, setFocused] = useState(false)
  const [dismissedQuery, setDismissedQuery] = useState<string | null>(null)
  const [active, setActive] = useState(-1)
  const [result, setResult] = useState<{ query: string; items: readonly BusinessSiteContactFormAddressSuggestion[]; error: string }>({ query: '', items: [], error: '' })
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const query = value.trim()
  const minLength = Number.isFinite(provider?.minLength) ? Math.max(1, provider!.minLength!) : 3
  const delay = Number.isFinite(provider?.debounceMs) ? Math.max(0, provider!.debounceMs!) : DEFAULT_DEBOUNCE_MS
  const search = provider?.search
  const enabled = Boolean(search && focused && !disabled && query.length >= minLength && dismissedQuery !== query)
  const current = result.query === query
  const items = current ? result.items : []
  const lookupError = current ? result.error : ''
  const pending = enabled && !current
  const open = enabled && !lookupError
  const listId = `${id}-suggestions`

  useEffect(() => {
    if (!enabled || !search) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const suggestions = await search(query, { signal: controller.signal })
        if (!controller.signal.aborted) setResult({ query, items: validSuggestions(suggestions), error: '' })
      } catch {
        if (!controller.signal.aborted) setResult({ query, items: [], error: 'Address search is unavailable. Please enter your address manually.' })
      }
    }, delay)
    return () => { clearTimeout(timer); controller.abort() }
  }, [enabled, search, query, delay])

  useEffect(() => {
    if (open && active >= 0) rootRef.current?.querySelectorAll<HTMLElement>('[role="option"]')[active]?.scrollIntoView?.({ block: 'nearest' })
  }, [active, open, id])

  function select(suggestion: BusinessSiteContactFormAddressSuggestion) {
    setDismissedQuery(suggestion.label.trim())
    setActive(-1)
    onChange(suggestion.label.trim())
    inputRef.current?.focus()
    provider?.onSelect?.(suggestion)
  }

  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      event.stopPropagation()
      setDismissedQuery(query)
      setActive(-1)
    } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && items.length) {
      event.preventDefault()
      setDismissedQuery(null)
      setFocused(true)
      setActive((index) => event.key === 'ArrowDown' ? (index + 1) % items.length : index <= 0 ? items.length - 1 : index - 1)
    } else if (event.key === 'Enter' && open && items[active]) {
      event.preventDefault()
      select(items[active])
    }
  }

  const message = error || lookupError
  return <Field id={id} label={label} required={required} error={message || ''} hint={hint || ''} className="pz-business-contact-form__address-field">
    <div ref={rootRef} className="pz-business-contact-form__control pz-business-contact-form__address"
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) { setFocused(false); setActive(-1) } }}>
      <span className="pz-business-contact-form__input-icon" aria-hidden="true"><MapPin size={18} /></span>
      <Input ref={inputRef} id={id} name="address" value={value} required={required} maxLength={maxLength} disabled={disabled} autoComplete={provider ? 'off' : 'street-address'}
        placeholder={placeholder ?? (provider ? 'Search for your service address' : undefined)}
        role={provider ? 'combobox' : undefined} aria-autocomplete={provider ? 'list' : undefined}
        aria-expanded={provider ? open : undefined} aria-controls={open ? listId : undefined}
        aria-activedescendant={open && items[active] ? `${id}-option-${active}` : undefined}
        aria-busy={pending || undefined} hasError={Boolean(message)} onFocus={() => setFocused(true)} onKeyDown={keyDown}
        onChange={(event) => { setActive(-1); setDismissedQuery(null); onChange(event.currentTarget.value) }} />
      {pending && <InputSpinner />}
      {open && <div className="pz-business-contact-form__dropdown">
        {pending && <p role="status" className="pz-business-contact-form__search-status">Searching addresses…</p>}
        <ul id={listId} role="listbox" aria-label="Suggested service addresses" aria-busy={pending}>
          {items.map((suggestion, index) => <li role="presentation" key={suggestion.id}>
            <button id={`${id}-option-${index}`} type="button" role="option" tabIndex={-1} aria-selected={active === index}
              onMouseDown={(event) => event.preventDefault()} onClick={() => select(suggestion)}>
              <MapPin size={16} aria-hidden="true" />
              <span className="pz-business-contact-form__option-text">
                <span>{suggestion.label}</span>
                {suggestion.description?.trim() && <small>{suggestion.description}</small>}
              </span>
            </button>
          </li>)}
        </ul>
        {!pending && !items.length && <p role="status" className="pz-business-contact-form__search-status">No matching addresses. You can enter your address manually.</p>}
      </div>}
    </div>
  </Field>
}
