import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from './EmptyState'

const meta: Meta<typeof EmptyState> = {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Generic "no data yet" panel for empty tables, lists, and feature placeholders.',
      },
    },
  },
  args: {
    title: 'No accounts yet',
    body: 'Accounts you create will appear here.',
  },
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {}

export const WithAction: Story = {
  name: 'With CTA',
  render: () => (
    <EmptyState
      title="No accounts yet"
      body="Create your first account to get started."
      actions={<button className="pz-btn pz-btn--primary pz-btn--sm">New account</button>}
    />
  ),
}

export const Small: Story = {
  args: { size: 'sm', title: 'No results', body: 'Try a different filter.' },
}

export const Large: Story = {
  args: { size: 'lg', title: 'Nothing here', body: 'Come back later.' },
}
