import type { Meta, StoryObj } from '@storybook/react'
import { ColumnChart } from './ColumnChart'

const meta: Meta<typeof ColumnChart> = {
  title: 'Charts/ColumnChart',
  component: ColumnChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Column, bar, and line charts on Highcharts. Pass `data` for a single series, or `series` for multiple named series (add `stacked` to stack them). Requires `highcharts` and `highcharts-react-official` as peer dependencies.',
      },
    },
  },
  argTypes: {
    type: { control: 'select', options: ['column', 'bar', 'line'] },
    isLoading: { control: 'boolean' },
    stacked: { control: 'boolean' },
    chartHeight: { control: { type: 'range', min: 200, max: 600, step: 20 } },
  },
  args: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [120, 180, 90, 240, 200, 260],
    title: 'Monthly Visits',
    yAxisTitle: 'Visits',
    chartHeight: 360,
  },
}

export default meta
type Story = StoryObj<typeof ColumnChart>

export const Default: Story = {}

export const Bar: Story = {
  args: { type: 'bar' },
}

export const Line: Story = {
  args: { type: 'line' },
}

export const Loading: Story = {
  args: { isLoading: true },
}

export const MultiSeriesGrouped: Story = {
  name: 'Multiple series — grouped',
  args: {
    data: undefined,
    series: [
      { name: 'This year', data: [120, 180, 90, 240, 200, 260] },
      { name: 'Last year', data: [100, 140, 80, 190, 170, 210] },
    ],
  },
}

export const MultiSeriesStacked: Story = {
  name: 'Multiple series — stacked',
  args: {
    data: undefined,
    stacked: true,
    series: [
      { name: 'Organic', data: [80, 100, 60, 140, 120, 150] },
      { name: 'Paid', data: [40, 80, 30, 100, 80, 110] },
    ],
  },
}
