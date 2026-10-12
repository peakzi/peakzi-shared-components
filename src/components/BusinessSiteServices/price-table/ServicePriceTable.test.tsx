import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { servicePricing } from '../helpers/pricing'
import { ServicePriceTable } from './ServicePriceTable'

const pricing = servicePricing([
  { id: 'one', title: 'Water heater', href: '/services/water-heater', tiers: [{ label: 'Repair', value: '$100 – $200' }, { label: 'Replace/Install', value: '$300 – $400' }] },
  { id: 'two', title: 'Drain cleaning', href: '/services/drains' },
])

describe('ServicePriceTable', () => {
  it('uses native column and row headers and crawlable service links', () => {
    render(<ServicePriceTable {...pricing} title="Our Plumbing Services" />)
    const table = screen.getByRole('table', { name: 'Our Plumbing Services prices' })
    expect(within(table).getAllByRole('columnheader').map((cell) => cell.textContent)).toEqual(['Service', 'Repair', 'Install', 'Maintain'])
    expect(within(table).getAllByRole('rowheader')).toHaveLength(2)
    expect(within(table).getByRole('link', { name: 'Water heater' })).toHaveAttribute('href', '/services/water-heater')
    expect(within(table).getByText('$100 – $200')).toBeInTheDocument()
  })
  it('shows missing-price dashes with an accessible explanation, never invented zero prices', () => {
    const { container } = render(<ServicePriceTable {...pricing} title="Plumbing" />)
    expect(container.querySelectorAll('.pz-business-services__missing-price')).toHaveLength(4)
    expect(screen.getAllByText('Price not provided')).toHaveLength(4)
    expect(container.textContent).not.toContain('$0')
  })
  it('includes every row and supplied price in initial HTML and escapes content', () => {
    const html = renderToStaticMarkup(<ServicePriceTable {...servicePricing([{ id: 'one', title: '<script>Service</script>', tiers: [{ label: 'Repair', value: '<script>Price</script>' }] }])} title="Plumbing" />)
    expect(html).toContain('&lt;script&gt;Service&lt;/script&gt;')
    expect(html).toContain('&lt;script&gt;Price&lt;/script&gt;')
    expect(html).not.toContain('<script>')
  })
  it('preserves unlinked services when URLs are unsafe', () => {
    render(<ServicePriceTable {...servicePricing([{ id: 'one', title: 'Service', href: 'javascript:bad', tiers: [{ label: 'Repair', value: '$100' }] }])} title="Plumbing" />)
    expect(screen.getByRole('rowheader')).toHaveTextContent('Service')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
