import type { Meta, StoryObj } from '@storybook/react'
import { TimeSeriesChart } from './TimeSeriesChart'

const meta: Meta<typeof TimeSeriesChart> = {
  title: 'Charts/TimeSeriesChart',
  component: TimeSeriesChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A time-axis line/area/spline chart on Highcharts, for trend data plotted at a fixed interval (`pointStart` + `pointInterval`).',
      },
    },
  },
  argTypes: {
    type: { control: 'select', options: ['line', 'area', 'spline'] },
    isLoading: { control: 'boolean' },
    legendEnabled: { control: 'boolean' },
    chartHeight: { control: { type: 'range', min: 200, max: 500, step: 20 } },
  },
  args: {
    series: [{ name: 'Visits', data: [120, 150, 90, 200, 180, 260, 240] }],
    pointStart: Date.UTC(2026, 0, 1),
    pointInterval: 24 * 3600 * 1000,
    chartHeight: 300,
  },
}

export default meta
type Story = StoryObj<typeof TimeSeriesChart>

export const Default: Story = {}

export const Area: Story = {
  args: { type: 'area' },
}

export const Loading: Story = {
  args: { isLoading: true },
}

export const MultipleSeries: Story = {
  name: 'Multiple series',
  args: {
    series: [
      { name: 'This week', data: [120, 150, 90, 200, 180, 260, 240] },
      { name: 'Last week', data: [100, 130, 110, 170, 160, 220, 210] },
    ],
    subtitle: 'Compared to the previous 7 days',
  },
}
