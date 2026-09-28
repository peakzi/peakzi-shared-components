import type { Meta, StoryObj } from '@storybook/react'
import { GaugeChart } from './GaugeChart'

const meta: Meta<typeof GaugeChart> = {
  title: 'Charts/GaugeChart',
  component: GaugeChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A compact solid-gauge for a single KPI value against a max. `unit` is fully caller-controlled — pass `%`, a currency symbol, or nothing.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    maxValue: { control: { type: 'number' } },
  },
  args: { value: 72, maxValue: 100, unit: '%' },
}

export default meta
type Story = StoryObj<typeof GaugeChart>

export const Default: Story = {}

export const NoUnit: Story = {
  name: 'Unitless value',
  args: { value: 4.2, maxValue: 5, unit: '' },
}

export const CustomUnit: Story = {
  name: 'Custom unit',
  args: { value: 850, maxValue: 1000, unit: ' pts' },
}
