import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DefList, DefRow } from './DefList'

describe('DefList', () => {
  it('renders as <dl>', () => {
    const { container } = render(<DefList><DefRow term="Key" value="Value" /></DefList>)
    expect(container.querySelector('dl')).toBeInTheDocument()
  })

  it('applies pz-deflist class', () => {
    const { container } = render(<DefList />)
    expect(container.querySelector('.pz-deflist')).toBeInTheDocument()
  })

  it('does not apply size class for md (default)', () => {
    const { container } = render(<DefList />)
    expect(container.querySelector('.pz-deflist--md')).not.toBeInTheDocument()
  })

  it('applies pz-deflist--sm for sm size', () => {
    const { container } = render(<DefList size="sm" />)
    expect(container.querySelector('.pz-deflist--sm')).toBeInTheDocument()
  })

  it('does not apply layout class for inline (default)', () => {
    const { container } = render(<DefList />)
    expect(container.querySelector('.pz-deflist--inline')).not.toBeInTheDocument()
  })

  it('applies pz-deflist--stacked for stacked layout', () => {
    const { container } = render(<DefList layout="stacked" />)
    expect(container.querySelector('.pz-deflist--stacked')).toBeInTheDocument()
  })

  it('does not apply an emphasis class by default', () => {
    const { container } = render(<DefList />)
    expect(container.querySelector('.pz-deflist--quote')).not.toBeInTheDocument()
  })

  it('applies pz-deflist--quote when emphasis="quote"', () => {
    const { container } = render(<DefList emphasis="quote" />)
    expect(container.querySelector('.pz-deflist--quote')).toBeInTheDocument()
  })
})

describe('DefRow', () => {
  it('renders term and value', () => {
    render(<DefList><DefRow term="Account ID" value="acct_123" /></DefList>)
    expect(screen.getByText('Account ID')).toBeInTheDocument()
    expect(screen.getByText('acct_123')).toBeInTheDocument()
  })

  it('renders <dt> and <dd>', () => {
    const { container } = render(<DefList><DefRow term="Key" value="Val" /></DefList>)
    expect(container.querySelector('dt')).toBeInTheDocument()
    expect(container.querySelector('dd')).toBeInTheDocument()
  })

  it('prefers children over value prop', () => {
    render(<DefList><DefRow term="Status"><span>Active</span></DefRow></DefList>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies pz-deflist__row class', () => {
    const { container } = render(<DefList><DefRow term="Key" value="Val" /></DefList>)
    expect(container.querySelector('.pz-deflist__row')).toBeInTheDocument()
  })

  it('renders a source link when href is a safe http(s) URL', () => {
    const { container } = render(
      <DefList><DefRow term="Evidence" value="A quote." href="https://google.com/reviews/123" /></DefList>
    )
    const link = container.querySelector('.pz-deflist__link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://google.com/reviews/123')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not render a source link when href is unset', () => {
    const { container } = render(<DefList><DefRow term="Evidence" value="A quote." /></DefList>)
    expect(container.querySelector('.pz-deflist__link')).not.toBeInTheDocument()
  })

  it('does not render a source link for an unsafe scheme', () => {
    const { container } = render(
      <DefList><DefRow term="Evidence" value="A quote." href="javascript:alert(1)" /></DefList>
    )
    expect(container.querySelector('.pz-deflist__link')).not.toBeInTheDocument()
  })
})

describe('DefList stacked term grouping', () => {
  it('groups consecutive rows sharing a term into one label with bullets', () => {
    const { container } = render(
      <DefList layout="stacked">
        <DefRow term="Reason" value="First point" />
        <DefRow term="Reason" value="Second point" />
        <DefRow term="Reason" value="Third point" />
      </DefList>
    )
    expect(screen.getAllByText('Reason')).toHaveLength(1)
    expect(container.querySelectorAll('.pz-deflist__bullet')).toHaveLength(3)
    expect(screen.getByText('First point')).toBeInTheDocument()
    expect(screen.getByText('Second point')).toBeInTheDocument()
    expect(screen.getByText('Third point')).toBeInTheDocument()
  })

  it('preserves className from grouped rows on the merged wrapper', () => {
    const { container } = render(
      <DefList layout="stacked">
        <DefRow term="Reason" value="First point" className="row-a" />
        <DefRow term="Reason" value="Second point" className="row-b" />
      </DefList>
    )
    const merged = container.querySelector('.pz-deflist__row')
    expect(merged).toHaveClass('row-a', 'row-b')
  })

  it('does not group a single row with a unique term', () => {
    const { container } = render(
      <DefList layout="stacked">
        <DefRow term="Basis" value="From this week's data." />
      </DefList>
    )
    expect(screen.getByText('Basis')).toBeInTheDocument()
    expect(container.querySelectorAll('.pz-deflist__bullets')).toHaveLength(0)
  })

  it('does not group rows with different terms', () => {
    const { container } = render(
      <DefList layout="stacked">
        <DefRow term="Reason" value="First point" />
        <DefRow term="Evidence" value="A quote." />
      </DefList>
    )
    expect(screen.getAllByText('Reason')).toHaveLength(1)
    expect(screen.getAllByText('Evidence')).toHaveLength(1)
    expect(container.querySelectorAll('.pz-deflist__bullets')).toHaveLength(0)
  })

  it('renders a source link per bullet in a grouped row', () => {
    const { container } = render(
      <DefList layout="stacked">
        <DefRow term="Evidence" value="First quote." href="https://google.com/reviews/1" />
        <DefRow term="Evidence" value="Second quote." />
      </DefList>
    )
    expect(container.querySelectorAll('.pz-deflist__link')).toHaveLength(1)
  })

  it('does not group rows in inline layout even with matching terms', () => {
    const { container } = render(
      <DefList layout="inline">
        <DefRow term="Reason" value="First point" />
        <DefRow term="Reason" value="Second point" />
      </DefList>
    )
    expect(screen.getAllByText('Reason')).toHaveLength(2)
    expect(container.querySelectorAll('.pz-deflist__bullets')).toHaveLength(0)
  })
})
