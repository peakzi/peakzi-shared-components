import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renders the title', () => {
    render(<PageHeader title="Accounts" />)
    expect(screen.getByText('Accounts')).toBeInTheDocument()
  })

  it('applies pz-page-header class', () => {
    const { container } = render(<PageHeader title="Accounts" />)
    expect(container.querySelector('.pz-page-header')).toBeInTheDocument()
  })

  it('renders as <header> element', () => {
    const { container } = render(<PageHeader title="Accounts" />)
    expect(container.querySelector('header')).toBeInTheDocument()
  })

  it('renders title as h1 by default', () => {
    const { container } = render(<PageHeader title="Accounts" />)
    expect(container.querySelector('h1.pz-page-header__title')).toBeInTheDocument()
  })

  it('renders title as h2 when as="h2"', () => {
    const { container } = render(<PageHeader title="Accounts" as="h2" />)
    expect(container.querySelector('h2.pz-page-header__title')).toBeInTheDocument()
  })

  it('renders breadcrumbs when provided', () => {
    render(
      <PageHeader
        title="Accounts"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Accounts' }]}
      />
    )
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('does not render breadcrumbs nav when omitted', () => {
    const { container } = render(<PageHeader title="Accounts" />)
    expect(container.querySelector('nav[aria-label="Breadcrumb"]')).not.toBeInTheDocument()
  })

  it('renders lede when provided', () => {
    render(<PageHeader title="Accounts" lede="Manage your accounts." />)
    expect(screen.getByText('Manage your accounts.')).toBeInTheDocument()
  })

  it('renders actions slot when provided', () => {
    render(<PageHeader title="Accounts" actions={<button>New</button>} />)
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<PageHeader title="Accounts" className="custom" />)
    expect(container.querySelector('.pz-page-header.custom')).toBeInTheDocument()
  })
})
