import { fireEvent, render, screen, within } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { BusinessSiteAreasDirectory } from './BusinessSiteAreasDirectory'
import type { BusinessSiteArea } from '../BusinessSiteAreas'

const areas: BusinessSiteArea[] = [
  { id: 'salem', label: 'Salem, VA', favorite: false },
  { id: 'roanoke', label: 'Roanoke, VA', favorite: true, position: { lat: 37.29, lon: -80.06 } },
  { id: 'cave', label: 'Cave Spring, VA', favorite: true },
  { id: 'maria', label: 'Santa María, CA' },
]

describe('BusinessSiteAreasDirectory', () => {
  it('renders one heading and search before one map, followed by the city list in reading order', () => {
    const map = () => <div role="region" aria-label="Service area map">Map</div>
    const html = renderToStaticMarkup(<BusinessSiteAreasDirectory areas={areas} renderMap={map} />)
    expect(html.indexOf('<h1>')).toBeLessThan(html.indexOf('type="search"'))
    expect(html.indexOf('type="search"')).toBeLessThan(html.indexOf('aria-label="Service area map"'))
    expect(html.indexOf('aria-label="Service area map"')).toBeLessThan(html.indexOf('aria-label="Cities served"'))
    render(<BusinessSiteAreasDirectory areas={areas} renderMap={map} />)
    const heading = screen.getByRole('heading', { level: 1 })
    const search = screen.getByRole('searchbox', { name: 'Search cities' })
    const mapRegion = screen.getByRole('region', { name: 'Service area map' })
    const list = screen.getByRole('list', { name: 'Cities served' })
    expect(heading.compareDocumentPosition(search) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(search.compareDocumentPosition(mapRegion) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(mapRegion.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders all city names in initial HTML with one H1 and favorites first in bold', () => {
    const html = renderToStaticMarkup(<BusinessSiteAreasDirectory areas={areas} title="Service areas" />)
    expect(html).toContain('<h1>Service areas</h1>')
    expect(html).toContain('<strong>Cave Spring, VA</strong>')
    expect(html).toContain('<strong>Roanoke, VA</strong>')
    expect(html.indexOf('Cave Spring, VA')).toBeLessThan(html.indexOf('Roanoke, VA'))
    expect(html.indexOf('Roanoke, VA')).toBeLessThan(html.indexOf('Salem, VA'))
    expect(html).not.toContain('<strong>Salem, VA</strong>')
    expect(html).not.toContain('<strong>Santa María, CA</strong>')
    expect(html).not.toContain('/cities/')
  })

  it('preserves favorite emphasis and ordering when searching', () => {
    render(<BusinessSiteAreasDirectory areas={areas} />)
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search cities' }), { target: { value: 'VA' } })
    const cities = within(screen.getByRole('list', { name: 'Cities served' })).getAllByRole('button')
    expect(cities.map((city) => city.textContent)).toEqual(['Cave Spring, VA', 'Roanoke, VA', 'Salem, VA'])
    expect(cities[0]?.querySelector('strong')).toHaveTextContent('Cave Spring, VA')
    expect(cities[1]?.querySelector('strong')).toHaveTextContent('Roanoke, VA')
    expect(cities[2]?.querySelector('strong')).toBeNull()
  })

  it('filters without case or accent sensitivity, updates the map and clears the search', () => {
    const map = vi.fn((items: readonly BusinessSiteArea[]) => <div>Map: {items.length}</div>)
    render(<BusinessSiteAreasDirectory areas={areas} renderMap={map} />)
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search cities' }), { target: { value: '  MARIA ' } })
    expect(screen.getByRole('status')).toHaveTextContent('1 of 4 cities found')
    expect(within(screen.getByRole('list', { name: 'Cities served' })).getAllByRole('button')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Santa María, CA' })).toBeInTheDocument()
    expect(screen.getByText('Map: 1')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByText('Map: 4')).toBeInTheDocument()
  })

  it('keeps search available when there are no matches or no cities', () => {
    const { rerender } = render(<BusinessSiteAreasDirectory areas={areas} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'unknown' } })
    expect(screen.getByText('No cities found.')).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Service area map' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('0 of 4 cities found')
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    rerender(<BusinessSiteAreasDirectory areas={[]} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getByText('No cities found.')).toBeInTheDocument()
  })

  it('passes site appearance and preserves safe future links without fabricating navigation', () => {
    const { container } = render(<BusinessSiteAreasDirectory
      areas={[{ id: 'city', label: 'City', favorite: true, href: '/services/city' }]}
      appearance={{ backgroundColor: '#ffffff', textColor: '#101010', density: 'compact', font: 'Nunito Sans' }} />)
    expect(screen.getByRole('link', { name: 'City' })).toHaveAttribute('href', '/services/city')
    expect(container.querySelector('section')).toHaveAttribute('data-density', 'compact')
    expect(container.querySelector('section')?.getAttribute('style')).toContain('--pz-business-areas-background: #ffffff')
  })

  it('does not render unsafe navigation or interpret city labels as HTML', () => {
    render(<BusinessSiteAreasDirectory areas={[
      { id: 'bad', label: 'Unsafe', href: 'javascript:alert(1)' },
      { id: 'safe', label: '<script>city</script>' },
    ]} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByText('Unsafe')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '<script>city</script>' })).toBeInTheDocument()
  })
})
