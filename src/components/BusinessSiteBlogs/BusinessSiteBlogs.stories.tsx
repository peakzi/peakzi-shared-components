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
    docs: { description: { component: 'Server-rendered, crawlable guides on a light reading surface. Comfortable shows the first supplied article as a featured card, with the remaining guides in a numbered list beside it; mobile stacks the featured card above the list. A safe article cover takes priority over the company-logo fallback. Compact retains tight list rows without images. No carousel, autoplay or invented reading time. The application uses only live /home blogs, while these stories use demonstration content.' } },
  },
  render: ({ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, buttonRadius, density, motion, ...props }: StoryArgs) => (
    <BusinessSiteBlogs {...props} appearance={{ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, buttonRadius, density, motion }} />
  ),
  argTypes: {
    items: { control: 'object' },
    viewAll: { control: 'object' },
    fallbackImage: { control: 'object' },
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
