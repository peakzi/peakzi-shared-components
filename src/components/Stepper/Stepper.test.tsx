import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Stepper, StepperItem } from './Stepper'

describe('Stepper', () => {
  it('renders as <ol>', () => {
    const { container } = render(<Stepper />)
    expect(container.querySelector('ol')).toBeInTheDocument()
  })

  it('applies pz-stepper class', () => {
    const { container } = render(<Stepper />)
    expect(container.querySelector('.pz-stepper')).toBeInTheDocument()
  })

  it('renders items as <li>', () => {
    const { container } = render(
      <Stepper>
        <StepperItem title="Step 1" />
      </Stepper>
    )
    expect(container.querySelector('li')).toBeInTheDocument()
  })
})

describe('StepperItem', () => {
  it('renders the title', () => {
    render(<Stepper><StepperItem title="Scrape source" /></Stepper>)
    expect(screen.getByText('Scrape source')).toBeInTheDocument()
  })

  it('renders body when provided', () => {
    render(<Stepper><StepperItem title="Outline" body="Drafting sections…" /></Stepper>)
    expect(screen.getByText('Drafting sections…')).toBeInTheDocument()
  })

  it('applies idle status class by default', () => {
    const { container } = render(<Stepper><StepperItem title="Step" /></Stepper>)
    expect(container.querySelector('.pz-stepper__item--idle')).toBeInTheDocument()
  })

  it('applies active status class', () => {
    const { container } = render(<Stepper><StepperItem status="active" title="Step" /></Stepper>)
    expect(container.querySelector('.pz-stepper__item--active')).toBeInTheDocument()
  })

  it('applies done status class', () => {
    const { container } = render(<Stepper><StepperItem status="done" title="Step" /></Stepper>)
    expect(container.querySelector('.pz-stepper__item--done')).toBeInTheDocument()
  })

  it('applies error status class', () => {
    const { container } = render(<Stepper><StepperItem status="error" title="Step" /></Stepper>)
    expect(container.querySelector('.pz-stepper__item--error')).toBeInTheDocument()
  })

  it('renders step number when provided and status is idle', () => {
    render(<Stepper><StepperItem status="idle" title="Step" stepNumber={1} /></Stepper>)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<Stepper><StepperItem title="Step" className="custom" /></Stepper>)
    expect(container.querySelector('.pz-stepper__item.custom')).toBeInTheDocument()
  })
})
