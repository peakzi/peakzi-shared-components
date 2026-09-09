import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Stack } from './Stack'

describe('Stack', () => {
  it('applies pz-stack class', () => {
    const { container } = render(<Stack />)
    expect(container.querySelector('.pz-stack')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <Stack>
        <span>First</span>
        <span>Second</span>
      </Stack>
    )
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
  })

  it('applies pz-stack--column by default', () => {
    const { container } = render(<Stack />)
    expect(container.querySelector('.pz-stack--column')).toBeInTheDocument()
  })

  it('applies pz-stack--row when direction="row"', () => {
    const { container } = render(<Stack direction="row" />)
    expect(container.querySelector('.pz-stack--row')).toBeInTheDocument()
  })

  it('applies pz-stack--gap-md by default', () => {
    const { container } = render(<Stack />)
    expect(container.querySelector('.pz-stack--gap-md')).toBeInTheDocument()
  })

  it('applies pz-stack--gap-sm when gap="sm"', () => {
    const { container } = render(<Stack gap="sm" />)
    expect(container.querySelector('.pz-stack--gap-sm')).toBeInTheDocument()
  })

  it('maps align="start" to alignItems: flex-start', () => {
    const { container } = render(<Stack align="start" />)
    const el = container.querySelector('.pz-stack') as HTMLElement
    expect(el.style.alignItems).toBe('flex-start')
  })

  it('maps justify="between" to justifyContent: space-between', () => {
    const { container } = render(<Stack justify="between" />)
    const el = container.querySelector('.pz-stack') as HTMLElement
    expect(el.style.justifyContent).toBe('space-between')
  })

  it('sets flexWrap when wrap is true', () => {
    const { container } = render(<Stack wrap />)
    const el = container.querySelector('.pz-stack') as HTMLElement
    expect(el.style.flexWrap).toBe('wrap')
  })

  it('merges custom className', () => {
    const { container } = render(<Stack className="custom" />)
    expect(container.querySelector('.pz-stack.custom')).toBeInTheDocument()
  })
})
