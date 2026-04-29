import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Switch, Slider } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Inputs/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Toggle switch using a native checkbox with role="switch", and a range slider with branded thumb.',
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

export const SliderStory: StoryObj<typeof Slider> = {
  name: 'Slider',
  render: function SliderStory() {
    const [value, setValue] = useState(72)
    return (
      <div
        style={{
          width: '100%',
          maxWidth: 360,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 13,
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--fg-1)' }}>Visibility threshold</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--fg-accent)',
              fontWeight: 600,
            }}
          >
            {value}
          </span>
        </div>
        <Slider
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label="Visibility threshold"
        />
      </div>
    )
  },
}
