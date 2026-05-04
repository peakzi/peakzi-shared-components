import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarStack } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Data Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'User avatar with image, initials fallback, size variants, status dot, and stack composition.',
      },
    },
  },
  argTypes: {
    initials: { control: 'text', description: 'Fallback initials when no image src' },
    alt: { control: 'text', description: 'Accessible label' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    variant: { control: 'select', options: ['default', 'gradient'] },
    status: { control: 'select', options: [undefined, 'online', 'away', 'busy', 'offline'] },
    ring: { control: 'boolean' },
  },
  args: {
    initials: 'PZ',
    alt: 'Peakzi user',
    size: 'md',
    variant: 'default',
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

/** Interactive playground — change any control to update the avatar. */
export const Default: Story = {}

export const Initials: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar initials="JR" alt="Jordan Reyes" />
      <Avatar initials="AR" alt="Ana Ruiz" variant="gradient" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <Avatar key={s} size={s} initials="PZ" alt={`Avatar ${s}`} />
      ))}
    </div>
  ),
}

export const WithStatus: Story = {
  name: 'With status dot',
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar initials="JR" status="online" alt="Online user" />
      <Avatar initials="AR" status="away" alt="Away user" />
      <Avatar initials="MK" status="busy" alt="Busy user" />
      <Avatar initials="LT" status="offline" alt="Offline user" />
    </div>
  ),
}

export const WithRing: Story = {
  name: 'With ring',
  render: () => <Avatar initials="PZ" ring alt="Peakzi" />,
}

export const Stack: Story = {
  render: () => (
    <AvatarStack>
      <Avatar initials="JR" alt="Jordan Reyes" />
      <Avatar initials="AR" alt="Ana Ruiz" variant="gradient" />
      <Avatar initials="MK" alt="Marcus Kim" />
      <Avatar initials="+2" alt="2 more users" />
    </AvatarStack>
  ),
}
