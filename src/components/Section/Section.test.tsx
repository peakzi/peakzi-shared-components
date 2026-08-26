import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Section, SectionHeader } from './Section'

describe('Section', () => {
  it('renders as <section>', () => {
    const { container } = render(<Section>content</Section>)
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('applies pz-section class', () => {
    const { container } = render(<Section />)
    expect(container.querySelector('.pz-section')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Section>Body content</Section>)
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<Section className="custom" />)
    expect(container.querySelector('.pz-section.custom')).toBeInTheDocument()
  })
})

describe('SectionHeader', () => {
  it('renders the title', () => {
    render(<SectionHeader title="Standing" />)
    expect(screen.getByText('Standing')).toBeInTheDocument()
  })

  it('applies pz-section-header class', () => {
    const { container } = render(<SectionHeader title="Standing" />)
    expect(container.querySelector('.pz-section-header')).toBeInTheDocument()
  })

  it('renders title as h2 by default', () => {
    const { container } = render(<SectionHeader title="Standing" />)
    expect(container.querySelector('h2.pz-section-header__title')).toBeInTheDocument()
  })

  it('renders title as h3 when as="h3"', () => {
    const { container } = render(<SectionHeader title="Standing" as="h3" />)
    expect(container.querySelector('h3.pz-section-header__title')).toBeInTheDocument()
  })

  it('renders lead when provided', () => {
    render(<SectionHeader title="Standing" lead="Read 10 Aug, next 7 Sep." />)
    expect(screen.getByText('Read 10 Aug, next 7 Sep.')).toBeInTheDocument()
  })

  it('does not render lead when omitted', () => {
    const { container } = render(<SectionHeader title="Standing" />)
    expect(container.querySelector('.pz-section-header__lead')).not.toBeInTheDocument()
  })
})
