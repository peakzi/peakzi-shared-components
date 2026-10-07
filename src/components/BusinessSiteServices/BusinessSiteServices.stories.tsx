import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteServices } from './BusinessSiteServices'
import type {
  BusinessSiteServiceGroup,
  BusinessSiteServicesAppearance,
  BusinessSiteServicesProps,
} from './helpers/types'

type Appearance = Required<Pick<BusinessSiteServicesAppearance,
  'font' | 'headingFont' | 'backgroundColor' | 'textColor' | 'accentColor' | 'buttonRadius' | 'density' | 'motion'
>>

interface StoryArgs extends Omit<BusinessSiteServicesProps, 'appearance'>, Appearance {}

const groups: BusinessSiteServiceGroup[] = [
  {
    id: 'plumbing',
    trade: 'Plumbing',
    services: [
      { id: 'drains', title: 'Drain cleaning', summary: 'Help with slow or blocked drains throughout the home.', href: '/services/drain-cleaning', iconName: 'Waves', actionLabel: 'Explore service' },
      { id: 'water-heaters', title: 'Water heater repair', summary: 'Diagnosis and repair for common water heater problems.', href: '/services/water-heater-repair', iconName: 'Flame', actionLabel: 'Explore service' },
      { id: 'fixtures', title: 'Fixture repair', summary: 'Repair for leaking faucets, toilets, and other fixtures.', href: '/services/fixture-repair', iconName: 'Wrench', actionLabel: 'Explore service' },
    ],
  },
  {
    id: 'electrical',
    trade: 'Electrical',
    services: [
      { id: 'panels', title: 'Electrical panel upgrades', summary: 'Explore panel replacement and upgrade options.', href: '/services/electrical-panels', iconName: 'Zap', actionLabel: 'Explore service' },
      { id: 'lighting', title: 'Lighting installation', summary: 'Indoor and outdoor lighting for your space.', href: '/services/lighting-installation', iconName: 'Lightbulb', actionLabel: 'Explore service' },
    ],
  },
]

const meta = {
  title: 'Components/Business Site/Services',
  component: BusinessSiteServices,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Responsive, server-rendered service groups. Comfortable density uses cards; compact density uses a list. The examples are Storybook-only copy; applications supply actual API service data, URLs, optional images, and optional prices. Appearance can be mapped from site-wide tenant settings.',
      },
    },
  },
  render: ({ font, headingFont, backgroundColor, textColor, accentColor, buttonRadius, density, motion, ...props }: StoryArgs) => (
    <BusinessSiteServices
      {...props}
      appearance={{ font, headingFont, backgroundColor, textColor, accentColor, buttonRadius, density, motion }}
    />
  ),
  argTypes: {
    groups: { control: 'object' },
    viewAll: { control: 'object' },
    font: { control: 'text' },
    headingFont: { control: 'text' },
    backgroundColor: { control: 'color' },
    textColor: { control: 'color' },
    accentColor: { control: 'color' },
    buttonRadius: { control: 'inline-radio', options: ['2px', '8px', '16px', '32px'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    motion: { control: 'inline-radio', options: ['none', 'subtle'] },
  },
  args: {
    groups,
    title: 'Services for your home',
    eyebrow: 'What we do',
    intro: 'Explore the services available in your area.',
    viewAll: { label: 'View all services', href: '/services' },
    font: 'IBM Plex Sans',
    headingFont: 'Archivo',
    backgroundColor: '#ffffff',
    textColor: '#12171c',
    accentColor: '#1d4f8c',
    buttonRadius: '8px',
    density: 'comfortable',
    motion: 'subtle',
  },
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const NoMotion: Story = { args: { motion: 'none' } }

export const TradeHeadingsOnly: Story = {
  args: { title: undefined, eyebrow: undefined, intro: undefined, viewAll: undefined },
}

export const OptionalPhotoAndPrice: Story = {
  args: {
    groups: [{
      id: 'plumbing',
      trade: 'Plumbing',
      services: [{
        id: 'water-heaters',
        title: 'Water heater repair',
        summary: 'Diagnosis and repair for common water heater problems.',
        href: '/services/water-heater-repair',
        image: { src: '/demo-assets/hero-example-service.svg', alt: 'Illustration of a home service', width: 800, height: 640 },
        tiers: [{ label: 'Example range', value: '$150–$300' }],
        actionLabel: 'Explore service',
      }],
    }],
  },
}

export const Dark: Story = {
  args: { backgroundColor: '#12171c', textColor: '#ffffff', accentColor: '#9ec7ff' },
}

export const Compact: Story = {
  args: { density: 'compact' },
}

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
