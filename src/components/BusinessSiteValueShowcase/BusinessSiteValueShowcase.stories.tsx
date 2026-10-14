import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteValueShowcase } from './BusinessSiteValueShowcase'
import type { BusinessSiteValueShowcaseAppearance, BusinessSiteValueShowcaseProps } from './helpers/types'

interface StoryArgs extends Omit<BusinessSiteValueShowcaseProps, 'appearance'>, Required<BusinessSiteValueShowcaseAppearance> {}

const meta = {
  title: 'Components/Business Site/Value Showcase',
  component: BusinessSiteValueShowcase,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { exclude: ['appearance'] },
    docs: { description: { component: 'Independently graded standings for a business: a band with the headline, trust chips and a rating card, then one tile per graded service. Ratings show as a number out of 5. Badges and trust signals are free text from the payload and render as sent. On narrow containers tiles past mobileVisibleItems are hidden behind an expander but stay in the DOM.' } },
  },
  render: ({ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, accentColor, buttonRadius, density, motion, background, ...props }: StoryArgs) => (
    <BusinessSiteValueShowcase {...props} appearance={{ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, accentColor, buttonRadius, density, motion, background }} />
  ),
  argTypes: {
    items: { control: 'object' },
    summary: { control: 'object' },
    praise: { control: 'object' },
    trustSignals: { control: 'object' },
    action: { control: 'object' },
    font: { control: 'text' },
    headingFont: { control: 'text' },
    backgroundColor: { control: 'color' },
    gradientStartColor: { control: 'color' },
    gradientEndColor: { control: 'color' },
    accentColor: { control: 'color', description: 'Primary action color, same role as the Hero accent.' },
    buttonRadius: { control: 'inline-radio', options: ['2px', '8px', '16px', '32px'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    motion: { control: 'inline-radio', options: ['none', 'subtle'] },
    background: { control: 'inline-radio', options: ['surface', 'tint', 'soft', 'gradient', 'ink'] },
  },
  args: {
    title: 'Baker Brothers Plumbing, Air & Electric has more homeowner reviews than any other Dallas-Fort Worth home service pro.',
    lead: 'Look for proof from real homeowners before you hire: Baker Brothers Plumbing, Air & Electric has the most homeowner reviews locally.',
    methodHref: '/how-we-measure',
    gradeChip: 'Elite in 5 Dallas-Fort Worth services',
    trustSignals: [{ label: 'Financing available', kind: 'financing' }],
    summary: { rating: 4.8, reviewCount: 24619, position: '#1 of 377 Dallas-Fort Worth home service pros for review volume' },
    praise: [{ count: 634, text: 'positive reviews praise their quality of work in the past 12 months' }, { count: 297, text: 'positive reviews praise their expertise' }],
    action: { label: 'Book online', href: 'https://example.com/book', iconName: 'calendar' },
    items: [
      { id: 'gp', name: 'General plumbing', rank: 'Top 3', proof: '216 homeowner reviews rate its everyday plumbing work for Dallas-Fort Worth homes.' },
      { id: 'wh', name: 'Water heater', rank: 'Top 3', proof: '196 homeowner reviews · Reviews cover water heater installs, repairs and replacements across the metro.' },
      { id: 'lr', name: 'Leak repair', rank: 'Top 3', proof: 'Homeowners have written 135 reviews on leak repair, including hard-to-find leaks.' },
      { id: 'tr', name: 'Toilet repairs', rank: 'Top 3', proof: '100 homeowner reviews · Reviews cover toilet repairs in homes across Dallas and Fort Worth.' },
      { id: 'pr', name: 'Pipe repair', rank: 'Top 3', proof: 'Pipe repair draws 95 homeowner reviews that rate the work across the metro.' },
      { id: 'ms', name: 'Market share', rank: 'Top 10', badge: 'Elite', proof: 'Reflects local homeowner choices across Dallas-Fort Worth, not one service alone.' },
    ],
    note: "Peakzi compared Baker Brothers Plumbing, Air & Electric with its peers, home service pros, as of October 2026, graded on customer reviews and job mentions. Elite is top 5%. The business has no say in the grades. Financing is as stated on the business's website.",
    font: 'Nunito Sans',
    headingFont: 'Nunito Sans',
    backgroundColor: '#ffffff',
    gradientStartColor: '#000000',
    gradientEndColor: '#2c95b5',
    accentColor: '#2c95b5',
    buttonRadius: '8px',
    density: 'comfortable',
    motion: 'none',
    background: 'gradient',
  },
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Tint: Story = { args: { background: 'tint' } }
export const Surface: Story = { args: { background: 'surface' } }
export const Compact: Story = { args: { density: 'compact' } }
export const NoPraise: Story = { args: { praise: [] } }
export const OneTile: Story = { args: { items: meta.args.items.slice(0, 1) } }
export const TwoTiles: Story = { args: { items: meta.args.items.slice(0, 2) } }
export const ThreeTiles: Story = { args: { items: meta.args.items.slice(0, 3) } }
export const FourTiles: Story = { args: { items: meta.args.items.slice(0, 4) } }
export const FiveTiles: Story = { args: { items: meta.args.items.slice(0, 5) } }
export const BadgeOnEveryTile: Story = {
  args: { items: meta.args.items.map((item) => ({ ...item, badge: 'Elite' })) },
}
export const NoBadges: Story = {
  args: { items: meta.args.items.map(({ badge: _badge, ...item }) => item) },
}
export const AllTrustSignalKinds: Story = {
  args: {
    trustSignals: [
      { label: 'Financing available', kind: 'financing' },
      { label: '100% satisfaction guarantee', kind: 'guarantee' },
      { label: 'Licensed, bonded, and insured', kind: 'license' },
      { label: 'Certified technicians', kind: 'certification' },
      { label: '24/7 emergency service', kind: 'availability' },
      { label: 'Free estimates', kind: 'estimate' },
      { label: 'Members save 10%', kind: 'offer' },
      { label: 'Family owned since 1986', kind: 'other' },
    ],
  },
}
export const Mobile: Story = { globals: { viewport: { value: 'mobile1', isRotated: false } } }
