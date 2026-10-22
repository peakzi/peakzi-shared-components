export const hasNumber = (value: number | null | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value)

export const money = (value: number) => `$${Math.round(Math.abs(value)).toLocaleString('en-US')}`

export const range = (low: number, high: number) => (low === high ? money(low) : `${money(low)} – ${money(high)}`)

export const percent = (value: number) => `${Math.round(value * 10) / 10}%`

// Keeps acronyms ("HVAC", "AC repair") intact when a label is used mid-sentence.
export const lowercaseWords = (label: string) =>
  label.replace(/\S+/g, (word) => (word.length > 1 && word === word.toUpperCase() ? word : word.toLowerCase()))
