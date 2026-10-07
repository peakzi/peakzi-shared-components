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
    docs: { description: { component: 'Server-safe featured testimonial and review cards. Ratings, totals and source labels are supplied by the consuming app. Compact density uses a list; no review text waits for hydration or animations.' } },
  },
  render: ({ font, headingFont, backgroundColor, textColor, accentColor, buttonRadius, density, motion, ...props }: StoryArgs) => (
    <BusinessSiteReviews {...props} appearance={{ font, headingFont, backgroundColor, textColor, accentColor, buttonRadius, density, motion }} />
  ),
  argTypes: {
    items: { control: 'object' },
    summary: { control: 'object' },
    viewAll: { control: 'object' },
    font: { control: 'text' },
    headingFont: { control: 'text' },
    backgroundColor: { control: 'color' },
    textColor: { control: 'color' },
    accentColor: { control: 'color' },
    buttonRadius: { control: 'inline-radio', options: ['2px', '8px', '16px', '32px'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    motion: { control: 'inline-radio', options: ['none', 'subtle'] },
  },
  args: {
    title: 'Hear it from our customers.',
    eyebrow: 'Reviews',
    items: [
      { id: 'alex', reviewerName: 'Alex Morgan', text: 'The team explained the repair clearly, kept us updated and left the work area tidy. We appreciated knowing what to expect before the work started.', rating: 5, reviewDate: '2026-09-20' },
      { id: 'sam', reviewerName: 'Sam Rivera', text: 'Helpful communication and a straightforward explanation of the available options.', rating: 4.5, reviewDate: '2026-09-18' },
      { id: 'jordan', reviewerName: 'Jordan Lee', text: 'The appointment went smoothly and the technician answered our questions.', rating: 4, reviewDate: '2026-09-12' },
    ],
    summary: { rating: 4.9, reviewCount: 125 },
    viewAll: { label: 'Read more reviews', href: 'https://example.com/reviews', newTab: true },
    font: 'IBM Plex Sans',
    headingFont: 'Archivo',
    backgroundColor: '#ffffff',
    textColor: '#12171c',
    accentColor: '#1d4f8c',
    buttonRadius: '8px',
    density: 'comfortable',
    motion: 'subtle',
  },
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Compact: Story = { args: { density: 'compact' } }
export const Dark: Story = { args: { backgroundColor: '#12171c', textColor: '#ffffff', accentColor: '#a5c9ee' } }
export const SingleReview: Story = { args: { items: [meta.args.items[0]!] } }
export const WithoutSummary: Story = { args: { summary: {} } }
export const MissingRatingAndDate: Story = { args: { items: [{ id: 'no-rating', reviewerName: 'Alex Morgan', text: 'The team explained the available options.' }], summary: {} } }
export const Mobile: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 390, margin: '0 auto' }}><Story /></div>],
}
