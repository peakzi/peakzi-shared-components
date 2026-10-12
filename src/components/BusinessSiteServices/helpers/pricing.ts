import type { BusinessSiteServiceItem } from './types'

export interface ServicePriceColumn { id: string; label: string }
export interface ServicePriceRow {
  service: BusinessSiteServiceItem
  prices: ReadonlyMap<string, readonly string[]>
}

const STANDARD_COLUMNS: readonly ServicePriceColumn[] = [
  { id: 'repair', label: 'Repair' },
  { id: 'install', label: 'Install' },
  { id: 'maintain', label: 'Maintain' },
]

const PRICE_ALIASES: ReadonlyMap<string, string> = new Map([
  ['repair', 'repair'],
  ['replace/install', 'install'], ['replacement/install', 'install'],
  ['install', 'install'], ['installation', 'install'], ['replace', 'install'], ['replacement', 'install'],
  ['maintain', 'maintain'], ['maintenance', 'maintain'],
])

/** Preserve supplied price text and unknown action columns; never invent a price. */
export function servicePricing(services: readonly BusinessSiteServiceItem[]) {
  const additionalColumns = new Map<string, ServicePriceColumn>()
  const rows: ServicePriceRow[] = services.map((service) => {
    const prices = new Map<string, string[]>()
    for (const tier of service.tiers ?? []) {
      const label = typeof tier?.label === 'string' ? tier.label.trim() : ''
      const value = typeof tier?.value === 'string' ? tier.value.trim() : ''
      if (!label || !value) continue
      const normalized = label.toLowerCase().replace(/\s*\/\s*/g, '/')
      const standard = PRICE_ALIASES.get(normalized)
      const id = standard ?? `custom:${normalized}`
      if (!standard && !additionalColumns.has(id)) additionalColumns.set(id, { id, label })
      prices.set(id, [...(prices.get(id) ?? []), value])
    }
    return { service, prices }
  })
  return {
    rows,
    columns: [...STANDARD_COLUMNS, ...additionalColumns.values()],
    hasPrices: rows.some((row) => row.prices.size > 0),
  }
}
