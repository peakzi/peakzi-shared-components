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

export const Tone: Story = {
  name: 'Tone (sentiment text color)',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
      <StatCard eyebrow="New reviews" value="0 negative" footer="Nothing new to react to this week." tone="success" />
      <StatCard eyebrow="Offer deadline" value="Expires 2 Sept" footer="Renew or replace it soon." tone="warning" />
      <StatCard eyebrow="Job demand" value="Down 3% this week" footer="In line with the market." tone="info" />
    </div>
  ),
}

export const StandingSize: Story = {
  name: 'Standing strip (size="sm")',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
      <StatCard eyebrow="Review rating" value="4.9 stars" footer="Among the highest tracked" size="sm" />
      <StatCard eyebrow="Market share" value="11.6%" footer="Nearly double the cohort average" size="sm" />
    </div>
  ),
}
