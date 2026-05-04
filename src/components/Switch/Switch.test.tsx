import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from './Switch'

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
