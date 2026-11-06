import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { PhoneInput } from './PhoneInput'
import { formatPhone } from './phoneFormat'

function Phone({ initial = '' }: { initial?: string }) {
  const [value, setValue] = useState(initial)
  return <><PhoneInput aria-label="Phone" type="tel" value={value} onValueChange={setValue} /><output>{value}</output></>
}

describe('US phone formatting', () => {
  it.each([
    ['', ''], ['5', '(5'], ['512', '(512'], ['5125', '(512) 5'], ['512555', '(512) 555'],
    ['5125550', '(512) 555-0'], ['5125550123', '(512) 555-0123'],
    ['+15125550123', '+1 (512) 555-0123'], ['15125550123', '+1 (512) 555-0123'],
    ['+44 20 7946 0958', '+44 20 7946 0958'], ['51255501234', '51255501234'],
    ['555-CALL-NOW', '555-CALL-NOW'],
  ])('formats %j as %j', (value, expected) => { expect(formatPhone(value)).toBe(expected) })

  it('formats each typed digit and lets the user backspace all the way to empty', async () => {
    const user = userEvent.setup()
    render(<Phone />)
    const input = screen.getByRole('textbox', { name: 'Phone' })
    await user.type(input, '512')
    expect(input).toHaveValue('(512')
    await user.type(input, '5550123')
    expect(input).toHaveValue('(512) 555-0123')
    await user.keyboard('{Backspace>10/}')
    expect(input).toHaveValue('')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('supports editing in the middle without moving the caret to the end', async () => {
    const user = userEvent.setup()
    render(<Phone initial="5125550123" />)
    const input = screen.getByRole('textbox', { name: 'Phone' }) as HTMLInputElement
    await user.click(input)
    input.setSelectionRange(2, 3)
    await user.keyboard('9')
    expect(input).toHaveValue('(592) 555-0123')
    expect(input.selectionStart).toBe(3)
  })

  it('backspaces across formatting separators and supports selection replacement', async () => {
    const user = userEvent.setup()
    render(<Phone initial="5125550123" />)
    const input = screen.getByRole('textbox', { name: 'Phone' }) as HTMLInputElement
    await user.click(input)
    input.setSelectionRange(6, 6)
    await user.keyboard('{Backspace}')
    expect(input).toHaveValue('(515) 550-123')
    expect(input.selectionStart).toBe(3)
    await user.keyboard('{Control>}a{/Control}')
    await user.paste('2145550199')
    expect(input).toHaveValue('(214) 555-0199')
  })

  it('keeps international input and callback values intact', () => {
    render(<Phone initial="+44 20 7946 0958" />)
    const input = screen.getByRole('textbox', { name: 'Phone' })
    expect(input).toHaveValue('+44 20 7946 0958')
    fireEvent.change(input, { target: { value: '214 555 0199' } })
    expect(input).toHaveValue('(214) 555-0199')
    expect(screen.getByRole('status')).toHaveTextContent('214 555 0199')
  })
})
