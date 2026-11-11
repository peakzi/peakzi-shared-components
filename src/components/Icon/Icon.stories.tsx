import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Icon } from './Icon'

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Reusable local SVG icons. Monochrome artwork inherits text color. Gemini also has the supplied multicolor variant; icons without color artwork fall back to monochrome. Icons are decorative unless title, aria-label or aria-labelledby supplies an accessible name. Use a labelled link or button for interactions. Available through the root package or @peakzi/components/Icon.' } },
  },
  argTypes: {
    name: { control: 'select', options: ['chatgpt', 'gemini'] },
    variant: { control: 'inline-radio', options: ['monochrome', 'color'] },
    size: { control: 'number' },
    title: { control: 'text' },
  },
  args: { name: 'gemini', size: 32, variant: 'monochrome', title: 'Gemini' },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const ChatGPT: Story = { args: { name: 'chatgpt', title: 'ChatGPT' } }
export const Gemini: Story = {}
export const GeminiColor: Story = { args: { variant: 'color' } }
export const AllIcons: Story = {
  render: () => <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
    <Icon name="chatgpt" title="ChatGPT" size={40} />
    <Icon name="gemini" title="Gemini" size={40} />
    <Icon name="gemini" variant="color" title="Gemini in color" size={40} />
  </div>,
}
export const InButtons: Story = {
  render: () => <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
    <Button variant="secondary"><Icon name="chatgpt" size="1em" /> Ask ChatGPT</Button>
    <Button variant="secondary"><Icon name="gemini" variant="color" size="1em" /> Ask Gemini</Button>
  </div>,
}
