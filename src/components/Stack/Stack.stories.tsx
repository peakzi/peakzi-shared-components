import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from './Stack'
import { Badge } from '../Badge'
import { Button } from '../Button'

const meta: Meta<typeof Stack> = {
  title: 'Components/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A single flex row or column for a fixed handful of different things sitting together.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Stack>

export const TitleRow: Story = {
  name: 'Title row (icon + text + badge)',
  render: () => (
    <Stack direction="row" align="center" gap="sm">
      <span style={{ flex: 1, fontWeight: 600 }}>Risk — Price perception is your weakest customer score</span>
      <Badge variant="danger">Risk</Badge>
    </Stack>
  ),
}

export const ButtonGroup: Story = {
  name: 'Button group',
  render: () => (
    <Stack direction="row" gap="sm">
      <Button variant="ghost" size="sm">Export</Button>
      <Button variant="primary" size="sm">New account</Button>
    </Stack>
  ),
}

export const StackedColumn: Story = {
  name: 'Column stack',
  render: () => (
    <Stack direction="column" gap="xs">
      <span>Baker Brothers (you) — 2.81 of 5</span>
      <span>Dub&apos;s Heating and Air Inc — 3.96 of 5</span>
    </Stack>
  ),
}
