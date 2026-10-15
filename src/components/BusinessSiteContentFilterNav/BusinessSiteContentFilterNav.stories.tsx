import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteContentFilterNav } from './BusinessSiteContentFilterNav'
import type {
  BusinessSiteContentFilterNavAppearance,
  BusinessSiteContentFilterNavProps,
  BusinessSiteContentFilterNavTrade,
} from './helpers/types'

interface StoryArgs extends Omit<BusinessSiteContentFilterNavProps, 'appearance'>, Required<Omit<BusinessSiteContentFilterNavAppearance, 'textColor' | 'accentColor'>> {}

const trades: BusinessSiteContentFilterNavTrade[] = [
  { key: 'plumbing', label: 'Plumbing', services: ['Water Filtration', 'Drain Cleaning', 'Water Heater', 'Leak Detection', 'Sewer Line Repair', 'Toilet Repair', 'Water Softener'] },
  { key: 'hvac', label: 'HVAC', services: ['HVAC Repair', 'Emergency HVAC Services', 'Indoor Air Quality Services', 'AC Repair', 'AC Installation', 'Duct Services', 'HVAC Maintenance', 'Heating System', 'Heat Pump'] },
  { key: 'electrical', label: 'Electrical', services: ['Panel Upgrade', 'EV Charger Installation', 'Generator Installation', 'Lighting', 'Electrical Repair'] },
]

// Storybook-only demo routing — a real consumer supplies its own buildHref matching its actual route shape.
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const demoBuildHref = (trade: string, service?: string | null) =>
  service ? `/blogs/${trade}/${slugify(service)}` : `/blogs/${trade}`

const meta = {
  title: 'Components/Business Site/Content Filter Nav',
  component: BusinessSiteContentFilterNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Trade and service filter navigation for content listing pages (/blogs, /faqs, /careers, and similar future pages — the same component serves all of them, there is nothing page-specific about it). Every tab, chip, and row is a real server-rendered `<a href>` — there is no client-side filtering. There is no "all services" option: the API only ever resolves one active service, so a trade tab links straight to that trade\'s first service. Desktop (>= 768px) shows trade tabs plus a service chip row, with the active chip rendered as a filled button using the gradient palette; below that, a sticky trigger opens a bottom-sheet with its own trade tablist (switches the previewed list only, does not navigate) and a row list. This package has no notion of a route scheme — `buildHref` is required and is the only way a href is produced, so each consuming app supplies its own URL shape. Appearance is driven by a `gradientStartColor`/`gradientEndColor` palette — `textColor`/`accentColor` remain as a legacy fallback only when no palette is supplied.',
      },
    },
  },
  render: ({ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, buttonRadius, motion, ...props }: StoryArgs) => (
    <BusinessSiteContentFilterNav
      {...props}
      appearance={{ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, buttonRadius, motion }}
    />
  ),
  argTypes: {
    trades: { control: 'object' },
    activeTrade: { control: 'select', options: trades.map((trade) => trade.key) },
    activeService: { control: 'text' },
    ariaLabel: { control: 'text' },
    mobileDialogTitle: { control: 'text' },
    font: { control: 'text' },
    headingFont: { control: 'text' },
    backgroundColor: { control: 'color' },
    gradientStartColor: { control: 'color' },
    gradientEndColor: { control: 'color' },
    buttonRadius: { control: 'inline-radio', options: ['2px', '8px', '16px', '32px'] },
    motion: { control: 'inline-radio', options: ['none', 'subtle'] },
  },
  args: {
    trades,
    activeTrade: 'plumbing',
    activeService: 'Water Filtration',
    buildHref: demoBuildHref,
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

export const ServiceSelected: Story = {
  args: { activeTrade: 'hvac', activeService: 'AC Repair' },
}

export const CustomRouting: Story = {
  args: {
    buildHref: (trade, service) => (service ? `/resources/${trade}?service=${encodeURIComponent(service)}` : `/resources/${trade}`),
  },
}

export const AlternatePalette: Story = {
  args: { backgroundColor: '#fff8ee', gradientStartColor: '#17392f', gradientEndColor: '#416951' },
}

export const GradientActiveService: Story = {
  parameters: {
    docs: { description: { story: 'A two-tone gradient makes it obvious the active service chip is a filled button, not a flat fill — this is the same `fill` token the mobile trigger\'s "Change" button uses.' } },
  },
  args: { gradientStartColor: '#1d4f8c', gradientEndColor: '#7c3aed' },
}

export const SingleTrade: Story = {
  args: { trades: [trades[0]!] },
}

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
