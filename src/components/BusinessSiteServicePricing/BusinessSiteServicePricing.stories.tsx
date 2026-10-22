import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteServicePricing } from './BusinessSiteServicePricing'
import type { BusinessSiteServicePricingSentiment, BusinessSiteServicePricingTier } from './helpers/types'

const fullTiers: BusinessSiteServicePricingTier[] = [
  {
    name: 'Water heater repair', low: 180, high: 450, typicalLow: 220, typicalHigh: 500,
    included: ['Diagnostic visit', 'Parts up to $50', 'Follow-up check within 30 days'],
    factors: [
      { label: 'Easy access to unit', low: -40, high: -60 },
      { label: 'Tankless unit', low: 120, high: 200 },
      { label: 'Unit over 10 years old', low: 60, high: 110 },
    ],
  },
  {
    name: 'Water heater installation', low: 1200, high: 2400, typicalLow: 1400, typicalHigh: 2800,
    included: ['Old unit removal and disposal', 'New unit and standard fittings', '1-year labor warranty'],
    factors: [
      { label: 'Tankless conversion', low: 800, high: 1500 },
      { label: 'Permit required', low: 75, high: 150 },
    ],
  },
  {
    name: 'Tank flush and maintenance', low: 120, high: 180, typicalLow: 110, typicalHigh: 200,
    included: ['Drain and flush tank', 'Anode rod check'],
    factors: [{ label: 'Second unit same visit', low: 60, high: 60 }],
  },
  {
    name: 'Tankless installation', low: 2800, high: 4500, typicalLow: 3000, typicalHigh: 5200,
    included: ['Gas or electric hookup', 'Venting to code'],
    factors: [
      { label: 'Gas line upgrade', low: 400, high: 900 },
      { label: 'Utility rebate', low: -300, high: -300 },
    ],
  },
]

const sentiments: BusinessSiteServicePricingSentiment[] = [
  { key: 'great', label: 'Great price', businessPercentage: 64, marketPercentage: 36 },
  { key: 'ok', label: 'Reasonable', businessPercentage: 36, marketPercentage: 64 },
]

const meta = {
  title: 'Components/Business Site/Service Pricing',
  component: BusinessSiteServicePricing,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Price-intelligence section for a service-detail page — composed as a child of BusinessSiteServiceDetail, sharing its appearance system (BusinessSiteServicesAppearance / servicesStyle). A dark intelligence band (vs-market and fair-value stats, a customer-perception bar comparing the business to the market) sits above the job-type cards. `appearance.density` controls the card layout: `comfortable` is a responsive grid (three columns on desktop, two on tablet, one on mobile; extra job types wrap into further rows) and `compact` (the default when density is not passed) stacks the cards one per row. Each card has its own price range, a typical-price comparison bar, included items, and price factors — all independently shown only when their data exists. The consuming app supplies raw numbers; this component owns all currency/percentage formatting.',
      },
    },
  },
  args: {
    businessName: 'Acme Plumbing',
    service: 'Water heater',
    phoneHref: 'tel:+15550100142',
    vsMarketPercentage: -12,
    fairValue: { businessPercentage: 88, marketPercentage: 74 },
    sentiments,
    tiers: fullTiers,
    appearance: { font: 'Nunito Sans', headingFont: 'Open Sans', backgroundColor: '#ffffff', gradientStartColor: '#03080e', gradientEndColor: '#1d4f8c', density: 'comfortable', buttonRadius: '8px', motion: 'subtle' },
  },
} satisfies Meta<typeof BusinessSiteServicePricing>

export default meta
type Story = StoryObj<typeof meta>

export const Comfortable: Story = {}
export const Compact: Story = {
  parameters: { docs: { description: { story: 'Job-type cards stack one per row. This is also the layout when `density` is not passed.' } } },
  args: { appearance: { ...meta.args.appearance, density: 'compact' } },
}

export const Loading: Story = { args: { isLoading: true, tiers: [] } }

export const ThreeTiers: Story = { args: { tiers: fullTiers.slice(0, 3) } }
export const TwoTiers: Story = { args: { tiers: fullTiers.slice(0, 2) } }
export const SingleTier: Story = { args: { tiers: [fullTiers[0]!] } }

export const WrappingTiers: Story = {
  args: { tiers: [
    ...fullTiers,
    { ...fullTiers[0]!, name: 'Additional repair option' },
    { ...fullTiers[1]!, name: 'Additional installation option' },
  ] },
}

export const LongContent: Story = {
  args: { tiers: fullTiers.slice(0, 3).map((tier) => ({
    ...tier,
    low: 12800, high: 148500, typicalLow: 14000, typicalHigh: 160000,
    factors: [
      { label: 'Additional work for extended venting and a restricted access route', low: 1800, high: 15000 },
      { label: 'Site preparation and specialist equipment needed', low: 900, high: 2500 },
      { label: 'Membership discount applied after the on-site assessment', percent: -10 },
    ],
  })) },
}

export const PriceOnly: Story = {
  args: {
    vsMarketPercentage: null, fairValue: null, sentiments: [],
    tiers: [
      { name: 'Drain clearing', low: 150, high: 325 },
      { name: 'Hydro jetting', low: 350, high: 600 },
      { name: 'Camera inspection', low: 125, high: 250 },
    ],
  },
}

export const NoPublishedPrices: Story = {
  args: {
    service: 'Sewer line', vsMarketPercentage: null, sentiments: [],
    fairValue: { businessPercentage: 91, marketPercentage: 74 },
    tiers: [
      { name: 'Sewer line repair', included: ['Camera inspection', 'Written quote before work'] },
      { name: 'Sewer line replacement' },
      { name: 'Trenchless repair' },
    ],
  },
}

export const TypicalOnlyWhenLower: Story = {
  parameters: {
    docs: { description: { story: '`typicalComparison="lower-only"` hides the typical-price bar on any tier whose own range isn\'t at or below the typical range — avoids drawing attention to pricing above the market.' } },
  },
  args: { typicalComparison: 'lower-only' },
}

export const SingleSentimentNoFairValue: Story = {
  parameters: {
    docs: { description: { story: 'With only one sentiment category and no fair-value stat to make it redundant, the perception bar still renders — it\'s the only signal available.' } },
  },
  args: { fairValue: null, sentiments: [sentiments[0]!] },
}

export const AlternatePalette: Story = {
  args: { appearance: { ...meta.args.appearance, backgroundColor: '#fff8ee', gradientStartColor: '#17392f', gradientEndColor: '#416951' } },
}

export const Tablet: Story = { decorators: [(Story) => <div style={{ width: '100%', maxWidth: 820 }}><Story /></div>] }
export const Mobile: Story = { decorators: [(Story) => <div style={{ width: '100%', maxWidth: 390 }}><Story /></div>] }
export const MobileCompact: Story = { ...Mobile, args: Compact.args }
