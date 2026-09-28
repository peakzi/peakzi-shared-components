import type { Meta, StoryObj } from '@storybook/react'
import { RadialGauge } from './RadialGauge'

const meta: Meta<typeof RadialGauge> = {
  title: 'Charts/RadialGauge',
  component: RadialGauge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A generic full-circle solid-gauge with a slot for center content — the mechanical primitive behind a branded score meter. Compose it with your own logo/icon via `centerContent` rather than hardcoding one into the chart.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: { type: 'range', min: 60, max: 240, step: 10 } },
  },
  args: { value: 72, maxValue: 100, size: 140 },
}

export default meta
type Story = StoryObj<typeof RadialGauge>

export const Default: Story = {}

export const WithCenterContent: Story = {
  name: 'With center content',
  args: {
    centerContent: (
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-brand)' }} />
    ),
  },
}

export const CustomColors: Story = {
  name: 'Custom colors',
  args: { colors: ['#17b26a', '#0e7e49'] },
}
