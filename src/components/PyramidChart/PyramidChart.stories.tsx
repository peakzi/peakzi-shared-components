import type { Meta, StoryObj } from '@storybook/react'
import { PyramidChart } from './PyramidChart'

const meta: Meta<typeof PyramidChart> = {
  title: 'Charts/PyramidChart',
  component: PyramidChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A funnel/pyramid chart on Highcharts for size-tiered distributions (e.g. business size by employee count). Values are log-scaled internally for visual balance, then reversed for display — the chart shows real counts, not the log values. Has no built-in empty state; pass `emptyState` for what to show when every value is zero.',
      },
    },
  },
  argTypes: {
    isLoading: { control: 'boolean' },
    chartHeight: { control: { type: 'range', min: 200, max: 600, step: 20 } },
  },
  args: {
    data: [
      ['1-10 employees', 420],
      ['11-50 employees', 180],
      ['51-200 employees', 60],
      ['200+ employees', 15],
    ],
    chartHeight: 415,
  },
}

export default meta
type Story = StoryObj<typeof PyramidChart>

export const Default: Story = {}

export const Loading: Story = {
  args: { isLoading: true },
}

export const EmptyState: Story = {
  name: 'Empty state',
  args: {
    data: [
      ['1-10 employees', 0],
      ['11-50 employees', 0],
    ],
    emptyState: <p style={{ textAlign: 'center', padding: '2rem' }}>No business-size data available for this market.</p>,
  },
}
