import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteFaq } from './BusinessSiteFaq'
import type { BusinessSiteFaqAppearance, BusinessSiteFaqProps } from './helpers/types'

type Appearance = Required<Omit<BusinessSiteFaqAppearance, 'textColor' | 'accentColor' | 'contactBackgroundColor' | 'contactGradientEndColor' | 'contactTextColor'>>
interface StoryArgs extends Omit<BusinessSiteFaqProps, 'appearance'>, Appearance {}

const meta = {
  title: 'Components/Business Site/FAQs',
  component: BusinessSiteFaq,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Server-safe FAQ section with native single-open disclosure controls. All answers are included in the initial HTML; the consuming app supplies tenant content and optional formatted answers.' } },
  },
  render: ({ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, buttonRadius, density, motion, ...props }: StoryArgs) => (
    <BusinessSiteFaq {...props} appearance={{ font, headingFont, backgroundColor, gradientStartColor, gradientEndColor, buttonRadius, density, motion }} />
  ),
  argTypes: {
    items: { control: 'object' },
    contact: { control: 'object' },
    defaultOpenFirst: { control: 'boolean' },
    revealOnOpen: { control: 'boolean' },
    layout: { control: 'inline-radio', options: ['split', 'stack'] },
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
    title: 'Frequently asked questions',
    eyebrow: 'FAQs',
    items: [
      { id: 'estimates', question: 'How do I request an estimate?', answer: 'Contact our team with a description of the work you need so we can discuss the next steps.' },
      { id: 'areas', question: 'How can I check whether you serve my city?', answer: 'Check the service areas listed on our website or contact the team to confirm your location.' },
      { id: 'visit', question: 'What should I prepare before a service visit?', answer: 'Describe the issue and make the work area accessible. Let the team know about any access requirements when booking.' },
      { id: 'booking', question: 'How can I book a service?', answer: 'Use the contact options on the website to discuss availability with our team.' },
    ],
    contact: {
      title: 'Still have questions?',
      description: 'Contact our team to discuss your needs or arrange a service.',
      actions: [{ id: 'call', label: '(512) 555-0188', href: 'tel:5125550188', iconName: 'phone' }],
    },
    defaultOpenFirst: true,
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
export const Dark: Story = { args: { backgroundColor: '#12171c' } }
export const AlternatePalette: Story = { args: { backgroundColor: '#fff8ee', gradientStartColor: '#17392f', gradientEndColor: '#416951' } }
export const WithoutContact: Story = { args: { contact: { title: '' } } }
export const AllClosed: Story = { args: { defaultOpenFirst: false } }
export const Directory: Story = { args: { layout: 'stack', eyebrow: '', title: 'Water heater questions', intro: '4 questions', contact: { title: '' }, defaultOpenFirst: true, revealOnOpen: true } }
export const DirectoryCompact: Story = { args: { ...Directory.args, density: 'compact' } }
export const NoMotion: Story = { args: { motion: 'none' } }

/** Scroll down: with `motion: 'subtle'` the title, contact card and question rows rise in as they enter the viewport. */
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
export const Mobile: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 390, margin: '0 auto' }}><Story /></div>],
}
