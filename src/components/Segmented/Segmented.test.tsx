import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Segmented } from './Segmented'

const options = [
  { value: 'blog', label: 'Blog' },
  { value: 'social', label: 'Social' },
  { value: 'email', label: 'Email' },
] as const

describe('Segmented', () => {
  it('renders all options', () => {
    render(<Segmented value="blog" onChange={() => {}} options={[...options]} aria-label="Mode" />)
    expect(screen.getByRole('radio', { name: 'Blog' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Social' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Email' })).toBeInTheDocument()
  })

  it('applies pz-segmented class', () => {
    const { container } = render(
      <Segmented value="blog" onChange={() => {}} options={[...options]} aria-label="Mode" />
    )
    expect(container.querySelector('.pz-segmented')).toBeInTheDocument()
  })

  it('has role="radiogroup"', () => {
    render(<Segmented value="blog" onChange={() => {}} options={[...options]} aria-label="Mode" />)
    expect(screen.getByRole('radiogroup', { name: 'Mode' })).toBeInTheDocument()
  })

  it('marks selected option with aria-checked="true"', () => {
    render(<Segmented value="social" onChange={() => {}} options={[...options]} aria-label="Mode" />)
    expect(screen.getByRole('radio', { name: 'Social' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Blog' })).toHaveAttribute('aria-checked', 'false')
  })

  it('applies selected class to current option', () => {
    const { container } = render(
      <Segmented value="blog" onChange={() => {}} options={[...options]} aria-label="Mode" />
    )
    expect(container.querySelector('.pz-segmented__option--selected')).toBeInTheDocument()
  })

  it('calls onChange with correct value on click', () => {
    const onChange = vi.fn()
    render(<Segmented value="blog" onChange={onChange} options={[...options]} aria-label="Mode" />)
    fireEvent.click(screen.getByRole('radio', { name: 'Social' }))
    expect(onChange).toHaveBeenCalledWith('social')
  })

  it('does not call onChange for disabled option', () => {
    const onChange = vi.fn()
    const opts = [...options, { value: 'push' as const, label: 'Push', disabled: true }]
    render(<Segmented value="blog" onChange={onChange} options={opts} aria-label="Mode" />)
    fireEvent.click(screen.getByRole('radio', { name: 'Push' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not apply size modifier for md (default)', () => {
    const { container } = render(
      <Segmented value="blog" onChange={() => {}} options={[...options]} aria-label="Mode" />
    )
    expect(container.querySelector('.pz-segmented--md')).not.toBeInTheDocument()
  })

  it('applies pz-segmented--sm for sm size', () => {
    const { container } = render(
      <Segmented value="blog" onChange={() => {}} options={[...options]} size="sm" aria-label="Mode" />
    )
    expect(container.querySelector('.pz-segmented--sm')).toBeInTheDocument()
  })

  it('moves to the next enabled option with ArrowRight', () => {
    const onChange = vi.fn()
    render(<Segmented value="blog" onChange={onChange} options={[...options]} aria-label="Mode" />)
    fireEvent.keyDown(screen.getByRole('radiogroup', { name: 'Mode' }), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith('social')
  })

  it('moves to the previous enabled option with ArrowLeft', () => {
    const onChange = vi.fn()
    render(<Segmented value="blog" onChange={onChange} options={[...options]} aria-label="Mode" />)
    fireEvent.keyDown(screen.getByRole('radiogroup', { name: 'Mode' }), { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenCalledWith('email')
  })

  it('supports Home and End keyboard navigation', () => {
    const onChange = vi.fn()
    render(<Segmented value="social" onChange={onChange} options={[...options]} aria-label="Mode" />)

    fireEvent.keyDown(screen.getByRole('radiogroup', { name: 'Mode' }), { key: 'Home' })
    expect(onChange).toHaveBeenCalledWith('blog')

    fireEvent.keyDown(screen.getByRole('radiogroup', { name: 'Mode' }), { key: 'End' })
    expect(onChange).toHaveBeenCalledWith('email')
  })

  it('skips disabled options during keyboard navigation', () => {
    const onChange = vi.fn()
    const opts = [
      { value: 'blog', label: 'Blog' },
      { value: 'social', label: 'Social', disabled: true },
      { value: 'email', label: 'Email' },
    ] as const
    render(<Segmented value="blog" onChange={onChange} options={[...opts]} aria-label="Mode" />)

    fireEvent.keyDown(screen.getByRole('radiogroup', { name: 'Mode' }), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith('email')
  })

  it('ignores keyboard navigation when every option is disabled', () => {
    const onChange = vi.fn()
    const opts = [
      { value: 'blog', label: 'Blog', disabled: true },
      { value: 'social', label: 'Social', disabled: true },
    ] as const
    render(<Segmented value="blog" onChange={onChange} options={[...opts]} aria-label="Mode" />)

    fireEvent.keyDown(screen.getByRole('radiogroup', { name: 'Mode' }), { key: 'ArrowRight' })
    expect(onChange).not.toHaveBeenCalled()
  })
})
