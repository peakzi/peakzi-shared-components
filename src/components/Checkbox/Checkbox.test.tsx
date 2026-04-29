import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox, Radio } from './Checkbox'

// =============================================================================
// Checkbox
// =============================================================================

describe('Checkbox', () => {
  it('renders a checkbox input', () => {
    render(<Checkbox>Option A</Checkbox>)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders label text', () => {
    render(<Checkbox>Email me updates</Checkbox>)
    expect(screen.getByText('Email me updates')).toBeInTheDocument()
  })

  it('applies pz-checkbox class on label', () => {
    const { container } = render(<Checkbox>Option</Checkbox>)
    expect(container.querySelector('.pz-checkbox')).toBeInTheDocument()
  })

  it('renders the visual checkbox box', () => {
    const { container } = render(<Checkbox>Option</Checkbox>)
    expect(container.querySelector('.pz-checkbox__box')).toBeInTheDocument()
  })

  it('is unchecked by default', () => {
    render(<Checkbox>Option</Checkbox>)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('renders as checked when defaultChecked', () => {
    render(<Checkbox defaultChecked>Option</Checkbox>)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Checkbox disabled>Option</Checkbox>)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('calls onChange when clicked', () => {
    const onChange = vi.fn()
    render(<Checkbox onChange={onChange}>Option</Checkbox>)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('associates label with input via generated id', () => {
    const { container } = render(<Checkbox>Option</Checkbox>)
    const label = container.querySelector('label')
    const input = container.querySelector('input')
    expect(label?.htmlFor).toBe(input?.id)
    expect(input?.id).toBeTruthy()
  })

  it('uses provided id when given', () => {
    render(<Checkbox id="my-check">Option</Checkbox>)
    const input = screen.getByRole('checkbox')
    expect(input).toHaveAttribute('id', 'my-check')
  })

  it('forwards ref to input element', () => {
    let el: HTMLInputElement | null = null
    render(
      <Checkbox ref={(r) => { el = r }}>Option</Checkbox>,
    )
    expect(el).toBeInstanceOf(HTMLInputElement)
  })

  it('accepts custom className', () => {
    const { container } = render(<Checkbox className="custom">Option</Checkbox>)
    expect(container.querySelector('.pz-checkbox.custom')).toBeInTheDocument()
  })
})

// =============================================================================
// Radio
// =============================================================================

describe('Radio', () => {
  it('renders a radio input', () => {
    render(<Radio name="test">Option A</Radio>)
    expect(screen.getByRole('radio')).toBeInTheDocument()
  })

  it('renders label text', () => {
    render(<Radio name="test">Contractor</Radio>)
    expect(screen.getByText('Contractor')).toBeInTheDocument()
  })

  it('applies pz-radio class on label', () => {
    const { container } = render(<Radio name="test">Option</Radio>)
    expect(container.querySelector('.pz-radio')).toBeInTheDocument()
  })

  it('renders the visual radio box', () => {
    const { container } = render(<Radio name="test">Option</Radio>)
    expect(container.querySelector('.pz-radio__box')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Radio name="test" disabled>Option</Radio>)
    expect(screen.getByRole('radio')).toBeDisabled()
  })

  it('calls onChange when selected', () => {
    const onChange = vi.fn()
    render(<Radio name="test" onChange={onChange}>Option</Radio>)
    fireEvent.click(screen.getByRole('radio'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('associates label with input via generated id', () => {
    const { container } = render(<Radio name="test">Option</Radio>)
    const label = container.querySelector('label')
    const input = container.querySelector('input')
    expect(label?.htmlFor).toBe(input?.id)
  })

  it('forwards ref to input element', () => {
    let el: HTMLInputElement | null = null
    render(
      <Radio name="test" ref={(r) => { el = r }}>Option</Radio>,
    )
    expect(el).toBeInstanceOf(HTMLInputElement)
  })
})
