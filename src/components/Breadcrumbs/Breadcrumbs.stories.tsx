import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Breadcrumbs, Pagination } from './Breadcrumbs'

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Semantic `<nav aria-label="Breadcrumb">` with `<ol>` structure. Items with `href` render as `<a>` links for crawlability.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Breadcrumbs>

export const Default: Story = {
  render: () => (
    <Breadcrumbs
      items={[
        { label: 'Home', href: '/' },
        { label: 'Analytics', href: '/analytics' },
        { label: 'AI Citations' },
      ]}
    />
  ),
}

export const CustomSeparator: Story = {
  name: 'Custom separator',
  render: () => (
    <Breadcrumbs
      separator="›"
      items={[
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings' },
      ]}
    />
  ),
}

export const Short: Story = {
  render: () => (
    <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Current page' }]} />
  ),
}

export const PaginationStory: StoryObj<typeof Pagination> = {
  name: 'Pagination',
  render: function PaginationStory() {
    const [page, setPage] = useState(3)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Pagination total={10} page={page} onPageChange={setPage} />
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-3)' }}>
          Current page: <strong style={{ color: 'var(--fg-1)' }}>{page}</strong>
        </p>
      </div>
    )
  },
}

export const PaginationWithHref: StoryObj<typeof Pagination> = {
  name: 'Pagination with SEO-friendly hrefs',
  parameters: {
    docs: {
      description: {
        story:
          'When `baseHref` is provided, page buttons render as `<a href>` links for search engine indexing.',
      },
    },
  },
  render: function PaginationWithHrefStory() {
    const [page, setPage] = useState(1)
    return (
      <Pagination
        total={5}
        page={page}
        onPageChange={setPage}
        baseHref="/blog"
      />
    )
  },
}
