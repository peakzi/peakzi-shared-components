import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Slider } from './Slider'

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

  it('applies size modifier class for sm', () => {
    render(<Slider aria-label="Volume" size="sm" />)
    expect(screen.getByRole('slider')).toHaveClass('pz-slider--sm')
  })

  it('applies size modifier class for lg', () => {
    render(<Slider aria-label="Volume" size="lg" />)
    expect(screen.getByRole('slider')).toHaveClass('pz-slider--lg')
  })

  it('does not apply size modifier for md (default)', () => {
    render(<Slider aria-label="Volume" size="md" />)
    expect(screen.getByRole('slider')).not.toHaveClass('pz-slider--md')
  })

  it('renders label when text prop provided', () => {
    render(<Slider text="Visibility threshold" aria-label="Visibility threshold" />)
    expect(screen.getByText('Visibility threshold')).toBeInTheDocument()
  })

  it('wraps in pz-slider-field when text provided', () => {
    const { container } = render(<Slider text="Volume" aria-label="Volume" />)
    expect(container.querySelector('.pz-slider-field')).toBeInTheDocument()
    expect(container.querySelector('.pz-slider-field__label')).toBeInTheDocument()
  })

  it('does not wrap in pz-slider-field when text omitted', () => {
    const { container } = render(<Slider aria-label="Volume" />)
    expect(container.querySelector('.pz-slider-field')).not.toBeInTheDocument()
  })

  it('associates label with input via htmlFor', () => {
    const { container } = render(<Slider text="Volume" aria-label="Volume" />)
    const label = container.querySelector('label')
    const input = container.querySelector('input')
    expect(label?.htmlFor).toBe(input?.id)
    expect(input?.id).toBeTruthy()
  })

  it('uses top layout by default (no modifier class)', () => {
    const { container } = render(<Slider text="Volume" aria-label="Volume" />)
    const field = container.querySelector('.pz-slider-field')
    expect(field).not.toHaveClass('pz-slider-field--bottom')
    expect(field).not.toHaveClass('pz-slider-field--left')
    expect(field).not.toHaveClass('pz-slider-field--right')
  })

  it('applies bottom modifier class', () => {
    const { container } = render(<Slider text="Volume" textPosition="bottom" aria-label="Volume" />)
    expect(container.querySelector('.pz-slider-field--bottom')).toBeInTheDocument()
  })

  it('applies left modifier class', () => {
    const { container } = render(<Slider text="Volume" textPosition="left" aria-label="Volume" />)
    expect(container.querySelector('.pz-slider-field--left')).toBeInTheDocument()
  })

  it('applies right modifier class', () => {
    const { container } = render(<Slider text="Volume" textPosition="right" aria-label="Volume" />)
    expect(container.querySelector('.pz-slider-field--right')).toBeInTheDocument()
  })

  it('calls onChange when value changes', () => {
    const onChange = vi.fn()
    render(<Slider aria-label="Volume" defaultValue={30} onChange={onChange} />)
    fireEvent.input(screen.getByRole('slider'), { target: { value: '50' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('forwards ref to input element', () => {
    let el: HTMLInputElement | null = null
    render(<Slider aria-label="Volume" ref={(r) => { el = r }} />)
    expect(el).toBeInstanceOf(HTMLInputElement)
  })
})
