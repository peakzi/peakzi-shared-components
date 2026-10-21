import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteContentList } from './BusinessSiteContentList'
import type {
  BusinessSiteContentListAppearance,
  BusinessSiteContentListItem,
  BusinessSiteContentListProps,
} from './helpers/types'

interface StoryArgs extends Omit<BusinessSiteContentListProps, 'appearance'>, Required<Omit<BusinessSiteContentListAppearance, 'textColor' | 'accentColor'>> {}

const items: BusinessSiteContentListItem[] = [
  {
    id: '1',
    title: 'How to fix a leaky faucet in 5 steps',
    href: '/blogs/leaky-faucet',
    excerpt: 'A dripping faucet wastes water and money. Here is how to diagnose and fix the most common causes yourself.',
    category: 'Plumbing',
    readingTime: '5 min read',
    publishedOn: '2026-01-12',
    image: { src: '/demo-assets/hero-example-service.svg', alt: 'Illustration of a plumbing repair' },
  },
  {
    id: '2',
    title: 'Signs your water heater needs replacing',
    href: '/blogs/water-heater-signs',
    excerpt: 'From rusty water to strange noises, these are the warning signs homeowners should never ignore.',
    category: 'Plumbing',
    readingTime: '4 min read',
    publishedOn: '2025-12-28',
  },
  {
    id: '3',
    title: 'Seasonal HVAC maintenance checklist',
    href: '/blogs/hvac-checklist',
    excerpt: 'Keep your system running efficiently all year with this simple seasonal checklist.',
    category: 'HVAC',
    readingTime: '6 min read',
    publishedOn: '2025-12-10',
  },
]

const fallbackImage = { src: '/demo-assets/peakzi-logo-color.png', alt: 'Company logo' }

const meta = {
  title: 'Components/Business Site/Content List',
  component: BusinessSiteContentList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Responsive, server-rendered content card grid used for blog, FAQ, and career listing pages. Items carry an ISO `publishedOn` date and an already-rendered excerpt (plain text or markup from the consuming app\'s own markdown renderer) — this package never parses markdown itself. Each item can supply its own `image`; when absent, `fallbackImage` (e.g. the business logo) is used, or set `showImages={false}` to omit imagery entirely (e.g. FAQ listings). `appearance.density` defaults to \'comfortable\' (a multi-column grid); \'compact\' is a single-column row list with a thumbnail on the left, tighter spacing, and a smaller type scale — matching the `density` convention used by `BusinessSiteServices`/`BusinessSiteBlogs`. Appearance is driven by a `gradientStartColor`/`gradientEndColor` palette (text, accents, and the view-all button all derive from it) — `textColor`/`accentColor` remain as a legacy fallback only when no palette is supplied.',
      },
    },
  },
  render: ({ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, buttonRadius, density, motion, ...props }: StoryArgs) => (
    <BusinessSiteContentList
      {...props}
      appearance={{ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, buttonRadius, density, motion }}
    />
  ),
  argTypes: {
    items: { control: 'object' },
    viewAll: { control: 'object' },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    isLoading: { control: 'boolean' },
    loadingCount: { control: 'number' },
    emptyMessage: { control: 'text' },
    showImages: { control: 'boolean' },
    fallbackImage: { control: 'object' },
    font: { control: 'text' },
    headingFont: { control: 'text' },
    backgroundColor: { control: 'color' },
    gradientStartColor: { control: 'color' },
    gradientEndColor: { control: 'color' },
    buttonRadius: { control: 'inline-radio', options: ['2px', '8px', '16px', '32px'] },
    motion: { control: 'inline-radio', options: ['none', 'subtle'] },
  },
  args: {
    items,
    title: 'Tips & insights',
    eyebrow: 'Resources',
    intro: 'Guides, how-tos, and industry updates from our team.',
    density: 'comfortable',
    viewAll: { label: 'View all resources', href: '/blogs' },
    showImages: true,
    fallbackImage,
    font: 'IBM Plex Sans',
    headingFont: 'Archivo',
    backgroundColor: '#ffffff',
    gradientStartColor: '#12171c',
    gradientEndColor: '#716a64',
    buttonRadius: '8px',
    motion: 'subtle',
  },
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const NoMotion: Story = { args: { motion: 'none' } }

export const Compact: Story = {
  args: { density: 'compact' },
}

export const Loading: Story = {
  args: { isLoading: true, loadingCount: 3 },
}

export const Empty: Story = {
  args: { items: [], emptyMessage: 'No results found for this category.' },
}

export const AlternatePalette: Story = {
  args: { backgroundColor: '#fff8ee', gradientStartColor: '#17392f', gradientEndColor: '#416951' },
}

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

export const LogoFallback: Story = {
  args: {
    items: items.map((item) => ({ ...item, image: undefined })),
    fallbackImage,
  },
}

export const NoImages: Story = {
  args: { showImages: false },
}
