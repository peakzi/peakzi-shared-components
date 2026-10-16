import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteServiceDetail } from './BusinessSiteServiceDetail'

const meta = {
  title: 'Components/Business Site/Service Detail', component: BusinessSiteServiceDetail, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Server-renderable service-detail presentation: light editorial introduction, real contact actions, section anchors and a compact API-proof grid. Compose the existing section components as children. No API requests, pricing, fake ratings or fabricated business claims.' } } },
  args: { headline: 'Water heater service in Greater Roanoke', trade: 'Plumbing', businessName: 'Example Home Services',
    description: 'This space contains the complete service introduction supplied by the website API. It is never truncated. The same template supports plumbing, HVAC, electrical and other trades.',
    actions: [{ id: 'book', label: 'Book online', href: 'https://example.com/book', type: 'secondary', iconName: 'calendar', newTab: true },
      { id: 'call', label: 'Call now', href: 'tel:5125550188', type: 'primary', iconName: 'phone' }],
    reasonsTitle: 'Why choose us', reasons: [
      { label: 'First API reason', proof: 'The corresponding evidence from the API.' },
      { label: 'Second API reason', proof: 'No qualifications or promises are invented by the component.' },
      { label: 'Third API reason', proof: 'Labels and proof remain in their original API order.' },
      { label: 'Fourth API reason', proof: 'The layout wraps naturally when more reasons are supplied.' },
      { label: 'Fifth API reason' },
    ],
    appearance: { font: 'Nunito Sans', headingFont: 'Open Sans', backgroundColor: '#ffffff', gradientStartColor: '#000000', gradientEndColor: '#2c95b5', density: 'comfortable', buttonRadius: '8px', motion: 'subtle' } },
} satisfies Meta<typeof BusinessSiteServiceDetail>
export default meta
type Story = StoryObj<typeof meta>
export const Comfortable: Story = {}
export const Compact: Story = { args: { appearance: { ...meta.args.appearance, density: 'compact' } } }
export const LongHeading: Story = { args: { headline: 'Electrical troubleshooting and repair in Denver-Aurora-Centennial', trade: 'Electrical' } }
export const Minimal: Story = { args: { description: undefined, actions: [], reasons: [], businessName: undefined } }
export const AlternatePalette: Story = { args: { appearance: { ...meta.args.appearance, backgroundColor: '#fff8ee', gradientStartColor: '#17392f', gradientEndColor: '#416951' } } }
export const Mobile: Story = { decorators: [(Story) => <div style={{ width: '100%', maxWidth: 390 }}><Story /></div>] }
export const MobileCompact: Story = { ...Mobile, args: Compact.args }
