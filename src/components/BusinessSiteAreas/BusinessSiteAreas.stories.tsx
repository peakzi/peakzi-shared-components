import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteAreas } from './BusinessSiteAreas'
import type { BusinessSiteAreasAppearance, BusinessSiteAreasProps } from './BusinessSiteAreas'
import { BusinessSiteAreasMap } from './map/BusinessSiteAreasMap'
import { mapAreas } from './helpers/map-areas'

type Appearance = Required<Pick<BusinessSiteAreasAppearance,
  'font' | 'headingFont' | 'backgroundColor' | 'textColor' | 'accentColor' | 'buttonRadius' | 'density' | 'motion'
>>

interface StoryArgs extends Omit<BusinessSiteAreasProps, 'appearance' | 'map'>, Appearance, Pick<BusinessSiteAreasAppearance, 'gradientEndColor' | 'gradientAngle'> { showMap: boolean }

// Example coordinates from the live /home response. No demo coordinates enter the consuming app.
const citySamples = [
  ['Arroyo Grande, CA', 35.1241, -120.5845], ['Avila Beach, CA', 35.1969, -120.7191],
  ['Buellton, CA', 34.6152, -120.1943], ['Casmalia, CA', 34.8378, -120.5309],
  ['Grover Beach, CA', 35.1204, -120.6197], ['Guadalupe, CA', 34.9609, -120.5735],
  ['Lompoc, CA', 34.76049, -120.51102], ['Los Alamos, CA', 34.7419, -120.2746],
  ['Los Olivos, CA', 34.664, -120.117], ['Nipomo, CA', 35.0319, -120.4985],
  ['Oceano, CA', 35.1019, -120.6088], ['Orcutt, CA', 34.8691, -120.4222],
  ['Pismo Beach, CA', 35.1487, -120.6493], ['San Luis Obispo, CA', 35.30428, -120.65683],
  ['Santa Maria, CA', 34.86528, -120.435], ['Santa Ynez, CA', 34.6168, -120.0948],
  ['Sisquoc, CA', 34.8621, -120.2943], ['Solvang, CA', 34.55422, -120.14178],
  ['Vandenberg AFB, CA', 34.7477, -120.519], ['Vandenberg Village, CA', 34.7111, -120.4622],
] as const
const scrollAreas = citySamples.map(([label, lat, lon]) => {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return { id, label, href: `/cities/${id}`, position: { lat, lon } }
})

const meta = {
  title: 'Components/Business Site/Service Areas',
  component: BusinessSiteAreas,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Server-rendered city links with an optional map island. Comfortable overlays the panel on the right, leaving map pins visible on the left; compact places the map to the left of the city panel. Mobile stacks the city list above the map. Coordinates come from the consuming site, with no geocoding requests. City focus/hover highlights its marker; clicking a city keeps normal link navigation.' } },
  },
  render: ({ showMap, font, headingFont, backgroundColor, gradientEndColor, gradientAngle, textColor, accentColor, buttonRadius, density, motion, ...props }: StoryArgs) => (
    <BusinessSiteAreas {...props}
      map={showMap && mapAreas(props.areas).length ? <BusinessSiteAreasMap areas={props.areas} /> : undefined}
      appearance={{ font, headingFont, backgroundColor, gradientEndColor, gradientAngle, textColor, accentColor, buttonRadius, density, motion }} />
  ),
  argTypes: {
    areas: { control: 'object' },
    showMap: { control: 'boolean' },
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
    areas: scrollAreas,
    showMap: true,
    font: 'IBM Plex Sans',
    headingFont: 'Archivo',
    backgroundColor: '#07111b',
    gradientEndColor: '#1d4f8c',
    gradientAngle: 135,
    textColor: '#ffffff',
    accentColor: '#a5c9ee',
    buttonRadius: '8px',
    density: 'comfortable',
    motion: 'subtle',
  },
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const LongHeading: Story = {
  args: { title: 'Our Santa Maria-Santa Barbara cities for Plumbing' },
}
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
export const Mobile: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 390, margin: '0 auto' }}><Story /></div>],
}
export const MobileCompact: Story = { ...Mobile, args: { density: 'compact' } }
export const WithoutCoordinates: Story = { args: { areas: scrollAreas.map(({ id, label, href }) => ({ id, label, href })) } }
export const WithoutMap: Story = { args: { showMap: false } }
export const PartialCoordinates: Story = { args: { areas: scrollAreas.map((area, index) => index < 3 ? area : { id: area.id, label: area.label, href: area.href }) } }
export const Gradient: Story = { args: { backgroundColor: '#003c3c', gradientEndColor: '#0a1f2e', gradientAngle: 135, textColor: '#ffffff', accentColor: '#f0d9a8' } }

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
