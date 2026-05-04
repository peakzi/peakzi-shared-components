import type { Meta, StoryObj } from '@storybook/react'
import { StatusPill, type StatusPillStatus } from './StatusPill'

const meta: Meta<typeof StatusPill> = {
  title: 'Components/Surfaces/StatusPill',
  component: StatusPill,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Variant-mapped badge for domain status enums. Keeps status colors consistent across the app.',
      },
    },
  },
  args: {
    status: 'active',
    children: 'Active',
  },
}

export default meta
type Story = StoryObj<typeof StatusPill>

export const Default: Story = {}

const STATUSES: StatusPillStatus[] = [
  'active', 'inactive', 'pending', 'success', 'warning', 'error', 'info', 'neutral',
]

export const AllStatuses: Story = {
  name: 'All statuses',
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      {STATUSES.map((s) => (
        <StatusPill key={s} status={s}>{s}</StatusPill>
      ))}
    </div>
  ),
}

export const WithoutDot: Story = {
  name: 'Without dot',
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {STATUSES.map((s) => (
        <StatusPill key={s} status={s} dot={false}>{s}</StatusPill>
      ))}
    </div>
  ),
}
