import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch, Slider } from './Switch'

// =============================================================================
// Switch
// =============================================================================

describe('Switch', () => {
  it('renders a checkbox with role=switch', () => {
    render(<Switch>Toggle</Switch>)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('renders label text', () => {
    render(<Switch>Notify me</Switch>)
    expect(screen.getByText('Notify me')).toBeInTheDocument()
  })

  it('applies pz-switch class on label', () => {
    const { container } = render(<Switch>Toggle</Switch>)
    expect(container.querySelector('.pz-switch')).toBeInTheDocument()
  })

  it('renders track and thumb', () => {
    const { container } = render(<Switch>Toggle</Switch>)
    expect(container.querySelector('.pz-switch__track')).toBeInTheDocument()
    expect(container.querySelector('.pz-switch__thumb')).toBeInTheDocument()
  })

  it('is unchecked by default', () => {
    render(<Switch>Toggle</Switch>)
    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  it('is checked when defaultChecked', () => {
    render(<Switch defaultChecked>Toggle</Switch>)
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('is disabled when disabled prop set', () => {
    render(<Switch disabled>Toggle</Switch>)
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('calls onChange when clicked', () => {
    const onChange = vi.fn()
    render(<Switch onChange={onChange}>Toggle</Switch>)
    fireEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('associates label with input', () => {
    const { container } = render(<Switch>Toggle</Switch>)
    const label = container.querySelector('label')
    const input = container.querySelector('input')
    expect(label?.htmlFor).toBe(input?.id)
    expect(input?.id).toBeTruthy()
  })

  it('uses provided id', () => {
    render(<Switch id="my-switch">Toggle</Switch>)
    expect(screen.getByRole('switch')).toHaveAttribute('id', 'my-switch')
  })

  it('forwards ref to input element', () => {
    let el: HTMLInputElement | null = null
    render(
      <Switch ref={(r) => { el = r }}>Toggle</Switch>,
    )
    expect(el).toBeInstanceOf(HTMLInputElement)
  })
})

// =============================================================================
// Slider
// =============================================================================

describe('Slider', () => {
  it('renders a range input', () => {
    render(<Slider aria-label="Volume" />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('applies pz-slider class', () => {
    render(<Slider aria-label="Volume" />)
    expect(screen.getByRole('slider')).toHaveClass('pz-slider')
  })

  it('defaults min to 0, max to 100, step to 1', () => {
    render(<Slider aria-label="Volume" />)
    const input = screen.getByRole('slider')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '100')
    expect(input).toHaveAttribute('step', '1')
  })

  it('accepts custom min, max, step', () => {
    render(<Slider aria-label="Volume" min={10} max={200} step={5} />)
    const input = screen.getByRole('slider')
    expect(input).toHaveAttribute('min', '10')
    expect(input).toHaveAttribute('max', '200')
    expect(input).toHaveAttribute('step', '5')
  })

  it('calls onChange when value changes', () => {
    const onChange = vi.fn()
    render(<Slider aria-label="Volume" defaultValue={30} onChange={onChange} />)
    // React maps the native input event to onChange for range inputs
    fireEvent.input(screen.getByRole('slider'), { target: { value: '50' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('forwards ref to input element', () => {
    let el: HTMLInputElement | null = null
    render(
      <Slider aria-label="Volume" ref={(r) => { el = r }} />,
    )
    expect(el).toBeInstanceOf(HTMLInputElement)
  })
})
