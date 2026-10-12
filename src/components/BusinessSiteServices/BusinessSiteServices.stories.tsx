import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteServices } from './BusinessSiteServices'
import type { BusinessSiteServiceGroup, BusinessSiteServiceItem, BusinessSiteServicesAppearance, BusinessSiteServicesProps } from './helpers/types'

type Appearance = Required<Omit<BusinessSiteServicesAppearance, 'textColor' | 'accentColor'>>
interface StoryArgs extends Omit<BusinessSiteServicesProps, 'appearance'>, Appearance {}
type DemoPrices = readonly [string | null, string | null, string | null]
const actionLabels = ['Repair', 'Replace/Install', 'Maintain'] as const
function demoService(id: string, title: string, prices?: DemoPrices): BusinessSiteServiceItem {
  return { id, title, href: `/services/${id}`, tiers: prices?.flatMap((value, index) => value ? [{ label: actionLabels[index]!, value }] : []) ?? [] }
}

const groups: BusinessSiteServiceGroup[] = [
  { id: 'plumbing', trade: 'Plumbing', title: 'Our Plumbing Services in DFW', services: [
    demoService('water-filtration', 'Water filtration', ['$250 – $650', '$868 – $1,500', '$206 – $350']),
    demoService('sewer-line', 'Sewer line', ['$500 – $1,900', '$7,025 – $26,950', '$125 – $389']),
    demoService('water-heater', 'Water heater', ['$300 – $1,100', '$1,200 – $4,500', '$267 – $651']),
    demoService('toilet-repairs', 'Toilet repairs', ['$300 – $550', '$409 – $900', null]),
    demoService('leak-detection', 'Leak detection and repair', ['$300 – $1,300', null, null]),
    demoService('garbage-disposal', 'Garbage disposal', ['$89 – $400', '$550 – $750', null]),
    demoService('general-plumbing', 'General plumbing', ['$285 – $1,000', '$390 – $1,500', '$89 – $350']),
    demoService('pipe-repair', 'Pipe repair', ['$375 – $850', '$489 – $1,800', null]),
    demoService('drain-cleaning', 'Drain cleaning', ['$280 – $450', null, null]),
    demoService('gas-line', 'Gas line', ['$300 – $700', '$550 – $1,100', null]),
    demoService('backflow', 'Backflow prevention', ['$300 – $1,488', '$575 – $1,900', '$51 – $300']),
  ] },
  { id: 'hvac', trade: 'HVAC', title: 'Our HVAC Services in DFW', services: [
    demoService('ac-repair', 'AC repair', ['$180 – $650', '$5,200 – $11,000', '$89 – $189']),
    demoService('hvac-repair', 'HVAC repair', ['$150 – $900', null, null]),
    demoService('hvac-maintenance', 'HVAC maintenance', [null, null, '$89 – $229']),
    demoService('heating', 'Heating system', ['$150 – $800', '$3,800 – $8,500', null]),
    demoService('mini-split', 'Ductless mini-split', ['$250 – $750', '$3,200 – $7,500', null]),
    demoService('duct-services', 'Duct services', ['$300 – $1,200', null, '$350 – $700']),
    demoService('thermostat', 'Thermostat and smart controls', [null, '$180 – $520', null]),
    demoService('air-quality', 'Indoor air quality services'),
    demoService('insulation', 'Insulation services'),
  ] },
  { id: 'electrical', trade: 'Electrical', title: 'Our Electrical Services in DFW', services: [
    demoService('troubleshooting', 'Electrical troubleshooting and repair', ['$100 – $400', null, null]),
    demoService('outlets', 'Outlet, switch and GFCI installation and repair', ['$100 – $200', '$120 – $350', null]),
    demoService('generator', 'Standby generator installation and maintenance', [null, '$5,000 – $12,000', '$200 – $500']),
    demoService('panel-upgrades', 'Electrical panel and service upgrades', [null, '$1,200 – $3,000', null]),
    demoService('lighting', 'Lighting installation and upgrades', [null, '$100 – $500', null]),
    demoService('safety', 'Electrical safety inspections', [null, null, '$100 – $200']),
  ] },
]
const unpriced = groups.map((group) => ({ ...group, services: group.services.map((service) => ({ ...service, tiers: [] })) }))

const meta = {
  title: 'Components/Business Site/Services', component: BusinessSiteServices, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'One titled group per trade. A trade with any supplied prices uses a semantic Repair / Install / Maintain table; missing cells show a dash, never an invented price. Trades without prices use a linked three-column grid. Compact tightens rows and tiles; narrow containers stack the grid and label each price row. API order, headings, links and every service remain server-rendered. These stories use demonstration data only.' } } },
  render: ({ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, buttonRadius, density, motion, ...props }: StoryArgs) => (
    <BusinessSiteServices {...props} appearance={{ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, buttonRadius, density, motion }} />
  ),
  argTypes: {
    groups: { control: 'object' }, viewAll: { control: 'object' },
    font: { control: 'text' }, headingFont: { control: 'text' },
    backgroundColor: { control: 'color' }, gradientStartColor: { control: 'color' }, gradientEndColor: { control: 'color' },
    buttonRadius: { control: 'inline-radio', options: ['2px', '8px', '16px', '32px'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    motion: { control: 'inline-radio', options: ['none', 'subtle'] },
  },
  args: {
    groups, font: 'IBM Plex Sans', headingFont: 'Archivo',
    backgroundColor: '#ffffff', gradientStartColor: '#12171c', gradientEndColor: '#716a64',
    buttonRadius: '8px', density: 'comfortable', motion: 'subtle',
  },
} satisfies Meta<StoryArgs>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const WithPrices: Story = {}
export const WithoutPrices: Story = { args: { groups: unpriced } }
export const Compact: Story = { args: { density: 'compact' } }
export const CompactWithoutPrices: Story = { args: { groups: unpriced, density: 'compact' } }
export const MixedTrades: Story = { args: { groups: [groups[0]!, unpriced[1]!, groups[2]!] } }
export const PartialPrices: Story = { args: { groups: [{ ...groups[0]!, services: [groups[0]!.services[0]!, { ...groups[0]!.services[1]!, tiers: [] }] }] } }
export const SingleTrade: Story = { args: { groups: [groups[0]!] } }
export const AlternatePalette: Story = { args: { backgroundColor: '#fff8ee', gradientStartColor: '#17392f', gradientEndColor: '#416951' } }
export const Dark: Story = { args: { backgroundColor: '#12171c' } }
export const NoMotion: Story = { args: { motion: 'none' } }
export const Empty: Story = { args: { groups: [] } }
export const WithSectionHeading: Story = { args: { title: 'Our services', viewAll: { label: 'View all services', href: '/services' } } }
export const Mobile: Story = { decorators: [(Story) => <div style={{ maxWidth: 390 }}><Story /></div>], args: { groups: [groups[0]!] } }
export const MobileWithoutPrices: Story = { ...Mobile, args: { groups: unpriced } }
export const MobileCompact: Story = { ...Mobile, args: { groups: [groups[0]!], density: 'compact' } }
