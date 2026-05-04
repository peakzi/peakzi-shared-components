import type { Meta, StoryObj } from '@storybook/react'
import { StatCard } from './StatCard'

const meta: Meta<typeof StatCard> = {
  title: 'Components/Data Display/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Stat wrapped in a Card for KPI grids. Use inside a CSS grid.',
      },
    },
  },
  args: {
    eyebrow: 'Active accounts',
    value: '2,418',
    delta: '+12%',
    deltaType: 'up',
  },
}

export default meta
type Story = StoryObj<typeof StatCard>

export const Default: Story = {}

export const KpiGrid: Story = {
  name: 'KPI grid (4-col)',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <StatCard eyebrow="Active accounts" value="2,418" delta="+12%" deltaType="up" />
      <StatCard eyebrow="MRR" value="$184k" delta="+3.4%" deltaType="up" />
      <StatCard eyebrow="Churn rate" value="1.2%" delta="-0.3%" deltaType="down" />
      <StatCard eyebrow="Avg. LTV" value="$4,120" />
    </div>
  ),
}

export const WithFooter: Story = {
  name: 'With footer',
  render: () => (
    <div style={{ maxWidth: 240 }}>
      <StatCard
        eyebrow="Active accounts"
        value="2,418"
        delta="+12%"
        deltaType="up"
        footer={<span>vs last 30 days</span>}
      />
    </div>
  ),
}
