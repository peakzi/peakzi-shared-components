import type { Meta, StoryObj } from '@storybook/react'
import { PieChart } from './PieChart'

const meta: Meta<typeof PieChart> = {
  title: 'Charts/PieChart',
  component: PieChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A pie chart on Highcharts for showing a breakdown of parts relative to a whole.',
      },
    },
  },
  argTypes: {
    isLoading: { control: 'boolean' },
    chartHeight: { control: { type: 'range', min: 200, max: 500, step: 20 } },
  },
  args: {
    data: [
      { name: 'Organic', value: 42 },
      { name: 'Paid', value: 28 },
      { name: 'Referral', value: 18 },
      { name: 'Direct', value: 12 },
    ],
    title: 'Traffic Sources',
    chartHeight: 380,
  },
}

export default meta
type Story = StoryObj<typeof PieChart>

export const Default: Story = {}

export const Loading: Story = {
  args: { isLoading: true },
}

export const TwoSlices: Story = {
  name: 'Two slices',
  args: {
    data: [
      { name: 'Won', value: 65 },
      { name: 'Lost', value: 35 },
    ],
    title: 'Trade Demand',
  },
}
