import type { Meta, StoryObj } from '@storybook/react'
import { BarChart2, ArrowRight, Settings } from 'lucide-react'
import { Card, CardTitle, CardBody, CardFooter, Stat } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Components/Surfaces/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Flexible card surface with multiple variants. Compose with `CardTitle` and `CardBody` sub-components for consistent typography.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'hoverable', 'elevated', 'inset', 'dark', 'gradient'],
      description: 'Visual style of the card',
    },
  },
  args: {
    variant: 'default',
  },
}

export default meta
type Story = StoryObj<typeof Card>

/** Interactive playground — switch variants via the Controls panel. */
export const Default: Story = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: 360 }}>
      <CardTitle>AI Visibility Score</CardTitle>
      <CardBody>
        Your business is referenced in 14 AI-generated answers this week — up 23% from last week.
      </CardBody>
    </Card>
  ),
}

export const Hoverable: Story = {
  render: () => (
    <Card variant="hoverable" style={{ maxWidth: 360 }}>
      <CardTitle>Hover me</CardTitle>
      <CardBody>This card lifts on hover — great for clickable list items.</CardBody>
    </Card>
  ),
}

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" style={{ maxWidth: 360 }}>
      <CardTitle>Elevated card</CardTitle>
      <CardBody>Uses a box-shadow instead of a border to separate from the background.</CardBody>
    </Card>
  ),
}

export const Inset: Story = {
  render: () => (
    <Card variant="inset" style={{ maxWidth: 360 }}>
      <CardTitle>Inset card</CardTitle>
      <CardBody>Appears recessed into the page — good for secondary content areas.</CardBody>
    </Card>
  ),
}

export const Dark: Story = {
  render: () => (
    <Card variant="dark" style={{ maxWidth: 360 }}>
      <CardTitle>Dark card</CardTitle>
      <CardBody>Navy background — works on light and dark backgrounds alike.</CardBody>
    </Card>
  ),
}

export const Gradient: Story = {
  render: () => (
    <Card variant="gradient" style={{ maxWidth: 360 }}>
      <CardTitle>Gradient card</CardTitle>
      <CardBody>Brand gradient with glow shadow — use for featured or hero content.</CardBody>
    </Card>
  ),
}

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
      {(['default', 'hoverable', 'elevated', 'inset', 'dark', 'gradient'] as const).map(
        (variant) => (
          <Card key={variant} variant={variant}>
            <CardTitle>{variant}</CardTitle>
            <CardBody>Example card content for the {variant} variant.</CardBody>
          </Card>
        ),
      )}
    </div>
  ),
}

export const WithTitleIcon: Story = {
  name: 'Title with icon',
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <CardTitle titleIcon={<BarChart2 size={16} />}>AI Visibility Score</CardTitle>
      <CardBody>Your business appeared in 14 AI-generated answers this week.</CardBody>
    </Card>
  ),
}

export const WithTitleIconMultiline: Story = {
  name: 'Title with icon — multiline',
  render: () => (
    <Card style={{ maxWidth: 200 }}>
      <CardTitle titleIcon={<BarChart2 size={16} />}>Licensed experts in your area</CardTitle>
      <CardBody>Icon stays pinned to the first line of the title even when text wraps.</CardBody>
    </Card>
  ),
}

export const WithActionButton: Story = {
  name: 'Title with action button',
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <CardTitle actionButton={<a href="/all" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--fg-link)', fontSize: 'var(--text-sm)' }}>View all <ArrowRight size={14} /></a>}>
        Recent Activity
      </CardTitle>
      <CardBody>You have 3 new citations this week across ChatGPT and Perplexity.</CardBody>
    </Card>
  ),
}

export const WithTitleIconAndAction: Story = {
  name: 'Title with icon + action',
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <CardTitle
        titleIcon={<Settings size={16} />}
        actionButton={<a href="/settings" style={{ color: 'var(--fg-link)', fontSize: 'var(--text-sm)' }}>Edit</a>}
      >
        Account Settings
      </CardTitle>
      <CardBody>Manage your profile, billing, and notification preferences.</CardBody>
    </Card>
  ),
}

export const CenterAligned: Story = {
  name: 'Title center aligned',
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <CardTitle centerAlign titleIcon={<BarChart2 size={16} />}>AI Visibility Score</CardTitle>
      <CardBody>Your business appeared in 14 AI-generated answers this week.</CardBody>
    </Card>
  ),
}

export const CenterAlignedComparison: Story = {
  name: 'Center align — default vs centered',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
      <Card>
        <CardTitle titleIcon={<BarChart2 size={16} />}>Default alignment</CardTitle>
        <CardBody>Leading (left) — the default.</CardBody>
      </Card>
      <Card>
        <CardTitle centerAlign titleIcon={<BarChart2 size={16} />}>Center aligned</CardTitle>
        <CardBody>Centered — pass centerAlign.</CardBody>
      </Card>
    </div>
  ),
}

export const WithFooter: Story = {
  name: 'Card with footer',
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <CardTitle>AI Visibility Score</CardTitle>
      <CardBody>Your business appeared in 14 AI-generated answers this week — up 23% from last week.</CardBody>
      <CardFooter>Last updated · 2 hours ago</CardFooter>
    </Card>
  ),
}

export const FullComposition: Story = {
  name: 'Full composition',
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <CardTitle
        titleIcon={<BarChart2 size={16} />}
        actionButton={<a href="/details" style={{ color: 'var(--fg-link)', fontSize: 'var(--text-sm)' }}>Details</a>}
      >
        AI Visibility Score
      </CardTitle>
      <CardBody>Your business appeared in 14 AI-generated answers this week — up 23% from last week.</CardBody>
      <CardFooter>Last updated · 2 hours ago</CardFooter>
    </Card>
  ),
}

export const StatCard: Story = {
  name: 'Stat card',
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Card style={{ minWidth: 180 }}>
        <Stat eyebrow="AI Citations" value="14" delta="23% this week" deltaType="up" />
      </Card>
      <Card style={{ minWidth: 180 }}>
        <Stat eyebrow="Review score" value="4.8" delta="0.2 pts" deltaType="down" />
      </Card>
      <Card style={{ minWidth: 180 }}>
        <Stat eyebrow="Leads converted" value="91%" />
      </Card>
    </div>
  ),
}
