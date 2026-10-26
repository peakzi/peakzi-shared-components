/// <reference types="vite/client" />
import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteBlogs } from './BusinessSiteBlogs'
import type { BusinessSiteBlogsAppearance, BusinessSiteBlogsProps } from './helpers/types'
import companyLogo from '../../../assets/peakzi-logo-color.png'

interface StoryArgs extends Omit<BusinessSiteBlogsProps, 'appearance'>, Required<Omit<BusinessSiteBlogsAppearance, 'textColor' | 'accentColor'>> {}

const meta = {
  title: 'Components/Business Site/Blogs',
  component: BusinessSiteBlogs,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Server-rendered, crawlable blogs on a light reading surface. The default featured layout preserves the homepage feature and numbered list. The opt-in grid layout uses fixed 16:9 photo frames so portrait images cannot stretch the card row, with two-line titles and excerpts and bottom-aligned Read more links. Theme-derived shadows, three columns in wide containers, two on tablets, and one on mobile are preserved. Compact density retains thumbnail rows. A safe cover takes priority over the company-logo fallback; logos remain contained and missing or failed images retain the same neutral frame. Cover photos in these stories are demonstration content only.' } },
  },
  render: ({ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, buttonRadius, density, motion, ...props }: StoryArgs) => (
    <BusinessSiteBlogs {...props} appearance={{ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, buttonRadius, density, motion }} />
  ),
  argTypes: {
    items: { control: 'object' },
    viewAll: { control: 'object' },
    fallbackImage: { control: 'object' },
    layout: { control: 'inline-radio', options: ['featured', 'grid'] },
    font: { control: 'text' },
    headingFont: { control: 'text' },
    backgroundColor: { control: 'color' },
    gradientStartColor: { control: 'color' },
    gradientEndColor: { control: 'color' },
    buttonRadius: { control: 'inline-radio', options: ['2px', '8px', '16px', '32px'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    motion: { control: 'inline-radio', options: ['none', 'subtle'] },
  },
  args: {
    title: 'Helpful resources',
    eyebrow: 'Learn more',
    items: [
      { id: 'drain', title: 'A practical guide to kitchen drain cleaning', href: '/blogs/drain', category: 'Plumbing', readingTime: '9 min read', publishedOn: '2026-10-05', excerpt: 'Learn how to identify a slow drain, which simple checks to try first, and when to call a plumber.' },
      { id: 'heater', title: 'When should you replace your water heater?', href: '/blogs/heater', category: 'Plumbing', readingTime: '6 min read', publishedOn: '2026-09-28', excerpt: 'Compare repair and replacement options and understand the questions to ask before choosing a new system.' },
      { id: 'filtration', title: 'Whole-home water filtration explained', href: '/blogs/filtration', category: 'Plumbing', excerpt: 'Understand how filtration systems differ and what to consider when planning an installation.' },
      { id: 'leak', title: 'What to do when you find a plumbing leak', href: '/blogs/leak', category: 'Plumbing', excerpt: 'Identify the signs of a leak and learn the questions to ask when arranging a repair.' },
      { id: 'maintenance', title: 'Planning routine plumbing maintenance', href: '/blogs/maintenance', category: 'Plumbing', excerpt: 'Learn about routine checks for your fixtures, drains and water heater.' },
    ],
    viewAll: { label: 'View all blogs', href: '/blogs' },
    fallbackImage: { src: companyLogo, alt: 'Peakzi logo' },
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
export const Compact: Story = { args: { density: 'compact' } }
export const DirectoryGrid: Story = { args: { layout: 'grid', eyebrow: '', viewAll: { label: '', href: '' } } }
export const DirectoryCompact: Story = { args: { layout: 'grid', density: 'compact', eyebrow: '', viewAll: { label: '', href: '' } } }
export const DirectoryWithCovers: Story = { args: { layout: 'grid', items: meta.args.items.map((item, index) => ({
  ...item, coverImage: { src: index % 2 === 0
    ? 'https://res.cloudinary.com/dzinii45g/image/upload/aiWebsiteImagesProd/j9ncp2dph5uw4kfqsw0w.jpg'
    : 'https://res.cloudinary.com/dzinii45g/image/upload/aiWebsiteImagesProd/izylz3mtaetvznao7lvw.jpg', alt: 'Demonstration blog cover' },
})) } }
export const DirectoryWithoutImages: Story = { args: { layout: 'grid', fallbackImage: undefined } }
export const DirectoryMobile: Story = { args: { layout: 'grid' }, decorators: [(Story) => <div style={{ maxWidth: 390, margin: '0 auto' }}><Story /></div>] }
export const AlternatePalette: Story = { args: { backgroundColor: '#fff8ee', gradientStartColor: '#17392f', gradientEndColor: '#416951' } }
export const WithCover: Story = { args: { items: [{ ...meta.args.items[0]!, coverImage: { src: 'https://res.cloudinary.com/dzinii45g/image/upload/aiWebsiteImagesProd/j9ncp2dph5uw4kfqsw0w.jpg', alt: 'Demo blog cover' } }, ...meta.args.items.slice(1)] } }
export const WithoutLogo: Story = { args: { fallbackImage: undefined } }
export const WithoutMetadata: Story = { args: { items: meta.args.items.map(({ id, title, href }) => ({ id, title, href })) } }
export const Empty: Story = { args: { items: [] } }
export const SingleBlog: Story = { args: { items: [meta.args.items[0]!] } }
export const Mobile: Story = { decorators: [(Story) => <div style={{ maxWidth: 390, margin: '0 auto' }}><Story /></div>] }

/** Scroll down: with `motion: 'subtle'` the heading, articles and button rise in as they enter the viewport; hover a card or row for the lift, photo zoom and arrow nudge. */
export const ScrollReveal: Story = {
  args: { items: [{ ...meta.args.items[0]!, coverImage: { src: 'https://res.cloudinary.com/dzinii45g/image/upload/aiWebsiteImagesProd/j9ncp2dph5uw4kfqsw0w.jpg', alt: 'Demo blog cover' } }, ...meta.args.items.slice(1)] },
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
