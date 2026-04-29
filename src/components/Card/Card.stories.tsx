import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardTitle, CardBody, Stat } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Surfaces/Card',
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
