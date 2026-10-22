import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteOffers } from './BusinessSiteOffers'
import type { BusinessSiteOffersAppearance, BusinessSiteOffersProps } from './helpers/types'

interface StoryArgs extends Omit<BusinessSiteOffersProps, 'appearance'>, Required<BusinessSiteOffersAppearance> {}

const meta = {
  title: 'Components/Business Site/Offers',
  component: BusinessSiteOffers,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Server-renderable offers supplied by the consuming app. Comfortable density uses a swipeable ticket-card carousel by default or a responsive grid for full offers pages. Both reuse the same ticket cards. Compact density uses list rows regardless of layout. No autoplay or hidden offer copy. Availability and redemption destinations belong to the API/app, not this component.' } },
  },
  render: ({ font, headingFont, backgroundColor, textColor, accentColor, cardBackgroundColor, cardGradientEndColor, cardTextColor, cardAccentColor, buttonRadius, density, motion, ...props }: StoryArgs) => (
    <BusinessSiteOffers {...props} appearance={{ font, headingFont, backgroundColor, textColor, accentColor, cardBackgroundColor, cardGradientEndColor, cardTextColor, cardAccentColor, buttonRadius, density, motion }} />
  ),
  argTypes: {
    items: { control: 'object' },
    layout: { control: 'inline-radio', options: ['carousel', 'grid'] },
    preview: { control: 'boolean' },
    viewAll: { control: 'object' },
    font: { control: 'text' },
    headingFont: { control: 'text' },
    backgroundColor: { control: 'color' },
    textColor: { control: 'color' },
    accentColor: { control: 'color' },
    cardBackgroundColor: { control: 'color' },
    cardGradientEndColor: { control: 'color' },
    cardTextColor: { control: 'color' },
    cardAccentColor: { control: 'color' },
    buttonRadius: { control: 'inline-radio', options: ['2px', '8px', '16px', '32px'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    motion: { control: 'inline-radio', options: ['none', 'subtle'] },
  },
  args: {
    title: 'Offers & savings',
    eyebrow: 'Coupons & specials',
    description: 'Demo offers for layout review only.',
    items: [
      { id: 'tune-up', badge: '$59', title: '$59 One-Time Tune Up', action: { label: 'Call to claim', href: 'tel:5125550188' } },
      { id: 'maintenance', badge: 'From $19.99/mo', title: 'Maintenance memberships as low as $19.99/month', action: { label: 'View offer', href: 'https://example.com/offers', newTab: true } },
      { id: 'replacement', badge: '$500 OFF', title: 'Full System Replacement – $500 Off', terms: 'One offer per visit.', expiresOn: '2030-12-31', action: { label: 'Call to claim', href: 'tel:5125550188' } },
    ],
    font: 'IBM Plex Sans',
    headingFont: 'Archivo',
    backgroundColor: '#f7ebcc',
    textColor: '#30281e',
    accentColor: '#006d70',
    cardBackgroundColor: '#f7ebcc',
    cardGradientEndColor: '#f7ebcc',
    cardTextColor: '#30281e',
    cardAccentColor: '#006d70',
    buttonRadius: '16px',
    density: 'comfortable',
    motion: 'subtle',
  },
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const HomepagePreview: Story = {
  args: {
    preview: true, viewAll: { label: 'View all offers', href: '/offers' },
    backgroundColor: '#ffffff', textColor: '#12171c', cardBackgroundColor: '#07111b', cardGradientEndColor: '#2b96b0',
    cardTextColor: '#ffffff', cardAccentColor: '#b0e1e8',
    items: [
      { id: 'discount', badge: '10% OFF', title: 'All services', description: '10% Off All Services & Repairs', terms: 'Included with membership', redemptionInstructions: 'Join Now for Just $14.99/Month or $159/Year!', expiresOn: '2030-11-04' },
      { id: 'fees', badge: 'FREE', title: 'All services', description: 'No service fees — ever!', terms: 'Included with membership', expiresOn: '2030-11-04' },
      { id: 'membership', badge: '$14.99', title: 'All services', description: 'Join Now for Just $14.99/Month',
        features: ['Priority service during plumbing emergencies', 'Free annual inspection with camera inspection', '10% off all services and repairs', 'Two-year service guarantee', 'Manufacturer warranties on installed equipment', 'No service fees'],
        redemptionInstructions: 'Join Now for Just $14.99/Month or $159/Year!', expiresOn: '2030-11-04' },
    ],
  },
}
export const Carousel: Story = { args: { items: [
  ...meta.args.items,
  { id: 'inspection', title: 'Plumbing inspection', badge: '$25 OFF', action: { label: 'Call to claim', href: 'tel:5125550188' } },
  { id: 'repairs', title: 'Qualifying repairs', badge: '10% OFF', action: { label: 'View offer', href: 'https://example.com/offers', newTab: true } },
] } }
export const SingleOffer: Story = { args: { items: [meta.args.items[0]!] } }
export const OffersPagePreview: Story = {
  ...HomepagePreview,
  args: { ...HomepagePreview.args, layout: 'grid', viewAll: undefined },
  parameters: { docs: { description: { story: 'Short grid cards with full server-rendered details. Without JavaScript, native disclosures expand inline; with JavaScript, the same controls open a dialog.' } } },
}
export const TwoOffers: Story = { args: { items: meta.args.items.slice(0, 2) } }
export const Compact: Story = { args: { density: 'compact' } }
export const Grid: Story = { ...Carousel, args: { ...Carousel.args, layout: 'grid' } }
export const CompactGrid: Story = { ...Grid, args: { ...Grid.args, density: 'compact' } }
export const Dark: Story = { args: { backgroundColor: '#12171c', textColor: '#ffffff', accentColor: '#a5c9ee', cardBackgroundColor: '#12171c', cardGradientEndColor: '#12171c', cardTextColor: '#ffffff', cardAccentColor: '#a5c9ee' } }
export const DarkCoupons: Story = { args: {
  backgroundColor: '#ffffff', textColor: '#12171c', accentColor: '#657991',
  cardBackgroundColor: '#12171c', cardGradientEndColor: '#716a64', cardTextColor: '#ffffff', cardAccentColor: '#a5c9ee',
} }
export const NoOffers: Story = { args: { items: [] } }
export const WithDetails: Story = { args: { items: [{
  ...meta.args.items[2]!, description: 'Save on a qualifying replacement system.', features: ['Installation included', 'Manufacturer warranty'],
  code: 'SYSTEM500', redemptionInstructions: 'Mention the offer when scheduling.',
}] } }
export const Mobile: Story = { ...Carousel, globals: { viewport: { value: 'mobile1', isRotated: false } } }
export const MobileCompact: Story = { ...Mobile, args: { density: 'compact' } }
export const MobileGrid: Story = { ...Grid, globals: { viewport: { value: 'mobile1', isRotated: false } } }
