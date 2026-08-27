import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Grid } from './Grid'

describe('Grid', () => {
  it('applies pz-grid class', () => {
    const { container } = render(<Grid columns={3} />)
    expect(container.querySelector('.pz-grid')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <Grid columns={2}>
        <span>First</span>
        <span>Second</span>
      </Grid>
    )
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
  })

  it('sets equal-column gridTemplateColumns for a numeric columns prop', () => {
    const { container } = render(<Grid columns={3} />)
    const el = container.querySelector('.pz-grid') as HTMLElement
    expect(el.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))')
  })

  it('sets auto-fit gridTemplateColumns for columns="auto"', () => {
    const { container } = render(<Grid columns="auto" minColWidth="200px" />)
    const el = container.querySelector('.pz-grid') as HTMLElement
    expect(el.style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(200px, 1fr))')
  })

  it('sets weighted gridTemplateColumns for an array columns prop', () => {
    const { container } = render(<Grid columns={[1.4, 1]} />)
    const el = container.querySelector('.pz-grid') as HTMLElement
    expect(el.style.gridTemplateColumns).toBe('minmax(0, 1.4fr) minmax(0, 1fr)')
  })

  it('applies pz-grid--gap-md by default', () => {
    const { container } = render(<Grid columns={2} />)
    expect(container.querySelector('.pz-grid--gap-md')).toBeInTheDocument()
  })

  it('applies pz-grid--gap-lg when gap="lg"', () => {
    const { container } = render(<Grid columns={2} gap="lg" />)
    expect(container.querySelector('.pz-grid--gap-lg')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<Grid columns={2} className="custom" />)
    expect(container.querySelector('.pz-grid.custom')).toBeInTheDocument()
  })

  it('does not apply pz-grid--stack-mobile by default', () => {
    const { container } = render(<Grid columns={2} />)
    expect(container.querySelector('.pz-grid--stack-mobile')).not.toBeInTheDocument()
  })

  it('applies pz-grid--stack-mobile when stackOnMobile is true', () => {
    const { container } = render(<Grid columns={[1.4, 1]} stackOnMobile />)
    expect(container.querySelector('.pz-grid--stack-mobile')).toBeInTheDocument()
  })
})
