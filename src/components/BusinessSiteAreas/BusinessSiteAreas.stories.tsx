import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteAreas } from './BusinessSiteAreas'
import type { BusinessSiteAreasAppearance, BusinessSiteAreasProps } from './BusinessSiteAreas'

type Appearance = Required<Pick<BusinessSiteAreasAppearance,
  'font' | 'headingFont' | 'backgroundColor' | 'textColor' | 'accentColor' | 'buttonRadius' | 'density' | 'motion'
>>

interface StoryArgs extends Omit<BusinessSiteAreasProps, 'appearance'>, Appearance, Pick<BusinessSiteAreasAppearance, 'gradientEndColor' | 'gradientAngle'> {}

const meta = {
  title: 'Components/Business Site/Service Areas',
  component: BusinessSiteAreas,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Server-rendered city links. The consuming site supplies tenant-specific labels and working URLs.' } },
  },
  render: ({ font, headingFont, backgroundColor, gradientEndColor, gradientAngle, textColor, accentColor, buttonRadius, density, motion, ...props }: StoryArgs) => (
    <BusinessSiteAreas {...props} appearance={{ font, headingFont, backgroundColor, gradientEndColor, gradientAngle, textColor, accentColor, buttonRadius, density, motion }} />
  ),
  argTypes: {
    areas: { control: 'object' },
    font: { control: 'text' },
    headingFont: { control: 'text' },
    backgroundColor: { control: 'color' },
    gradientEndColor: { control: 'color' },
    gradientAngle: { control: { type: 'range', min: 0, max: 360, step: 5 } },
    textColor: { control: 'color' },
    accentColor: { control: 'color' },
    buttonRadius: { control: 'inline-radio', options: ['2px', '8px', '16px', '32px'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    motion: { control: 'inline-radio', options: ['none', 'subtle'] },
  },
  args: {
    title: 'Areas we serve',
    areas: [
      { id: 'allen', label: 'Allen, TX', href: '/cities/allen-tx' },
      { id: 'plano', label: 'Plano, TX', href: '/cities/plano-tx' },
      { id: 'frisco', label: 'Frisco, TX', href: '/cities/frisco-tx' },
      { id: 'mckinney', label: 'McKinney, TX', href: '/cities/mckinney-tx' },
      { id: 'dallas', label: 'Dallas, TX', href: '/cities/dallas-tx' },
    ],
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
export const LongCityNames: Story = {
  args: {
    buttonRadius: '32px',
    areas: [
      { id: 'vandenberg-afb', label: 'Vandenberg AFB, CA', href: '/cities/vandenberg-afb-ca' },
      { id: 'vandenberg-village', label: 'Vandenberg Village, CA', href: '/cities/vandenberg-village-ca' },
      { id: 'san-luis-obispo', label: 'San Luis Obispo, CA', href: '/cities/san-luis-obispo-ca' },
    ],
  },
}
export const NoMotion: Story = { args: { motion: 'none' } }
export const Compact: Story = { args: { density: 'compact' } }
export const Dark: Story = { args: { backgroundColor: '#12171c', textColor: '#ffffff', accentColor: '#9ec7ff' } }
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
export const Gradient: Story = { args: { backgroundColor: '#003c3c', gradientEndColor: '#0a1f2e', gradientAngle: 135, textColor: '#ffffff', accentColor: '#f0d9a8' } }

const slug = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const scrollAreas = [
  'Arroyo Grande, CA', 'Avila Beach, CA', 'Buellton, CA', 'Casmalia, CA', 'Grover Beach, CA', 'Guadalupe, CA',
  'Lompoc, CA', 'Los Alamos, CA', 'Los Olivos, CA', 'Nipomo, CA', 'Oceano, CA', 'Orcutt, CA',
  'Pismo Beach, CA', 'San Luis Obispo, CA', 'Santa Maria, CA', 'Santa Ynez, CA', 'Sisquoc, CA', 'Solvang, CA',
  'Vandenberg AFB, CA', 'Vandenberg Village, CA',
].map((label) => ({ id: slug(label), label, href: `/cities/${slug(label)}` }))

/** Scroll down: with `motion: 'subtle'` the title, count and city tiles reveal as they enter the viewport. */
export const ScrollReveal: Story = {
  args: { ...Gradient.args, areas: scrollAreas },
  decorators: [
    (Story) => (
      <>
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Scroll down</div>
        <Story />
        <div style={{ minHeight: '60vh' }} />
      </>
    ),
  ],
}
