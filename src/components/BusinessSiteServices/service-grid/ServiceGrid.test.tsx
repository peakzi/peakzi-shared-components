import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ServiceGrid } from './ServiceGrid'

describe('ServiceGrid', () => {
  it('provides a native link and decorative arrow for every linked service', () => {
    const { container } = render(<ServiceGrid services={[{ id: 'one', title: 'Drain cleaning', href: '/services/drains' }]} headingLevel="h3" />)
    expect(screen.getByRole('link', { name: 'Drain cleaning' })).toHaveAttribute('href', '/services/drains')
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Drain cleaning')
    expect(container.querySelector('.pz-business-services__arrow')).toHaveAttribute('aria-hidden', 'true')
  })
  it('retains service text but does not create unsafe links or misleading arrows', () => {
    const { container } = render(<ServiceGrid services={[{ id: 'one', title: 'One', href: 'javascript:alert(1)' }, { id: 'two', title: 'Two' }]} headingLevel="h4" />)
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(2)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(container.querySelector('.pz-business-services__arrow')).not.toBeInTheDocument()
  })
})
