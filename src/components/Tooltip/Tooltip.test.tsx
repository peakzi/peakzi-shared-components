import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('renders children', () => {
    render(<Tooltip content="Helpful tip"><button type="button">Hover me</button></Tooltip>)
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument()
  })

  it('renders tooltip with role=tooltip', () => {
    render(<Tooltip content="Helpful tip"><button type="button">Hover me</button></Tooltip>)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful tip')
  })

  it('applies pz-tip class to wrapper', () => {
    const { container } = render(
      <Tooltip content="Helpful tip"><button type="button">Hover me</button></Tooltip>,
    )
    expect(container.querySelector('.pz-tip')).toBeInTheDocument()
  })

  it('applies pz-tip__bubble class to tooltip text', () => {
    const { container } = render(
      <Tooltip content="Helpful tip"><button type="button">Hover me</button></Tooltip>,
    )
    expect(container.querySelector('.pz-tip__bubble')).toBeInTheDocument()
  })

  it('aria-describedby on wrapper points to tooltip id', () => {
    const { container } = render(
      <Tooltip content="Helpful tip"><button type="button">Hover me</button></Tooltip>,
    )
    const wrapper = container.querySelector('.pz-tip')
    const bubble = container.querySelector('.pz-tip__bubble')
    expect(wrapper?.getAttribute('aria-describedby')).toBe(bubble?.id)
    expect(bubble?.id).toBeTruthy()
  })

  it('merges custom className', () => {
    const { container } = render(
      <Tooltip content="Tip" className="my-tip"><button type="button">x</button></Tooltip>,
    )
    expect(container.querySelector('.pz-tip.my-tip')).toBeInTheDocument()
  })
})
