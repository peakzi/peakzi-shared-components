import type { Meta, StoryObj } from '@storybook/react'
import { GeoMap } from './GeoMap'
import { MapMarker } from './MapMarker'

const meta: Meta<typeof GeoMap> = {
  title: 'Maps/GeoMap',
  component: GeoMap,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A Leaflet map container with auto-fit-bounds mechanics. Renders no markers itself — compose `MapMarker` (below) or your own `react-leaflet` layers (`CircleMarker`, `GeoJSON`, ...) as children. Requires `leaflet` and `react-leaflet@^4` as peer dependencies.',
      },
    },
  },
  argTypes: {
    isLoading: { control: 'boolean' },
  },
  args: {
    points: [
      { lat: 27.9506, lon: -82.4572 },
      { lat: 28.05, lon: -82.5 },
      { lat: 27.9, lon: -82.4 },
    ],
    height: 360,
  },
}

export default meta
type Story = StoryObj<typeof GeoMap>

export const Default: Story = {}

export const Loading: Story = {
  args: { isLoading: true },
}

export const WithMarkers: Story = {
  name: 'With markers',
  render: (args) => (
    <GeoMap {...args}>
      <MapMarker point={{ id: 'me', position: { lat: 27.9506, lon: -82.4572 }, tooltip: 'Your Business', emphasized: true }} />
      <MapMarker point={{ id: 'a', position: { lat: 28.05, lon: -82.5 }, tooltip: 'Competitor A' }} />
      <MapMarker point={{ id: 'b', position: { lat: 27.9, lon: -82.4 }, tooltip: 'Competitor B' }} />
    </GeoMap>
  ),
}
