import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Badge, Chip, BadgeAnchor } from './Badge'

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

// ---------------------------------------------------------------------------
// BadgeAnchor stories
// ---------------------------------------------------------------------------

const IconBox = ({ label }: { label: string }) => (
  <div
    style={{
      width: 40,
      height: 40,
      borderRadius: 8,
      background: '#e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      color: '#374151',
    }}
  >
    {label}
  </div>
)

export const AnchorCount: Story = {
  name: 'BadgeAnchor — count',
  render: () => (
    <div style={{ display: 'flex', gap: 32, padding: 24, alignItems: 'center' }}>
      <BadgeAnchor content={3} variant="danger">
        <IconBox label="Bell" />
      </BadgeAnchor>
      <BadgeAnchor content={12} variant="brand">
        <IconBox label="Mail" />
      </BadgeAnchor>
      <BadgeAnchor content="New" variant="success">
        <IconBox label="Inbox" />
      </BadgeAnchor>
    </div>
  ),
}

export const AnchorDot: Story = {
  name: 'BadgeAnchor — dot (no content)',
  render: () => (
    <div style={{ display: 'flex', gap: 32, padding: 24, alignItems: 'center' }}>
      <BadgeAnchor variant="danger">
        <IconBox label="Bell" />
      </BadgeAnchor>
      <BadgeAnchor variant="success">
        <IconBox label="User" />
      </BadgeAnchor>
      <BadgeAnchor variant="warning">
        <IconBox label="Alert" />
      </BadgeAnchor>
    </div>
  ),
}

export const AnchorPositions: Story = {
  name: 'BadgeAnchor — all positions',
  render: () => (
    <div style={{ display: 'flex', gap: 48, padding: 32, alignItems: 'center' }}>
      <BadgeAnchor content={1} position="top-right">
        <IconBox label="TR" />
      </BadgeAnchor>
      <BadgeAnchor content={1} position="top-left">
        <IconBox label="TL" />
      </BadgeAnchor>
      <BadgeAnchor content={1} position="bottom-right">
        <IconBox label="BR" />
      </BadgeAnchor>
      <BadgeAnchor content={1} position="bottom-left">
        <IconBox label="BL" />
      </BadgeAnchor>
    </div>
  ),
}
