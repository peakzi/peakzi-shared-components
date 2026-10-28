import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteCta } from './BusinessSiteCta'

const meta = {
  title: 'Components/Business Site/CTA',
  component: BusinessSiteCta,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Server-safe CTA with Direct line, Invitation and Service desk layouts. Mix layouts by placement while preserving a single business palette, typography and radius. Applications supply copy, destinations and placement; shared owns presentation, safe links, focus, responsive stacking, density and motion hooks. No fetches, timers or business-specific logic.' } },
  },
  argTypes: {
    title: { control: 'text' }, description: { control: 'text' }, actions: { control: 'object' },
    appearance: { control: 'object' }, placement: { control: 'text' },
    variant: { control: 'select', options: ['direct-line', 'invitation', 'service-desk'] },
  },
  args: {
    title: 'Find the right service for your home',
    description: 'Speak with our team about your needs or schedule a convenient service appointment.',
    actions: [
      { id: 'call', label: 'Call now', href: 'tel:15550100142', type: 'primary', iconName: 'phone' },
      { id: 'book', label: 'Schedule service', href: 'https://example.com/book', type: 'secondary', iconName: 'calendar', newTab: true },
    ],
    appearance: { font: 'IBM Plex Sans', headingFont: 'Archivo', surfaceColor: '#ffffff', surfaceTextColor: '#102030', backgroundColor: '#102030', gradientEndColor: '#405060',
      textColor: '#ffffff', accentColor: '#efbf57', buttonColor: '#1d4f8c', buttonRadius: '8px', density: 'comfortable', motion: 'subtle' },
    placement: 'home-services',
    variant: 'service-desk',
  },
} satisfies Meta<typeof BusinessSiteCta>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const DirectLine: Story = { args: { variant: 'direct-line' } }
export const HeaderMatchedActions: Story = { args: {
  variant: 'direct-line',
  actions: [
    { id: 'book', label: 'Book online', href: 'https://example.com/book', type: 'secondary', iconName: 'calendar', newTab: true },
    { id: 'call', label: 'Call now', href: 'tel:15550100142', type: 'primary', iconName: 'phone' },
  ],
  appearance: { ...meta.args.appearance, surfaceColor: '#ffffff', surfaceTextColor: '#2c95b5',
    backgroundColor: '#213b5a', gradientEndColor: '#2c95b5', accentColor: '#ee383d', buttonColor: '#ee383d', buttonRadius: '2px' },
} }
export const DirectLineMobile: Story = { args: { variant: 'direct-line' }, decorators: [(Story) => <div style={{ maxWidth: '24.375rem', margin: 'auto' }}><Story /></div>] }
export const DirectLineCallOnly: Story = { args: { variant: 'direct-line', actions: [meta.args.actions[0]!] } }
export const DirectLineScheduleOnly: Story = { args: { variant: 'direct-line', actions: [meta.args.actions[1]!] } }
export const DirectLineCompact: Story = { args: { variant: 'direct-line', appearance: { ...meta.args.appearance, density: 'compact' } } }
export const Invitation: Story = { args: { variant: 'invitation' } }
export const ServiceDesk: Story = { args: { variant: 'service-desk' } }
export const ServiceDeskEqualButtons: Story = { args: { variant: 'service-desk', actions: [
  { id: 'book', label: 'Book online', href: 'https://example.com/book', type: 'secondary', iconName: 'calendar', newTab: true },
  { id: 'call', label: 'Call now', href: 'tel:15550100142', type: 'primary', iconName: 'phone' },
] } }
export const ServiceDeskLongButtonLabel: Story = { args: { variant: 'service-desk', actions: [
  { id: 'book', label: 'Book a plumbing, heating or electrical service appointment', href: 'https://example.com/book', type: 'secondary', iconName: 'calendar', newTab: true },
  { id: 'call', label: 'Call now', href: 'tel:15550100142', type: 'primary', iconName: 'phone' },
] } }
export const ServiceDeskMobile: Story = { args: { variant: 'service-desk' }, decorators: [(Story) => <div style={{ maxWidth: '24.375rem', margin: 'auto' }}><Story /></div>] }
export const ServiceDeskCompact: Story = { args: { variant: 'service-desk', appearance: { ...meta.args.appearance, density: 'compact' } } }
export const MixedLayouts: Story = { render: (args) => <>
  <BusinessSiteCta {...args} variant="direct-line" placement="home-services" />
  <BusinessSiteCta {...args} variant="service-desk" placement="home-reviews" />
  <BusinessSiteCta {...args} variant="invitation" placement="blogs-end" />
</> }
export const MobileMixedLayouts: Story = { ...MixedLayouts, decorators: [(Story) => <div style={{ maxWidth: '24.375rem', margin: 'auto' }}><Story /></div>] }
export const Compact: Story = { args: { appearance: { ...meta.args.appearance, density: 'compact' } } }
export const CallOnly: Story = { args: { actions: [meta.args.actions[0]!] } }
export const ScheduleOnly: Story = { args: { actions: [meta.args.actions[1]!] } }
export const NoDescription: Story = { args: { description: '' } }
export const NoActions: Story = { args: { actions: [] } }
export const NoMotion: Story = { args: { appearance: { ...meta.args.appearance, motion: 'none' } } }
export const SmallRadius: Story = { args: { appearance: { ...meta.args.appearance, buttonRadius: '2px' } } }
export const LargeRadius: Story = { args: { appearance: { ...meta.args.appearance, buttonRadius: '32px' } } }
export const CustomGradient: Story = { args: { appearance: { ...meta.args.appearance, backgroundColor: '#153c28', gradientEndColor: '#287653', accentColor: '#ffffff' } } }
export const ThemeTokens: Story = { args: { appearance: {} } }
export const LongCopy: Story = { args: { title: 'Need help choosing the right plumbing, heating or electrical service for your home?', description: meta.args.description.repeat(3) } }
export const Mobile: Story = { decorators: [(Story) => <div style={{ maxWidth: '24.375rem', margin: 'auto' }}><Story /></div>] }
