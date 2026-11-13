import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Card } from '../Card'
import { Grid } from '../Grid'
import { Stack } from '../Stack'
import { Icon } from './Icon'
import { iconDefinitions } from './icons'
import './Icon.stories.scss'

const names = Object.keys(iconDefinitions) as (keyof typeof iconDefinitions)[]

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: `One SVG API for local artwork, usable in React and Next.js. Monochrome inherits currentColor; color preserves the supplied brand colors. Icons are decorative unless title or an ARIA label supplies a name. Use a labelled link/button for interactions. Imports: @peakzi/components or @peakzi/components/Icon.

Supported names: ${names.join(', ')}.

Treatments: Angi and BBB have filled and outline artwork. Google Business is outline only; the remaining icons use filled artwork. Yelp uses its burst symbol. Color artwork is available for Gemini, Facebook, Instagram, YouTube, X, LinkedIn, Yelp and filled Angi. X, LinkedIn and Yelp also provide dark-surface original artwork. surface does not set a background or repaint monochrome icons. Unsupported appearance/color requests fall back to available artwork, reported by data-icon-* attributes. No missing brand treatments are invented.

size sets both dimensions; native width/height can override them independently. All artwork preserves its proportions. YouTube uses the original Illustrator paths. LinkedIn uses vector contours fitted to the supplied PNG silhouettes, including their registered marks. Neither uses bitmap masks or filters. Instagram alone retains a small 128×128 JPEG gradient (about 3 KB) within its original vector silhouette. Brand colors are artwork constants, not theme tokens; monochrome is an explicit consumer treatment and does not imply brand approval.` } },
  },
  argTypes: {
    name: { control: 'select', options: names },
    variant: { control: 'inline-radio', options: ['monochrome', 'color'] },
    appearance: { control: 'inline-radio', options: ['filled', 'outline'] },
    surface: { control: 'inline-radio', options: ['light', 'dark'] },
    size: { control: 'number' },
    title: { control: 'text' },
  },
  args: { name: 'gemini', size: 32, variant: 'monochrome', appearance: 'filled', surface: 'light', title: 'Gemini' },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const ChatGPT: Story = { args: { name: 'chatgpt', title: 'ChatGPT' } }
export const Gemini: Story = {}
export const GeminiColor: Story = { args: { variant: 'color' } }
export const Angi: Story = { args: { name: 'angi', title: 'Angi' } }
export const AngiColor: Story = { args: { name: 'angi', variant: 'color', title: 'Angi' } }
export const AngiOutline: Story = { args: { name: 'angi', appearance: 'outline', title: 'Angi' } }
export const BBB: Story = { args: { name: 'bbb', title: 'Better Business Bureau' } }
export const BBBOutline: Story = { args: { name: 'bbb', appearance: 'outline', title: 'Better Business Bureau' } }
export const AllIcons: Story = {
  parameters: { layout: 'padded' },
  render: () => <Grid columns={3} stackOnMobile>{names.map(name => <Card key={name}>
    <strong>{name}</strong>
    <Stack direction="row" align="center" gap="lg">
      <Stack align="center" gap="sm"><Icon name={name} size={40} /><span>Monochrome</span></Stack>
      <Stack align="center" gap="sm"><Icon name={name} variant="color" size={40} /><span>Color / fallback</span></Stack>
    </Stack>
  </Card>)}</Grid>,
}
export const OnDarkSurfaces: Story = {
  parameters: { layout: 'padded' },
  render: () => <Grid columns={3} stackOnMobile>{names.map(name => <Card key={name} variant="dark">
    <strong className="pz-icon-story__dark-name">{name}</strong>
    <Stack direction="row" align="center" gap="lg">
      <Icon name={name} size={40} surface="dark" title={`${name} monochrome`} />
      <Icon name={name} size={40} surface="dark" variant="color" title={`${name} original`} />
    </Stack>
  </Card>)}</Grid>,
}
export const InButtons: Story = {
  render: () => <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
    <Button variant="secondary"><Icon name="chatgpt" size="1em" /> Ask ChatGPT</Button>
    <Button variant="secondary"><Icon name="gemini" variant="color" size="1em" /> Ask Gemini</Button>
  </div>,
}
