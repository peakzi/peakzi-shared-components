import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Inputs/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Toggle switch using a native checkbox with role="switch".',
      },
    },
  },
  argTypes: {
    children: { control: 'text', description: 'Switch label' },
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
  args: {
    children: 'Notify me when AI cites my profile',
    disabled: false,
    defaultChecked: false,
  },
}

export default meta
type Story = StoryObj<typeof Switch>

/** Interactive playground — toggle disabled or defaultChecked via Controls. */
export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true, children: 'Auto-publish blog drafts' },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Disabled switch' },
}

export const SwitchGroup: Story = {
  name: 'Switch group',
  render: function SwitchGroupStory() {
    const [notify, setNotify] = useState(true)
    const [publish, setPublish] = useState(false)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Switch checked={notify} onChange={(e) => setNotify(e.target.checked)}>
          Notify me when AI cites my profile
        </Switch>
        <Switch checked={publish} onChange={(e) => setPublish(e.target.checked)}>
          Auto-publish blog drafts
        </Switch>
        <Switch disabled>Locked by admin</Switch>
      </div>
    )
  },
}
