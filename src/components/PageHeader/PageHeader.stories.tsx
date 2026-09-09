import type { Meta, StoryObj } from '@storybook/react'
import { PageHeader } from './PageHeader'
import { StatCard } from '../StatCard'
import { Badge } from '../Badge'
import { Stack } from '../Stack'

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

export const Masthead: Story = {
  name: 'Masthead (dark)',
  render: () => (
    <PageHeader
      title="Price perception is falling while the market's is rising."
      as="h2"
      masthead
      actions={
        <Stack direction="row" align="center" gap="sm">
          <StatCard eyebrow="Peakzi Score" value={24.51} />
          <Badge variant="neutral">6th of 13</Badge>
        </Stack>
      }
    />
  ),
}

export const BackgroundSubtle: Story = {
  name: 'Background: subtle',
  args: {
    title: 'Accounts',
    lede: 'Search, edit, and manage customer accounts.',
    background: 'subtle',
  },
}

export const StackedActions: Story = {
  name: 'Stacked actions',
  render: () => (
    <PageHeader
      title="Accounts"
      lede="Search, edit, and manage customer accounts."
      stackedActions
      actions={
        <>
          <button className="pz-btn pz-btn--ghost pz-btn--sm">Export</button>
          <button className="pz-btn pz-btn--primary pz-btn--sm">New account</button>
        </>
      }
    />
  ),
}
