import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Segmented } from './Segmented'

const meta: Meta<typeof Segmented> = {
  title: 'Components/Inputs/Segmented',
  component: Segmented,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Pill-style segmented control for 2–4 short options. Use Select for more options.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Segmented>

export const Default: Story = {
  render: function DefaultStory() {
    const [mode, setMode] = useState('blog')
    return (
      <Segmented
        aria-label="Generator mode"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'blog',   label: 'Blog' },
          { value: 'social', label: 'Social' },
          { value: 'email',  label: 'Email' },
        ]}
      />
    )
  },
}

export const Small: Story = {
  render: function SmallStory() {
    const [env, setEnv] = useState('prod')
    return (
      <Segmented
        aria-label="Environment"
        value={env}
        onChange={setEnv}
        size="sm"
        options={[
          { value: 'prod',    label: 'Prod' },
          { value: 'staging', label: 'Staging' },
          { value: 'dev',     label: 'Dev' },
        ]}
      />
    )
  },
}

export const WithDisabled: Story = {
  name: 'With disabled option',
  render: function DisabledStory() {
    const [val, setVal] = useState('monthly')
    return (
      <Segmented
        aria-label="Billing period"
        value={val}
        onChange={setVal}
        options={[
          { value: 'monthly',  label: 'Monthly' },
          { value: 'annual',   label: 'Annual' },
          { value: 'lifetime', label: 'Lifetime', disabled: true },
        ]}
      />
    )
  },
}
