import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'
import { Button } from '../Button'

const meta: Meta<typeof Tooltip> = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'CSS-only tooltip triggered on hover or focus-within. No JavaScript — zero runtime overhead. Uses role="tooltip" and aria-describedby for accessibility.',
      },
    },
  },
  argTypes: {
    content: { control: 'text', description: 'Tooltip text' },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Preferred direction',
    },
  },
  args: {
    content: 'Runs your AI visibility scan',
    position: 'top',
  },
}

export default meta
type Story = StoryObj<typeof Tooltip>

/** Interactive playground — edit the content or position via Controls. */
export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 48, display: 'flex', justifyContent: 'center' }}>
      <Tooltip {...args}>
        <Button>Analyse profile</Button>
      </Tooltip>
    </div>
  ),
}

export const MultipleTooltips: Story = {
  name: 'Multiple tooltips',
  render: () => (
    <div style={{ padding: 48, display: 'flex', gap: 16, justifyContent: 'center' }}>
      <Tooltip content="Edit this entry">
        <Button variant="secondary" size="sm">Edit</Button>
      </Tooltip>
      <Tooltip content="Delete permanently — cannot be undone">
        <Button variant="danger" size="sm">Delete</Button>
      </Tooltip>
      <Tooltip content="Download as PDF">
        <Button variant="ghost" size="sm">Export</Button>
      </Tooltip>
    </div>
  ),
}
