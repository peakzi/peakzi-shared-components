import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteAreasDirectory } from './BusinessSiteAreasDirectory'
import { BusinessSiteAreasMap } from '../BusinessSiteAreas/map/BusinessSiteAreasMap'

const meta = {
  title: 'Components/Business Site/Service Areas Directory',
  component: BusinessSiteAreasDirectory,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Areas we serve',
    areas: [
      { id: 'bassett', label: 'Bassett, VA', position: { lat: 36.7615, lon: -79.9866 } },
      { id: 'cave-spring', label: 'Cave Spring, VA', favorite: true, position: { lat: 37.2254, lon: -80.0072 } },
      { id: 'roanoke', label: 'Roanoke, VA', favorite: true, position: { lat: 37.29241, lon: -80.06396 } },
      { id: 'salem', label: 'Salem, VA', favorite: true, position: { lat: 37.2864, lon: -80.0555 } },
      { id: 'wirtz', label: 'Wirtz, VA', position: { lat: 37.0881, lon: -79.77642 } },
    ],
    appearance: { font: 'Nunito Sans', headingFont: 'Open Sans', backgroundColor: '#ffffff', textColor: '#000000', accentColor: '#2c95b5', headingBackgroundColor: '#000000', headingGradientEndColor: '#2c95b5', headingTextColor: '#ffffff', density: 'comfortable', buttonRadius: '8px', motion: 'subtle' },
    renderMap: (areas) => <BusinessSiteAreasMap areas={areas} markerStyle="pin" defaultZoom={10} clusterOnMobile />,
  },
  argTypes: { renderMap: { control: false } },
} satisfies Meta<typeof BusinessSiteAreasDirectory>

export default meta
type Story = StoryObj<typeof meta>
export const Comfortable: Story = {}
export const WithIntroduction: Story = { args: { intro: 'Find your city below or search the service areas covered by our local team.' } }
export const LongTitle: Story = { args: { title: 'Our Indianapolis-Carmel-Greenwood cities for Plumbing, Electrical and HVAC' } }
export const Compact: Story = { args: { appearance: { ...meta.args.appearance, density: 'compact' } } }
export const Mobile: Story = { decorators: [(Story) => <div style={{ maxWidth: 390, margin: 'auto' }}><Story /></div>] }
export const WithoutCoordinates: Story = { args: { areas: meta.args.areas.map(({ id, label, favorite }) => ({ id, label, favorite })), renderMap: undefined } }
