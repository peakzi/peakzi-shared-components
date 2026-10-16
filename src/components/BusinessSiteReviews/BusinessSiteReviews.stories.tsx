import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteReviews } from './BusinessSiteReviews'
import type { BusinessSiteReviewsAppearance, BusinessSiteReviewsProps } from './helpers/types'

interface StoryArgs extends Omit<BusinessSiteReviewsProps, 'appearance'>, Required<BusinessSiteReviewsAppearance> {}

const meta = {
  title: 'Components/Business Site/Reviews',
  component: BusinessSiteReviews,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { exclude: ['appearance'] },
    docs: { description: { component: 'Server-safe summary panel and review grid. Supplied phrases highlight literal matches without changing review copy. Customer mentions use supplied summary.mentionCounts totals across all reviews, or count each tag once per displayed review when the prop is omitted. Website theme applies throughout; compact density uses a tighter list. Subtle motion shares the Blogs scroll reveal, featured-content reveal, card lift/shadow, compact-row slide and button shine. Full reviews fade in when expanded. Reduced-motion and unsupported-browser fallbacks keep content readable; cards remain quotations, not navigation links.' } },
  },
  render: ({ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, buttonRadius, density, motion, ...props }: StoryArgs) => (
    <BusinessSiteReviews {...props} appearance={{ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, buttonRadius, density, motion }} />
  ),
  argTypes: {
    items: { control: 'object' },
    summary: { control: 'object' },
    viewAll: { control: 'object' },
    font: { control: 'text' },
    headingFont: { control: 'text' },
    backgroundColor: { control: 'color', description: 'Light review-card background and summary text/button surface.' },
    gradientStartColor: { control: 'color', description: 'Website gradient start; also the preferred text color on light cards.' },
    gradientEndColor: { control: 'color', description: 'Website gradient end. Summary, card stars and avatar all share the same gradient.' },
    buttonRadius: { control: 'inline-radio', options: ['2px', '8px', '16px', '32px'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    motion: { control: 'inline-radio', options: ['none', 'subtle'] },
  },
  args: {
    title: 'Recent customer reviews in our service area',
    eyebrow: 'Reviews',
    items: [
      { id: 'alex', reviewerName: 'Alex Morgan', text: 'The team explained the repair clearly, kept us updated and left the work area tidy. We appreciated knowing what to expect before the work started.', rating: 5, reviewDate: '2026-09-20', tags: ['Communication', 'Professionalism', 'Quality of Work'], highlightedPhrases: ['explained the repair clearly', 'left the work area tidy'] },
      { id: 'sam', reviewerName: 'Sam Rivera', text: 'Helpful communication and a straightforward explanation of the available options.', rating: 4.5, reviewDate: '2026-09-18', tags: ['Communication', 'Service'], highlightedPhrases: ['Helpful communication'] },
      { id: 'jordan', reviewerName: 'Jordan Lee', text: 'The appointment went smoothly and the technician answered our questions.', rating: 4, reviewDate: '2026-09-12', tags: ['Professionalism', 'Service'], highlightedPhrases: ['answered our questions'] },
      { id: 'taylor', reviewerName: 'Taylor Reed', text: 'A careful repair and a clear explanation of what needed to be done. The team was professional and cleaned up before leaving.', rating: 5, reviewDate: '2026-09-10', tags: ['Quality of Work', 'Professionalism', 'Communication'], highlightedPhrases: ['careful repair', 'cleaned up before leaving'] },
      { id: 'casey', reviewerName: 'Casey Brooks', text: 'Friendly service, with every step explained. We appreciated the help.', rating: 4.5, reviewDate: '2026-09-08', tags: ['Service', 'Overall experience'], highlightedPhrases: ['Friendly service'] },
    ],
    summary: { rating: 4.9, reviewCount: 125 },
    viewAll: { label: 'Read more reviews', href: 'https://example.com/reviews', newTab: true },
    font: 'IBM Plex Sans',
    headingFont: 'Archivo',
    backgroundColor: '#ffffff',
    gradientStartColor: '#12171c',
    gradientEndColor: '#716a64',
    buttonRadius: '8px',
    density: 'comfortable',
    motion: 'subtle',
  },
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const AggregateMentions: Story = {
  args: {
    summary: {
      ...meta.args.summary,
      mentionCounts: {
        Professionalism: 2345, Service: 1872, 'Quality of Work': 1851,
        'Brand Loyalty': 1325, Punctuality: 935, 'Overall experience': 934,
      },
    },
  },
  parameters: { docs: { description: { story: 'API totals cover all customer reviews. Omit summary.mentionCounts to retain counts from displayed review tags; pass an empty object to hide mentions.' } } },
}
export const Compact: Story = { args: { density: 'compact' } }
export const NoMotion: Story = { args: { motion: 'none' } }
export const ScrollReveal: Story = {
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
export const CustomGradient: Story = { args: { gradientStartColor: '#142433', gradientEndColor: '#36536b' } }
export const SingleReview: Story = { args: { items: [meta.args.items[0]!] } }
export const WithoutSummary: Story = { args: { summary: {} } }
export const WithoutMentions: Story = { args: { items: meta.args.items.map((item) => ({ ...item, tags: [] })) } }
export const WithoutHighlights: Story = { args: { items: meta.args.items.map((item) => ({ ...item, highlightedPhrases: [] })) } }
export const LongReview: Story = { args: { items: [{ ...meta.args.items[0]!, text: meta.args.items[0]!.text.repeat(8) }, ...meta.args.items.slice(1)] } }
export const MissingRatingAndDate: Story = { args: { items: [{ id: 'no-rating', reviewerName: 'Alex Morgan', text: 'The team explained the available options.' }], summary: {} } }
export const Mobile: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 390, margin: '0 auto' }}><Story /></div>],
}
