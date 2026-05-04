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
})
