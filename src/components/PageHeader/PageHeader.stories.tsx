import type { Meta, StoryObj } from '@storybook/react'
import { PageHeader } from './PageHeader'

const meta: Meta<typeof PageHeader> = {
  title: 'Components/App Shell/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Top-of-page block: breadcrumbs → title → lede + right-aligned actions. Use once per page.',
      },
    },
  },
  args: {
    title: 'Accounts',
  },
}

export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = {}

export const WithBreadcrumbs: Story = {
  name: 'With breadcrumbs',
  args: {
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Customers', href: '/customers' },
      { label: 'Accounts' },
    ],
    title: 'Accounts',
    lede: 'Search, edit, and manage customer accounts.',
  },
}

export const WithActions: Story = {
  name: 'With actions',
  render: () => (
    <PageHeader
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Customers', href: '/customers' },
        { label: 'Accounts' },
      ]}
      title="Accounts"
      lede="Search, edit, and manage customer accounts."
      actions={
        <>
          <button className="pz-btn pz-btn--ghost pz-btn--sm">Export</button>
          <button className="pz-btn pz-btn--ghost pz-btn--sm">Import</button>
          <button className="pz-btn pz-btn--primary pz-btn--sm">New account</button>
        </>
      }
    />
  ),
}

export const HeadingLevel: Story = {
  name: 'h2 heading',
  args: {
    title: 'Section title',
    as: 'h2',
  },
}
