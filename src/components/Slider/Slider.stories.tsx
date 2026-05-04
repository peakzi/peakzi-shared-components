import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Slider } from './Slider'

const meta: Meta<typeof Slider> = {
  title: 'Components/Inputs/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Range slider with branded thumb, size variants, and an optional label via `text` + `textPosition` props.',
      },
    },
  },
  argTypes: {
    text: { control: 'text', description: 'Label text rendered alongside the slider' },
    textPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Position of the label relative to the track',
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: {
    text: 'Visibility threshold',
    textPosition: 'top',
    size: 'md',
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof Slider>

/** Interactive playground — adjust text, textPosition, size via Controls. */
export const Default: Story = {
  render: function DefaultStory(args) {
    const [value, setValue] = useState(72)
    return (
      <div style={{ maxWidth: 360 }}>
        <Slider
          {...args}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label={args.text ?? 'Slider'}
        />
      </div>
    )
  },
}

export const LabelPositions: Story = {
  name: 'Label positions',
  render: () => (
    <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Slider text="Top (default)" textPosition="top" defaultValue={40} aria-label="Top" />
      <Slider text="Bottom" textPosition="bottom" defaultValue={55} aria-label="Bottom" />
      <Slider text="Left" textPosition="left" defaultValue={70} aria-label="Left" />
      <Slider text="Right" textPosition="right" defaultValue={30} aria-label="Right" />
    </div>
  ),
}

export const Sizes: Story = {
  name: 'All sizes',
  render: () => (
    <div style={{ maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Slider text="Small" size="sm" defaultValue={30} aria-label="Small slider" />
      <Slider text="Medium (default)" size="md" defaultValue={55} aria-label="Medium slider" />
      <Slider text="Large" size="lg" defaultValue={80} aria-label="Large slider" />
    </div>
  ),
}

export const WithoutLabel: Story = {
  name: 'Without label',
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Slider defaultValue={40} aria-label="Volume" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Slider text="Locked threshold" disabled defaultValue={60} aria-label="Locked slider" />
    </div>
  ),
}
