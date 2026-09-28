import type { Meta, StoryObj } from '@storybook/react'
import { TreeMapChart } from './TreeMapChart'

const meta: Meta<typeof TreeMapChart> = {
  title: 'Charts/TreeMapChart',
  component: TreeMapChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A treemap on Highcharts for showing relative size across categories, tile area proportional to value.',
      },
    },
  },
  argTypes: {
    isLoading: { control: 'boolean' },
    chartHeight: { control: { type: 'range', min: 200, max: 600, step: 20 } },
  },
  args: {
    data: [
      { name: 'Plumbing', value: 45 },
      { name: 'Electrical', value: 30 },
      { name: 'HVAC', value: 15 },
      { name: 'Roofing', value: 10 },
    ],
    title: 'Service Mix',
    chartHeight: 400,
  },
}

export default meta
type Story = StoryObj<typeof TreeMapChart>

export const Default: Story = {}

export const Loading: Story = {
  args: { isLoading: true },
}
