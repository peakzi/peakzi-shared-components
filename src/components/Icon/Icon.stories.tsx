import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '../Card'
import { Grid } from '../Grid'
import { Stack } from '../Stack'
import { Icon } from './Icon'
import { iconNames } from './registry'
import './Icon.stories.scss'

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'One Icon API for Font Awesome and custom artwork. Names come from the registry. Only required Font Awesome definitions are imported; custom SVGs live in Icon/customIcon. Defaults to black and 24px; pass color and size from your app. Label the containing link or pass title/aria-label for a standalone icon.',
      },
    },
  },
  argTypes: {
    name: { control: 'select', options: iconNames },
    color: { control: 'color' },
    size: { control: 'number' },
    title: { control: 'text' },
  },
  args: { name: 'facebook', color: 'black', size: 24, title: 'Facebook' },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const AllIcons: Story = {
  render: ({ color, size }) => (
    <Grid columns={3} gap="md">
      {iconNames.map((name) => (
        <Card key={name}>
          <Stack direction="column" gap="sm" align="center">
            <Icon name={name} color={color} size={size} />
            <span>{name === 'twitter' ? 'X (twitter)' : name}</span>
          </Stack>
        </Card>
      ))}
    </Grid>
  ),
}

export const ThemeColour: Story = {
  args: { name: 'youtube', color: 'var(--fg-1)', title: 'YouTube' },
}

export const GeminiColour: Story = {
  args: { name: 'gemini-color', title: 'Gemini' },
}

export const OnDarkSurfaces: Story = {
  render: ({ size }) => (
    <Grid columns={3} gap="md">
      {iconNames.map((name) => (
        <Card key={name} variant="dark">
          <Stack direction="column" gap="sm" align="center">
            <Icon name={name} color="currentColor" size={size} />
            <span className="pz-icon-story__dark-name">{name === 'twitter' ? 'X (twitter)' : name}</span>
          </Stack>
        </Card>
      ))}
    </Grid>
  ),
}

export const Sizes: Story = {
  render: ({ name, color }) => (
    <Stack gap="lg" align="center">
      {[16, 24, 32, 48].map((size) => (
        <Stack key={size} direction="column" gap="sm" align="center">
          <Icon name={name} color={color} size={size} />
          <span>{size}px</span>
        </Stack>
      ))}
    </Stack>
  ),
}

export const InLabelledLink: Story = {
  render: (args) => (
    <a href="https://www.facebook.com/AllAmericanPHA" target="_blank" rel="noopener noreferrer" aria-label="Facebook (opens in a new tab)">
      <Icon {...args} title="" />
    </a>
  ),
}
