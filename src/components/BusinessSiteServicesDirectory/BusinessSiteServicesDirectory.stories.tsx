import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteServicesDirectory } from './BusinessSiteServicesDirectory'
import type { BusinessSiteServiceGroup } from '../BusinessSiteServices/helpers/types'

const names = [
  ['Plumbing', ['Water filtration', 'Sewer line', 'Water heater', 'Toilet repairs', 'Leak detection and repair', 'Garbage disposal', 'General plumbing', 'Pipe repair', 'Drain cleaning', 'Gas line']],
  ['HVAC', ['Heat pump', 'Heating system', 'Indoor air quality services', 'HVAC maintenance', 'HVAC repair', 'Ductless mini-split', 'AC repair']],
  ['Electrical', ['Electrical troubleshooting and repair', 'Outlet, switch and GFCI installation and repair', 'Electrical panel and service upgrades', 'Standby generator installation and maintenance', 'Lighting installation and upgrades']],
] as const
const groups: BusinessSiteServiceGroup[] = names.map(([trade, services]) => ({ id: trade, trade,
  title: `Our ${trade} services in Roanoke`, services: services.map((title) => ({ id: title, title, href: `/services/${trade}/${title.replaceAll(' ', '-')}` })) }))

const meta = {
  title: 'Components/Business Site/Services Directory', component: BusinessSiteServicesDirectory, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Price-free directory with a compact introduction, instant local search and anchor navigation. Light, content-height trade summaries use the website gradient only for icon badges and slim accent borders, keeping service links visually primary. Every service link is present in the initial HTML. Website fonts, density, radius, motion and palette remain shared with the homepage. No API calls, invented photos or pricing are added.' } } },
  args: { groups, title: 'Our services', headingLevel: 'h1', eyebrow: 'Wisler Plumbing, Heating, Cooling & Electric',
    appearance: { font: 'Nunito Sans', headingFont: 'Open Sans', backgroundColor: '#ffffff', gradientStartColor: '#000000', gradientEndColor: '#2c95b5', density: 'comfortable', buttonRadius: '8px', motion: 'subtle' } },
} satisfies Meta<typeof BusinessSiteServicesDirectory>
export default meta
type Story = StoryObj<typeof meta>
export const Comfortable: Story = {}
export const Compact: Story = { args: { appearance: { ...meta.args.appearance, density: 'compact' } } }
export const SingleTrade: Story = { args: { groups: [groups[0]!] } }
export const LongMarketTitle: Story = { args: { groups: groups.map((group) => ({ ...group, title: `Our ${group.trade} services in Denver-Aurora-Centennial` })) } }
export const AlternatePalette: Story = { args: { appearance: { ...meta.args.appearance, backgroundColor: '#fff8ee', gradientStartColor: '#17392f', gradientEndColor: '#416951' } } }
export const Empty: Story = { args: { groups: [] } }
export const Mobile: Story = { decorators: [(Story) => <div style={{ width: '100%', maxWidth: 390 }}><Story /></div>] }
export const MobileCompact: Story = { ...Mobile, args: Compact.args }
