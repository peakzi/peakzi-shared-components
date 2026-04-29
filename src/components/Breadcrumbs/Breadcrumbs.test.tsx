import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Breadcrumbs, Pagination } from './Breadcrumbs'

// =============================================================================
// Breadcrumbs
// =============================================================================

describe('Breadcrumbs', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Current' },
  ]

  it('renders a nav with aria-label="Breadcrumb"', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
  })

  it('applies pz-breadcrumbs class', () => {
    const { container } = render(<Breadcrumbs items={items} />)
    expect(container.querySelector('.pz-breadcrumbs')).toBeInTheDocument()
  })

  it('renders item labels', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Current')).toBeInTheDocument()
  })

  it('renders links for items with href', () => {
    render(<Breadcrumbs items={items} />)
    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('renders last item as span (no link)', () => {
    render(<Breadcrumbs items={items} />)
    const current = screen.getByText('Current')
    expect(current.tagName).toBe('SPAN')
  })

  it('marks last item with is-current class', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByText('Current')).toHaveClass('is-current')
  })

  it('marks last item with aria-current="page"', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByText('Current')).toHaveAttribute('aria-current', 'page')
  })

  it('renders default "/" separator', () => {
    render(<Breadcrumbs items={items} />)
    const seps = screen.getAllByText('/')
    expect(seps.length).toBeGreaterThan(0)
  })

  it('renders custom separator', () => {
    render(<Breadcrumbs items={items} separator="›" />)
    const seps = screen.getAllByText('›')
    expect(seps.length).toBeGreaterThan(0)
  })
})

// =============================================================================
// Pagination
// =============================================================================

describe('Pagination', () => {
  it('renders a nav with aria-label="Pagination"', () => {
    render(<Pagination total={5} page={1} onPageChange={() => {}} />)
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
  })

  it('applies pz-pagination class', () => {
    const { container } = render(<Pagination total={5} page={1} onPageChange={() => {}} />)
    expect(container.querySelector('.pz-pagination')).toBeInTheDocument()
  })

  it('renders page number buttons', () => {
    render(<Pagination total={5} page={1} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument()
  })

  it('marks active page with is-active class', () => {
    const { container } = render(<Pagination total={5} page={3} onPageChange={() => {}} />)
    const buttons = container.querySelectorAll('.pz-pagination__btn.is-active')
    expect(buttons).toHaveLength(1)
  })

  it('calls onPageChange when a page is clicked', () => {
    const onPageChange = vi.fn()
    render(<Pagination total={5} page={1} onPageChange={onPageChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Page 3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange with next page when Next is clicked', () => {
    const onPageChange = vi.fn()
    render(<Pagination total={5} page={2} onPageChange={onPageChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange with previous page when Previous is clicked', () => {
    const onPageChange = vi.fn()
    render(<Pagination total={5} page={3} onPageChange={onPageChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('disables Previous button on first page', () => {
    render(<Pagination total={5} page={1} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
  })

  it('disables Next button on last page', () => {
    render(<Pagination total={5} page={5} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('renders crawlable links when baseHref is provided', () => {
    render(<Pagination total={5} page={1} onPageChange={() => {}} baseHref="/blog" />)

    const link = screen.getByRole('link', { name: 'Page 3' })

    expect(link).toHaveAttribute('href', '/blog?page=3')
  })
})
