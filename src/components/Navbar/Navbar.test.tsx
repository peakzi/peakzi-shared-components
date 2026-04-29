import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Navbar, NavBrand, NavLinks, NavLink, NavActions } from './Navbar'

describe('Navbar', () => {
  it('renders a <header> element', () => {
    render(<Navbar>content</Navbar>)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('applies pz-navbar class', () => {
    const { container } = render(<Navbar>content</Navbar>)
    expect(container.querySelector('.pz-navbar')).toBeInTheDocument()
  })
})

describe('NavBrand', () => {
  it('renders an anchor with href', () => {
    render(<NavBrand href="/home">Brand</NavBrand>)
    const link = screen.getByRole('link', { name: 'Brand' })
    expect(link).toHaveAttribute('href', '/home')
  })

  it('defaults href to "/"', () => {
    render(<NavBrand>Brand</NavBrand>)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/')
  })

  it('applies pz-navbar__brand class', () => {
    render(<NavBrand>Brand</NavBrand>)
    expect(screen.getByRole('link')).toHaveClass('pz-navbar__brand')
  })

  it('renders logo node', () => {
    render(<NavBrand logo={<span data-testid="logo" />}>Brand</NavBrand>)
    expect(screen.getByTestId('logo')).toBeInTheDocument()
  })
})

describe('NavLinks', () => {
  it('renders a <nav> element with aria-label', () => {
    render(<NavLinks><NavLink href="/">Home</NavLink></NavLinks>)
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
  })

  it('applies pz-navbar__links class', () => {
    const { container } = render(<NavLinks />)
    expect(container.querySelector('.pz-navbar__links')).toBeInTheDocument()
  })
})

describe('NavLink', () => {
  it('renders an anchor', () => {
    render(<NavLink href="/dashboard">Dashboard</NavLink>)
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('applies pz-navbar__link class', () => {
    render(<NavLink href="/dashboard">Dashboard</NavLink>)
    expect(screen.getByRole('link')).toHaveClass('pz-navbar__link')
  })

  it('applies is-active class when active', () => {
    render(<NavLink href="/dashboard" active>Dashboard</NavLink>)
    expect(screen.getByRole('link')).toHaveClass('is-active')
  })

  it('does not apply is-active when not active', () => {
    render(<NavLink href="/dashboard">Dashboard</NavLink>)
    expect(screen.getByRole('link')).not.toHaveClass('is-active')
  })

  it('sets aria-current="page" when active', () => {
    render(<NavLink href="/dashboard" active>Dashboard</NavLink>)
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page')
  })

  it('does not set aria-current when not active', () => {
    render(<NavLink href="/dashboard">Dashboard</NavLink>)
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current')
  })
})

describe('NavActions', () => {
  it('renders children', () => {
    render(<NavActions><button type="button">Sign in</button></NavActions>)
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('applies pz-navbar__actions class', () => {
    const { container } = render(<NavActions />)
    expect(container.querySelector('.pz-navbar__actions')).toBeInTheDocument()
  })
})
