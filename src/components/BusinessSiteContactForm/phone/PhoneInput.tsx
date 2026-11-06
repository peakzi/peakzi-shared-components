import { useLayoutEffect, useRef } from 'react'
import { Input, type InputProps } from '../../Input'
import { formatPhone, phoneCaret } from './phoneFormat'

interface Props extends Omit<InputProps, 'value' | 'onChange'> {
  value: string
  onValueChange: (value: string) => void
}

/** Presentation-only mask: consumer callbacks retain the entered phone value. */
export function PhoneInput({ value, onValueChange, onKeyDown, ...props }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const selection = useRef<[number, number] | null>(null)
  const formatted = formatPhone(value)

  useLayoutEffect(() => {
    if (selection.current && document.activeElement === input.current) input.current?.setSelectionRange(...selection.current)
    selection.current = null
  })

  const change = (next: string, start: number, end: number) => {
    const display = formatPhone(next)
    selection.current = display === next ? [start, end] : [phoneCaret(next, display, start), phoneCaret(next, display, end)]
    onValueChange(display === '' ? '' : next)
  }

  return <Input {...props} ref={input} value={formatted}
    onChange={(event) => {
      const element = event.currentTarget
      change(element.value, element.selectionStart ?? element.value.length, element.selectionEnd ?? element.value.length)
    }}
    onKeyDown={(event) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || !['Backspace', 'Delete'].includes(event.key)) return
      const element = event.currentTarget
      const start = element.selectionStart ?? 0
      if (start !== element.selectionEnd || !/^(?:\+1 )?\(/.test(element.value) || formatPhone(element.value) !== element.value) return
      const direction = event.key === 'Backspace' ? -1 : 1
      let index = direction < 0 ? start - 1 : start
      if (!element.value[index] || /\d/.test(element.value[index]!)) return
      while (index >= 0 && index < element.value.length && !/\d/.test(element.value[index]!)) index += direction
      if (index < 0 || index >= element.value.length) return
      event.preventDefault()
      const next = element.value.slice(0, index) + element.value.slice(index + 1)
      const caret = direction < 0 ? index : start
      change(next, caret, caret)
    }} />
}
