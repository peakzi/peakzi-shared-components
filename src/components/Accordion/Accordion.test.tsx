import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion'

function BasicAccordion({ multiple = false, defaultOpen = [] as string[] } = {}) {
  return (
    <Accordion multiple={multiple} defaultOpen={defaultOpen}>
      <AccordionItem itemId="item1">
        <AccordionTrigger itemId="item1">Question 1</AccordionTrigger>
        <AccordionContent itemId="item1">Answer 1</AccordionContent>
      </AccordionItem>
      <AccordionItem itemId="item2">
        <AccordionTrigger itemId="item2">Question 2</AccordionTrigger>
        <AccordionContent itemId="item2">Answer 2</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

describe('Accordion', () => {
  it('renders triggers', () => {
    render(<BasicAccordion />)
    expect(screen.getByRole('button', { name: 'Question 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Question 2' })).toBeInTheDocument()
  })

  it('applies pz-accordion class', () => {
    const { container } = render(<BasicAccordion />)
    expect(container.querySelector('.pz-accordion')).toBeInTheDocument()
  })

  it('all items closed by default', () => {
    render(<BasicAccordion />)
    expect(screen.getByRole('button', { name: 'Question 1' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: 'Question 2' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens item when trigger is clicked', () => {
    render(<BasicAccordion />)
    fireEvent.click(screen.getByRole('button', { name: 'Question 1' }))
    expect(screen.getByRole('button', { name: 'Question 1' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes item when trigger is clicked again', () => {
    render(<BasicAccordion />)
    fireEvent.click(screen.getByRole('button', { name: 'Question 1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Question 1' }))
    expect(screen.getByRole('button', { name: 'Question 1' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('in single mode, opening one closes another', () => {
    render(<BasicAccordion />)
    fireEvent.click(screen.getByRole('button', { name: 'Question 1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Question 2' }))
    expect(screen.getByRole('button', { name: 'Question 1' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: 'Question 2' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('in multiple mode, both items can be open', () => {
    render(<BasicAccordion multiple />)
    fireEvent.click(screen.getByRole('button', { name: 'Question 1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Question 2' }))
    expect(screen.getByRole('button', { name: 'Question 1' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Question 2' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('opens defaultOpen items on mount', () => {
    render(<BasicAccordion defaultOpen={['item1']} />)
    expect(screen.getByRole('button', { name: 'Question 1' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Question 2' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('item open adds is-open class', () => {
    const { container } = render(<BasicAccordion defaultOpen={['item1']} />)
    const items = container.querySelectorAll('.pz-accordion__item')
    expect(items[0]).toHaveClass('is-open')
    expect(items[1]).not.toHaveClass('is-open')
  })

  it('trigger has aria-controls', () => {
    render(<BasicAccordion />)
    const trigger = screen.getByRole('button', { name: 'Question 1' })
    expect(trigger).toHaveAttribute('aria-controls')
  })

  it('content has role=region', () => {
    render(<BasicAccordion />)
    const regions = screen.getAllByRole('region')
    expect(regions.length).toBeGreaterThan(0)
  })
})
