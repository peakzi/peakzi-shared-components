/** Display US/NANP numbers progressively without truncating extra digits or rewriting international numbers. */
export function formatPhone(value: string): string {
  const text = value.trim()
  if (!/^\+?[\d\s().-]*$/.test(text)) return value
  const digits = text.replace(/\D/g, '')
  if (text.startsWith('+') && !text.startsWith('+1')) return value
  const country = text.startsWith('+1') || (digits.length === 11 && digits.startsWith('1'))
  const local = country ? digits.slice(1) : digits
  if (local.length > 10) return value
  if (!local) return country ? '+1' : ''
  const prefix = country ? '+1 ' : ''
  if (local.length <= 3) return `${prefix}(${local}`
  if (local.length <= 6) return `${prefix}(${local.slice(0, 3)}) ${local.slice(3)}`
  return `${prefix}(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`
}

/** Restore the editing position by counting digits instead of formatting punctuation. */
export function phoneCaret(value: string, formatted: string, position: number): number {
  if (position === value.length) return formatted.length
  const count = value.slice(0, position).replace(/\D/g, '').length
  if (!count) return position === 0 ? 0 : formatted.startsWith('(') ? 1 : 0
  let seen = 0
  for (let index = 0; index < formatted.length; index++) {
    if (/\d/.test(formatted[index]!) && ++seen === count) return index + 1
  }
  return formatted.length
}
