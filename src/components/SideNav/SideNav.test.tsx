import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SideNav, SideNavGroup, SideNavItem } from './SideNav'

function BasicNav() {
  return (
    <SideNav>
      <SideNavGroup label="Customers">
        <SideNavItem href="/accounts" active>Accounts</SideNavItem>
        <SideNavItem href="/business">Business</SideNavItem>
      </SideNavGroup>
    </SideNav>
  )
}

describe('SideNav', () => {
  it('renders as <nav>', () => {
    const { container } = render(<BasicNav />)
    expect(container.querySelector('nav')).toBeInTheDocument()
  })

  it('applies pz-sidenav class', () => {
    const { container } = render(<BasicNav />)
    expect(container.querySelector('.pz-sidenav')).toBeInTheDocument()
  })

  it('has default aria-label "Primary"', () => {
    render(<BasicNav />)
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
  })

  it('accepts custom aria-label', () => {
    render(<SideNav aria-label="Admin nav" />)
    expect(screen.getByRole('navigation', { name: 'Admin nav' })).toBeInTheDocument()
  })

  it('renders brand slot', () => {
    render(<SideNav brand={<span>Logo</span>} />)
    expect(screen.getByText('Logo')).toBeInTheDocument()
  })

  it('renders footer slot', () => {
    render(<SideNav footer={<span>Footer</span>} />)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('renders badge when provided', () => {
    render(<SideNav brand={<span>Logo</span>} badge="ADMIN" />)
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
  })

  it('does not render badge when omitted', () => {
    const { container } = render(<SideNav brand={<span>Logo</span>} />)
    expect(container.querySelector('.pz-sidenav__badge')).not.toBeInTheDocument()
  })
})

describe('SideNavGroup', () => {
  it('renders group label', () => {
    render(<SideNav><SideNavGroup label="Customers" /></SideNav>)
    expect(screen.getByText('Customers')).toBeInTheDocument()
  })

  it('renders items in a <ul role="list">', () => {
    const { container } = render(<BasicNav />)
    expect(container.querySelector('ul[role="list"]')).toBeInTheDocument()
  })
})

describe('SideNavItem', () => {
  it('renders as <a> when href is provided', () => {
    render(<SideNav><SideNavGroup><SideNavItem href="/foo">Foo</SideNavItem></SideNavGroup></SideNav>)
    expect(screen.getByRole('link', { name: 'Foo' })).toBeInTheDocument()
  })

  it('renders as <button> when no href', () => {
    render(<SideNav><SideNavGroup><SideNavItem>Foo</SideNavItem></SideNavGroup></SideNav>)
    expect(screen.getByRole('button', { name: 'Foo' })).toBeInTheDocument()
  })

  it('sets aria-current="page" on active item', () => {
    render(<SideNav><SideNavGroup><SideNavItem href="/foo" active>Foo</SideNavItem></SideNavGroup></SideNav>)
    expect(screen.getByRole('link', { name: 'Foo' })).toHaveAttribute('aria-current', 'page')
  })

  it('does not set aria-current when not active', () => {
    render(<SideNav><SideNavGroup><SideNavItem href="/foo">Foo</SideNavItem></SideNavGroup></SideNav>)
    expect(screen.getByRole('link', { name: 'Foo' })).not.toHaveAttribute('aria-current')
  })

  it('applies pz-sidenav__item--active class when active', () => {
    const { container } = render(
      <SideNav><SideNavGroup><SideNavItem href="/foo" active>Foo</SideNavItem></SideNavGroup></SideNav>
    )
    expect(container.querySelector('.pz-sidenav__item--active')).toBeInTheDocument()
  })

  it('renders badge when provided', () => {
    render(<SideNav><SideNavGroup><SideNavItem badge={3}>Foo</SideNavItem></SideNavGroup></SideNav>)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<SideNav><SideNavGroup><SideNavItem onClick={onClick}>Foo</SideNavItem></SideNavGroup></SideNav>)
    fireEvent.click(screen.getByRole('button', { name: 'Foo' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
