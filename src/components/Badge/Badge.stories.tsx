import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Badge, Chip } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Components/Surfaces/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Small inline labels for status, categories, and counts. Use `Chip` for dismissible tags.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'brand', 'gradient', 'success', 'warning', 'danger', 'info', 'outline'],
      description: 'Visual style of the badge',
    },
    size: { control: 'select', options: ['sm', 'lg'], description: 'Badge size' },
    dot: { control: 'boolean', description: 'Show status dot' },
    children: { control: 'text', description: 'Badge label' },
  },
  args: {
    children: 'Badge',
    variant: 'brand',
    size: 'sm',
    dot: false,
  },
}

export default meta
type Story = StoryObj<typeof Badge>

/** Interactive playground — change any control to see the badge update. */
export const Default: Story = {}

const VARIANTS = [
  'neutral',
  'brand',
  'gradient',
  'success',
  'warning',
  'danger',
  'info',
  'outline',
] as const

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      {VARIANTS.map((v) => (
        <Badge key={v} variant={v}>
          {v}
        </Badge>
      ))}
    </div>
  ),
}

export const WithDot: Story = {
  name: 'With dot',
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="success" dot>Active</Badge>
      <Badge variant="warning" dot>Pending</Badge>
      <Badge variant="danger" dot>Offline</Badge>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge variant="brand">Small (default)</Badge>
      <Badge variant="brand" size="lg">Large</Badge>
    </div>
  ),
}

export const ChipStory: Story = {
  name: 'Chip (dismissible)',
  render: function ChipStory() {
    const [tags, setTags] = useState(['HVAC', 'Plumbing', 'Electrical', 'Roofing'])
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            onClose={() => setTags((prev) => prev.filter((t) => t !== tag))}
            closeLabel={`Remove ${tag}`}
          >
            {tag}
          </Chip>
        ))}
      </div>
    )
  },
}
