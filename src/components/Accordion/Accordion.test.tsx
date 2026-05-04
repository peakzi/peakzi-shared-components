import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion'

// ---------------------------------------------------------------------------
// Helper — uses new API: id on AccordionItem, no itemId on Trigger/Content
// ---------------------------------------------------------------------------
function BasicAccordion({
  type = 'single' as 'single' | 'multiple',
  defaultValue = undefined as string | string[] | undefined,
} = {}) {
  return (
    <Accordion type={type} defaultValue={defaultValue}>
      <AccordionItem id="item1">
        <AccordionTrigger>Question 1</AccordionTrigger>
        <AccordionContent>Answer 1</AccordionContent>
      </AccordionItem>
      <AccordionItem id="item2">
        <AccordionTrigger>Question 2</AccordionTrigger>
        <AccordionContent>Answer 2</AccordionContent>
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

  it('shows content when item is open', () => {
    render(<BasicAccordion />)
    fireEvent.click(screen.getByRole('button', { name: 'Question 1' }))
    expect(screen.getByText('Answer 1')).toBeVisible()
  })

  it('closes item when trigger is clicked again (collapsible=true default)', () => {
    render(<BasicAccordion />)
    fireEvent.click(screen.getByRole('button', { name: 'Question 1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Question 1' }))
    expect(screen.getByRole('button', { name: 'Question 1' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('in single mode, opening one closes another', () => {
    render(<BasicAccordion type="single" />)
    fireEvent.click(screen.getByRole('button', { name: 'Question 1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Question 2' }))
    expect(screen.getByRole('button', { name: 'Question 1' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: 'Question 2' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('in multiple mode, both items can be open', () => {
    render(<BasicAccordion type="multiple" />)
    fireEvent.click(screen.getByRole('button', { name: 'Question 1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Question 2' }))
    expect(screen.getByRole('button', { name: 'Question 1' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Question 2' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('opens defaultValue items on mount', () => {
    render(<BasicAccordion defaultValue="item1" />)
    expect(screen.getByRole('button', { name: 'Question 1' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Question 2' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('open item adds pz-accordion__item--open class', () => {
    const { container } = render(<BasicAccordion defaultValue="item1" />)
    const items = container.querySelectorAll('.pz-accordion__item')
    expect(items[0]).toHaveClass('pz-accordion__item--open')
    expect(items[1]).not.toHaveClass('pz-accordion__item--open')
  })

  it('trigger has aria-controls pointing at panel', () => {
    render(<BasicAccordion />)
    const trigger = screen.getByRole('button', { name: 'Question 1' })
    expect(trigger).toHaveAttribute('aria-controls', 'item1-panel')
    expect(trigger).toHaveAttribute('id', 'item1-trigger')
  })

  it('open content panel has role=region and aria-labelledby', () => {
    render(<BasicAccordion defaultValue="item1" />)
    const region = screen.getByRole('region')
    expect(region).toHaveAttribute('aria-labelledby', 'item1-trigger')
  })

  it('throws when AccordionItem is outside Accordion', () => {
    const original = console.error
    console.error = () => {}
    expect(() => render(
      <AccordionItem id="x">
        <AccordionTrigger>Test</AccordionTrigger>
      </AccordionItem>
    )).toThrow()
    console.error = original
  })
})
