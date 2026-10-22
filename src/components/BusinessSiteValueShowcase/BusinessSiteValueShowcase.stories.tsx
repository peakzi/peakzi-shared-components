import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteValueShowcase } from './BusinessSiteValueShowcase'
import type { BusinessSiteValueShowcaseAppearance, BusinessSiteValueShowcaseProps } from './helpers/types'

interface StoryArgs extends Omit<BusinessSiteValueShowcaseProps, 'appearance'>, Required<BusinessSiteValueShowcaseAppearance> {}

const milestone: BusinessSiteValueShowcaseProps = {
  title: 'Dallas-Fort Worth’s most-hired AC, plumbing & electrical pros',
  lead: 'From HVAC maintenance to water heaters, you’re calling the crew voted Best in DFW People’s Choice, Gold, every year since 2022.',
  seal: { text: 'One of DFW’s most-reviewed pros', iconName: 'award', stars: true },
  highlights: [
    { iconName: 'award', title: 'Best in DFW People’s Choice 2025, Gold', detail: 'Gold every year since 2022' },
    { iconName: 'award', title: 'Consumer Choice Award 2025' },
    { iconName: 'star', title: 'DFW Favorites 2025' },
    { iconName: 'star', title: 'Best Companies to Work For in Texas', detail: 'Recognized multiple times' },
    { iconName: 'shield', title: 'The Milestone Guarantee', detail: 'If you’re not 100% satisfied, we’re not done.' },
    { iconName: 'check', title: 'Clarity in work', detail: 'Plain, simple explanations' },
    { iconName: 'shield', title: 'Earned trust', detail: 'One visit at a time' },
  ],
  highlightsLabel: 'Awards, guarantees and reputation',
  itemsLabel: 'Top-rated services',
  items: [
    { id: 'hvac', iconName: 'thermometer', label: 'Leader', name: 'HVAC maintenance and tune-ups', standing: 'Out of 200+ businesses', proof: 'Backed by 1,700+ DFW reviews' },
    { id: 'ac', iconName: 'snowflake', label: 'Leader', name: 'AC repair', standing: 'Out of 210+ businesses', proof: '550+ DFW reviews agree' },
    { id: 'plumb', iconName: 'wrench', label: 'Leader', name: 'General plumbing', standing: 'Out of 180+ businesses', proof: 'Praised in 520+ DFW reviews' },
    { id: 'elec', iconName: 'zap', label: 'Leader', name: 'Electrical repair', standing: 'Out of 60+ businesses', proof: 'Trusted in 400+ DFW reviews' },
    { id: 'wh', iconName: 'droplet', label: 'Leader', name: 'Water heater repair', standing: 'Out of 170+ businesses', proof: '290+ DFW reviews and counting' },
    { id: 'local', iconName: 'house', label: 'Leader', name: 'Top-ranked locally', standing: 'In top 1%', proof: 'Measured across DFW' },
  ],
  note: 'Grades compare Milestone with Dallas-Fort Worth home service pros, based on homeowner reviews and the jobs they mention. Leader means #1 in Dallas-Fort Worth for that service.',
}

const meta = {
  title: 'Components/Business Site/Value Showcase',
  component: BusinessSiteValueShowcase,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { exclude: ['appearance'] },
    docs: { description: { component: 'Why-choose section: heading with an optional seal, award and guarantee pills, graded service cards and a caption note. Every string and icon renders exactly as sent; nothing is defaulted. Any number of pills or cards wraps into an even grid; one card keeps its natural width.' } },
  },
  render: ({ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, accentColor, buttonRadius, density, divider, ...props }: StoryArgs) => (
    <BusinessSiteValueShowcase {...props} appearance={{ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, accentColor, buttonRadius, density, divider }} />
  ),
  argTypes: {
    items: { control: 'object' },
    highlights: { control: 'object' },
    seal: { control: 'object' },
    headingLevel: { control: 'inline-radio', options: [2, 3] },
    mobileVisibleItems: { control: 'number', description: 'Cards shown before the "Show more" button in narrow containers (640px and below).' },
    showMoreLabel: { control: 'text', description: 'Collapsed button text. {count} is the number of hidden cards, {total} the card count.' },
    showLessLabel: { control: 'text' },
    font: { control: 'text' },
    headingFont: { control: 'text' },
    backgroundColor: { control: 'color' },
    gradientStartColor: { control: 'color' },
    gradientEndColor: { control: 'color' },
    accentColor: { control: 'color' },
    buttonRadius: { control: 'inline-radio', options: ['2px', '8px', '16px', '32px'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    divider: { control: 'boolean' },
  },
  args: {
    ...milestone,
    font: 'Nunito Sans',
    headingFont: 'Nunito Sans',
    backgroundColor: '#ffffff',
    gradientStartColor: '#000000',
    gradientEndColor: '#2c95b5',
    accentColor: '#1d6f87',
    buttonRadius: '8px',
    density: 'comfortable',
    divider: true,
  },
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MixedLabels: Story = {
  args: {
    title: 'Beltway: Baltimore’s most-reviewed HVAC repair pros',
    lead: 'For heating, AC tune-ups and new systems, you want an Inc. 5000 honoree on the way.',
    seal: { text: 'One of Baltimore’s top-hired home service pros', iconName: 'award', stars: true },
    highlights: [
      { iconName: 'award', title: 'Inc. 5000 Fastest-Growing Companies in America' },
      { iconName: 'star', title: 'The Baltimore Sun’s Best Places to Work' },
      { iconName: 'star', title: 'Reputation', detail: 'Well-rated across Baltimore' },
      { iconName: 'check', title: 'Repeat business', detail: 'Many homeowners return to us' },
      { iconName: 'check', title: 'Clarity in work', detail: 'Plain, simple explanations' },
    ],
    items: [
      { id: 'repair', iconName: 'thermometer', label: 'Leader', name: 'HVAC repair', standing: 'Out of 50+ businesses', proof: 'Backed by 210+ Baltimore reviews' },
      { id: 'maint', iconName: 'thermometer', label: 'Great', name: 'HVAC maintenance and tune-ups', standing: 'In top 6%', proof: '350+ Baltimore reviews agree' },
      { id: 'heat', iconName: 'flame', label: 'Great', name: 'Heating repair', standing: 'In top 7%', proof: 'Praised in 100+ Baltimore reviews' },
      { id: 'install', iconName: 'wrench', label: 'Great', name: 'HVAC installation', standing: 'In top 6%', proof: 'Trusted in 50+ Baltimore reviews' },
      { id: 'local', iconName: 'house', label: 'Great', name: 'Highly ranked locally', standing: 'In top 9%', proof: 'Measured across Baltimore' },
    ],
    note: 'Grades compare Beltway with Baltimore home service pros, based on homeowner reviews and the jobs they mention. Leader means #1 in Baltimore for that service. Great means the top 10% of Baltimore home service pros.',
  },
}

export const NoSealTwoCards: Story = {
  args: {
    title: 'One of Dallas-Fort Worth’s most professional electricians',
    lead: 'For ceiling fans, outlets and switches, you’ll have a crew backed by a standard 5-year warranty.',
    // Empty seal text hides the seal.
    seal: { text: '' },
    highlights: [
      { iconName: 'shield', title: 'Work guarantee', detail: 'Backed by a warranty' },
      { iconName: 'shield', title: 'Professionalism', detail: 'Courteous, respectful crews' },
      { iconName: 'star', title: 'Craftsmanship', detail: 'Careful, skilled work' },
      { iconName: 'check', title: 'Reliability', detail: 'Service you can depend on' },
      { iconName: 'clock', title: 'Punctuality', detail: 'We respect your schedule' },
      { iconName: 'check', title: 'Transparency', detail: 'Open about every job' },
    ],
    items: [
      { id: 'fan', iconName: 'house', label: 'Great', name: 'Ceiling fan installation', standing: 'In top 10%', proof: 'Earning DFW praise' },
      { id: 'outlet', iconName: 'zap', label: 'Good', name: 'Outlet and switch repair', standing: 'In top 13%', proof: 'A rising DFW favorite' },
    ],
    note: 'Grades compare Blue Line Electric with Dallas-Fort Worth electricians, based on homeowner reviews and the jobs they mention. Great means the top 10% of Dallas-Fort Worth electricians and Good the top 25%.',
  },
}

export const SingleCard: Story = { args: { items: milestone.items!.slice(0, 1) } }
export const HighlightsOnly: Story = { args: { items: [] } }
export const CardsOnly: Story = { args: { highlights: [] } }
export const NoLabels: Story = { args: { items: milestone.items!.map((item) => ({ ...item, label: '' })) } }
export const StarsOff: Story = { args: { seal: { text: 'One of DFW’s most-reviewed pros', iconName: 'award', stars: false } } }
export const NoIcons: Story = {
  args: {
    seal: { text: 'One of DFW’s most-reviewed pros' },
    highlights: milestone.highlights!.map(({ iconName: _icon, ...entry }) => entry),
    items: milestone.items!.map(({ iconName: _icon, ...item }) => item),
  },
}
export const Compact: Story = { args: { density: 'compact' } }
export const NestedHeading: Story = { args: { headingLevel: 3 } }
export const Mobile: Story = { globals: { viewport: { value: 'mobile1', isRotated: false } } }
