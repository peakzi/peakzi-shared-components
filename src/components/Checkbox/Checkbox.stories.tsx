import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox, Radio } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible checkbox and radio controls using native `<input>` elements paired with visible custom styling.',
      },
    },
  },
  argTypes: {
    children: { control: 'text', description: 'Checkbox label' },
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
  args: {
    children: 'Email me weekly score updates',
    disabled: false,
    defaultChecked: false,
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

/** Interactive playground — toggle disabled or defaultChecked via Controls. */
export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true, children: 'Include podcast transcripts' },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Disabled option' },
}

export const DisabledChecked: Story = {
  name: 'Disabled checked',
  args: { disabled: true, defaultChecked: true, children: 'Disabled + checked' },
}

export const CheckboxGroup: Story = {
  name: 'Checkbox group',
  render: function CheckboxGroupStory() {
    const [weekly, setWeekly] = useState(true)
    const [transcripts, setTranscripts] = useState(false)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Checkbox checked={weekly} onChange={(e) => setWeekly(e.target.checked)}>
          Email me weekly score updates
        </Checkbox>
        <Checkbox checked={transcripts} onChange={(e) => setTranscripts(e.target.checked)}>
          Include podcast transcripts
        </Checkbox>
        <Checkbox disabled>Disabled option</Checkbox>
      </div>
    )
  },
}

export const RadioGroup: Story = {
  name: 'Radio group',
  render: function RadioGroupStory() {
    const [value, setValue] = useState('contractor')
    const options = [
      { val: 'contractor', label: 'Contractor' },
      { val: 'tech', label: 'Technician' },
      { val: 'homeowner', label: 'Homeowner' },
    ]
    return (
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend
          style={{
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            color: 'var(--fg-1)',
            marginBottom: 10,
          }}
        >
          Audience
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map((o) => (
            <Radio
              key={o.val}
              name="audience"
              value={o.val}
              checked={value === o.val}
              onChange={() => setValue(o.val)}
            >
              {o.label}
            </Radio>
          ))}
        </div>
      </fieldset>
    )
  },
}
