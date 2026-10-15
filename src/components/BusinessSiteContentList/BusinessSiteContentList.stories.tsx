import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteContentList } from './BusinessSiteContentList'
import type {
  BusinessSiteContentListAppearance,
  BusinessSiteContentListItem,
  BusinessSiteContentListProps,
} from './helpers/types'

type Appearance = Required<Pick<BusinessSiteContentListAppearance,
  'font' | 'headingFont' | 'backgroundColor' | 'textColor' | 'accentColor' | 'buttonRadius' | 'density' | 'motion'
>>

interface StoryArgs extends Omit<BusinessSiteContentListProps, 'appearance'>, Appearance {}

const items: BusinessSiteContentListItem[] = [
  {
    id: '1',
    title: 'How to fix a leaky faucet in 5 steps',
    href: '/blogs/leaky-faucet',
    excerpt: 'A dripping faucet wastes water and money. Here is how to diagnose and fix the most common causes yourself.',
    category: 'Plumbing',
    date: 'Jan 12, 2026',
  },
  {
    id: '2',
    title: 'Signs your water heater needs replacing',
    href: '/blogs/water-heater-signs',
    excerpt: 'From rusty water to strange noises, these are the warning signs homeowners should never ignore.',
    category: 'Plumbing',
    date: 'Dec 28, 2025',
  },
  {
    id: '3',
    title: 'Seasonal HVAC maintenance checklist',
    href: '/blogs/hvac-checklist',
    excerpt: 'Keep your system running efficiently all year with this simple seasonal checklist.',
    category: 'HVAC',
    date: 'Dec 10, 2025',
  },
]

const meta = {
  title: 'Components/Business Site/Content List',
  component: BusinessSiteContentList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Responsive, server-rendered content card grid used for blog, FAQ, and career listing pages. Items carry a pre-formatted date and an already-rendered excerpt (plain text or markup from the consuming app\'s own markdown renderer) — this package never parses markdown or dates itself. `layout` defaults to a multi-column grid; set it to \'stack\' for a single-column list. Appearance can be mapped from site-wide tenant settings.',
      },
    },
  },
  render: ({ font, headingFont, backgroundColor, textColor, accentColor, buttonRadius, density, motion, ...props }: StoryArgs) => (
    <BusinessSiteContentList
      {...props}
      appearance={{ font, headingFont, backgroundColor, textColor, accentColor, buttonRadius, density, motion }}
    />
  ),
  argTypes: {
    items: { control: 'object' },
    viewAll: { control: 'object' },
    layout: { control: 'inline-radio', options: ['grid', 'stack', 'editorial'] },
    isLoading: { control: 'boolean' },
    loadingCount: { control: 'number' },
    emptyMessage: { control: 'text' },
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
    items,
    title: 'Tips & insights',
    eyebrow: 'Resources',
    intro: 'Guides, how-tos, and industry updates from our team.',
    layout: 'grid',
    viewAll: { label: 'View all resources', href: '/blogs' },
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
export const NoMotion: Story = { args: { motion: 'none' } }

export const Stack: Story = {
  args: { layout: 'stack' },
}

export const Editorial: Story = {
  args: { layout: 'editorial', eyebrow: '', intro: '3 articles', items: items.map((item) => ({ ...item, category: '', readingTime: '6 min read' })) },
}

export const Loading: Story = {
  args: { isLoading: true, loadingCount: 3 },
}

export const Empty: Story = {
  args: { items: [], emptyMessage: 'No results found for this category.' },
}

export const Dark: Story = {
  args: { backgroundColor: '#12171c', textColor: '#ffffff', accentColor: '#9ec7ff' },
}

export const Compact: Story = {
  args: { density: 'compact' },
}

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
