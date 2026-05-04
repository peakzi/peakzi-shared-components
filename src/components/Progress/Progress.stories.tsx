import type { Meta, StoryObj } from '@storybook/react'
import { Progress, Ring, Spinner, Skeleton } from './Progress'

const meta: Meta<typeof Progress> = {
  title: 'Components/Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Progress indicators: linear bar, circular ring, spinner, and skeleton placeholder.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Progress value 0–100' },
    label: { control: 'text', description: 'Accessible label' },
    variant: {
      control: 'select',
      options: ['default', 'gradient', 'success', 'warning', 'danger'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { value: 65, label: 'AI Score', variant: 'default', size: 'md' },
}

export default meta
type Story = StoryObj<typeof Progress>

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

export const Default: Story = {}

export const AllVariants: Story = {
  name: 'Bar — all variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      {(['default', 'gradient', 'success', 'warning', 'danger'] as const).map((v) => (
        <div key={v} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)' }}>{v}</span>
          <Progress value={70} variant={v} label={v} />
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  name: 'Bar — sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      <Progress value={60} size="sm" label="Small" />
      <Progress value={60} label="Medium (default)" />
      <Progress value={60} size="lg" label="Large" />
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Ring
// ---------------------------------------------------------------------------

export const RingStory: StoryObj<typeof Ring> = {
  name: 'Ring',
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <Ring value={72} size={80} label="72" aria-label="AI Score: 72%" />
      <Ring value={45} size={60} aria-label="Score: 45%" />
      <Ring value={91} size={100} label="91" aria-label="Score: 91%" />
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

export const SpinnerStory: StoryObj<typeof Spinner> = {
  name: 'Spinner',
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Spinner size="sm" label="Loading small" />
      <Spinner label="Loading" />
      <Spinner size="lg" label="Loading large" />
      <Spinner variant="gradient" label="Loading gradient" />
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

export const SkeletonStory: StoryObj<typeof Skeleton> = {
  name: 'Skeleton',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton variant="circle" width={40} height={40} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="50%" />
        </div>
      </div>
      <Skeleton height={120} />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
    </div>
  ),
}
