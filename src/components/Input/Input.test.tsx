import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Field, Input, Textarea, Select } from './Input'

// =============================================================================
// Field
// =============================================================================

describe('Field', () => {
  it('renders label text', () => {
    render(
      <Field label="Customer name" id="x">
        <Input id="x" />
      </Field>,
    )
    expect(screen.getByText('Customer name')).toBeInTheDocument()
  })

  it('renders required asterisk when required', () => {
    render(
      <Field label="Email" required id="x">
        <Input id="x" />
      </Field>,
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders hint text', () => {
    render(
      <Field label="Name" hint="As on invoice" id="x">
        <Input id="x" />
      </Field>,
    )
    expect(screen.getByText('As on invoice')).toBeInTheDocument()
  })

  it('associates hint text with the input via aria-describedby', () => {
    render(
      <Field label="Name" hint="As on invoice" id="x">
        <Input id="x" />
      </Field>,
    )
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'x-hint')
    expect(screen.getByText('As on invoice')).toHaveAttribute('id', 'x-hint')
  })

  it('renders error message with role=alert', () => {
    render(
      <Field label="Email" error="Invalid email" id="x">
        <Input id="x" />
      </Field>,
    )
    const err = screen.getByRole('alert')
    expect(err).toHaveTextContent('Invalid email')
  })

  it('associates error text with the input via aria-describedby', () => {
    render(
      <Field label="Email" error="Invalid email" id="x">
        <Input id="x" />
      </Field>,
    )
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'x-error')
    expect(screen.getByRole('alert')).toHaveAttribute('id', 'x-error')
  })

  it('hides hint when error is shown', () => {
    render(
      <Field label="Email" hint="Enter your email" error="Invalid email" id="x">
        <Input id="x" />
      </Field>,
    )
    expect(screen.queryByText('Enter your email')).not.toBeInTheDocument()
  })

  it('associates label with input via htmlFor', () => {
    render(
      <Field label="Name" id="name-input">
        <Input id="name-input" />
      </Field>,
    )
    const label = screen.getByText('Name')
    expect(label).toHaveAttribute('for', 'name-input')
  })
})

// =============================================================================
// Input
// =============================================================================

describe('Input', () => {
  it('renders an <input> element', () => {
    render(<Input aria-label="test" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('applies base pz-input class', () => {
    render(<Input aria-label="test" />)
    expect(screen.getByRole('textbox')).toHaveClass('pz-input')
  })

  it('applies size class for sm', () => {
    render(<Input size="sm" aria-label="test" />)
    expect(screen.getByRole('textbox')).toHaveClass('pz-input--sm')
  })

  it('applies size class for lg', () => {
    render(<Input size="lg" aria-label="test" />)
    expect(screen.getByRole('textbox')).toHaveClass('pz-input--lg')
  })

  it('does not apply size class for md (default)', () => {
    render(<Input size="md" aria-label="test" />)
    expect(screen.getByRole('textbox')).not.toHaveClass('pz-input--md')
  })

  it('sets aria-invalid when hasError', () => {
    render(<Input hasError aria-label="test" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('wraps in pz-input-group when leadIcon provided', () => {
    const { container } = render(<Input leadIcon={<span>icon</span>} aria-label="test" />)
    expect(container.querySelector('.pz-input-group')).toBeInTheDocument()
    expect(container.querySelector('.pz-input-group__icon--lead')).toBeInTheDocument()
  })

  it('wraps in pz-input-group when trailIcon provided', () => {
    const { container } = render(<Input trailIcon={<span>icon</span>} aria-label="test" />)
    expect(container.querySelector('.pz-input-group')).toBeInTheDocument()
    expect(container.querySelector('.pz-input-group__icon--trail')).toBeInTheDocument()
  })

  it('applies pz-input--with-lead when leadIcon provided', () => {
    render(<Input leadIcon={<span>icon</span>} aria-label="test" />)
    expect(screen.getByRole('textbox')).toHaveClass('pz-input--with-lead')
  })

  it('applies pz-input--with-trail when trailIcon provided', () => {
    render(<Input trailIcon={<span>icon</span>} aria-label="test" />)
    expect(screen.getByRole('textbox')).toHaveClass('pz-input--with-trail')
  })

  it('does not wrap in group when no icons', () => {
    const { container } = render(<Input aria-label="test" />)
    expect(container.querySelector('.pz-input-group')).not.toBeInTheDocument()
  })

  it('forwards ref to input element', () => {
    let inputEl: HTMLInputElement | null = null
    render(
      <Input
        ref={(el) => {
          inputEl = el
        }}
        aria-label="test"
      />,
    )
    expect(inputEl).toBeInstanceOf(HTMLInputElement)
  })

  it('is disabled when disabled prop set', () => {
    render(<Input disabled aria-label="test" />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('calls onChange handler', () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} aria-label="test" />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})

// =============================================================================
// Textarea
// =============================================================================

describe('Textarea', () => {
  it('renders a <textarea> element', () => {
    render(<Textarea aria-label="notes" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('applies pz-textarea class', () => {
    render(<Textarea aria-label="notes" />)
    expect(screen.getByRole('textbox')).toHaveClass('pz-textarea')
  })

  it('sets aria-invalid when hasError', () => {
    render(<Textarea hasError aria-label="notes" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('uses Field description ids', () => {
    render(
      <Field label="Notes" hint="Optional context" id="notes">
        <Textarea id="notes" />
      </Field>,
    )
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'notes-hint')
  })

  it('forwards ref to textarea element', () => {
    let textareaEl: HTMLTextAreaElement | null = null
    render(
      <Textarea
        ref={(el) => {
          textareaEl = el
        }}
        aria-label="notes"
      />,
    )
    expect(textareaEl).toBeInstanceOf(HTMLTextAreaElement)
  })
})

// =============================================================================
// Select
// =============================================================================

describe('Select', () => {
  it('renders a <select> element', () => {
    render(
      <Select aria-label="trade">
        <option value="hvac">HVAC</option>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('applies pz-select class', () => {
    render(
      <Select aria-label="trade">
        <option>HVAC</option>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toHaveClass('pz-select')
  })

  it('sets aria-invalid when hasError', () => {
    render(
      <Select hasError aria-label="trade">
        <option>HVAC</option>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('uses Field description ids', () => {
    render(
      <Field label="Trade" error="Choose a trade" id="trade">
        <Select id="trade">
          <option>HVAC</option>
        </Select>
      </Field>,
    )
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-describedby', 'trade-error')
  })

  it('renders children options', () => {
    render(
      <Select aria-label="trade">
        <option value="hvac">HVAC</option>
        <option value="plumbing">Plumbing</option>
      </Select>,
    )
    expect(screen.getByRole('option', { name: 'HVAC' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Plumbing' })).toBeInTheDocument()
  })

  it('forwards ref to select element', () => {
    let selectEl: HTMLSelectElement | null = null
    render(
      <Select
        ref={(el) => {
          selectEl = el
        }}
        aria-label="trade"
      >
        <option>HVAC</option>
      </Select>,
    )
    expect(selectEl).toBeInstanceOf(HTMLSelectElement)
  })
})
