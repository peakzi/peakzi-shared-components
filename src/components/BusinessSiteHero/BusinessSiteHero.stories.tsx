/// <reference types="vite/client" />
import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteHero } from './BusinessSiteHero'
import type {
  BusinessSiteHeroAppearance,
  BusinessSiteHeroImage,
  BusinessSiteHeroProps,
} from './BusinessSiteHero'

type Appearance = Required<Pick<BusinessSiteHeroAppearance,
  'font' | 'headingFont' | 'backgroundColor' | 'textColor' | 'accentColor' | 'buttonRadius' | 'density' | 'motion'
>>

interface StoryArgs extends Omit<BusinessSiteHeroProps, 'appearance' | 'aside'>, Appearance {
  gradientEndColor?: string
  showFormSlot: boolean
}

const images: BusinessSiteHeroImage[] = [
  { src: '/demo-assets/hero-example-home.svg', alt: 'Illustration placeholder for a client home photo', width: 800, height: 640 },
  { src: '/demo-assets/hero-example-team.svg', alt: 'Illustration placeholder for a client team photo', width: 800, height: 640 },
  { src: '/demo-assets/hero-example-service.svg', alt: 'Illustration placeholder for a client service photo', width: 800, height: 640 },
]

const formSlot = (
  <div style={{
    padding: 28,
    borderRadius: 16,
    background: '#ffffff',
    color: '#12171c',
    boxShadow: '0 12px 36px #00000026',
    fontFamily: 'IBM Plex Sans, sans-serif',
  }}>
    <strong>Estimate form slot</strong>
    <p style={{ margin: '12px 0 0', color: '#3c4856' }}>
      Placeholder only. The real form will be designed and supplied by the consuming app later.
    </p>
  </div>
)

const meta = {
  title: 'Components/Business Site/Hero',
  component: BusinessSiteHero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Server-rendered, tenant-configurable hero. The headline, answer, and real action links are present in initial HTML; only the photo carousel hydrates. Image illustrations and the estimate form slot in these stories are placeholders. Load the chosen font and provide real, descriptive photo alt text in the consuming app. Use only once per page because this component renders an h1.',
      },
    },
  },
  render: ({
    font, headingFont, backgroundColor, gradientEndColor, textColor, accentColor, buttonRadius, density, motion,
    showFormSlot, ...hero
  }: StoryArgs) => (
    <BusinessSiteHero
      {...hero}
      appearance={{ font, headingFont, backgroundColor, gradientEndColor, textColor, accentColor, buttonRadius, density, motion }}
      aside={showFormSlot ? formSlot : undefined}
    />
  ),
  argTypes: {
    layout: { control: 'inline-radio', options: ['flat', 'split', 'background'] },
    imageFit: { control: 'inline-radio', options: ['cover', 'contain'], description: 'Contain shows the entire image, with empty space when its aspect ratio differs from the frame.' },
    imageBackdrop: { control: 'inline-radio', options: ['solid', 'blur'], description: 'In split or background + contain mode, fill the surrounding space with a blurred copy of the image.' },
    imagePosition: { control: 'inline-radio', options: ['left', 'center', 'right'], description: 'Horizontal placement of images within the hero frame.' },
    contentOrder: {
      control: 'inline-radio',
      options: ['text-first', 'image-first'],
      description: 'In a split layout, choose the desktop column order. On mobile, the headline and actions lead, followed by the image and full answer.',
    },
    background: { control: 'select', options: ['surface', 'tint', 'soft', 'gradient', 'ink'] },
    align: { control: 'inline-radio', options: ['left', 'center'] },
    headlineSize: { control: 'select', options: ['auto', 'xl', 'lg', 'md', 'sm'] },
    overlay: { control: { type: 'range', min: 0.55, max: 0.85, step: 0.01 } },
    intervalMs: { control: { type: 'number', min: 0, step: 1000 }, description: 'Carousel autoplay with subtle motion; 0 disables it. Reduced motion also stops autoplay.' },
    buttonRadius: { control: 'inline-radio', options: ['2px', '8px', '16px', '32px'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    motion: { control: 'inline-radio', options: ['none', 'subtle'] },
    font: { control: 'text' },
    headingFont: { control: 'text' },
    backgroundColor: { control: 'color' },
    gradientEndColor: { control: 'color', description: 'Gradient endpoint; defaults to the accent color when unset.' },
    textColor: { control: 'color' },
    accentColor: { control: 'color' },
    images: { control: 'object' },
    rating: { control: 'object' },
    actions: { control: 'object' },
    showFormSlot: { control: 'boolean', description: 'Shows the Storybook-only estimate form placeholder.' },
  },
  args: {
    headline: 'Home service answers, from people you can trust.',
    eyebrow: 'Blue Line Electric · Austin, TX',
    answer: 'Explore dependable electrical service, clear next steps, and trusted local expertise for your home.',
    rating: { label: '4.9 / 5 from 596 reviews', iconName: 'star', iconPosition: 'before' },
    actions: [
      { id: 'estimate', label: 'Get an estimate', href: '/contact', type: 'primary', iconName: 'arrow-up-right', iconPosition: 'after' },
      { id: 'call', label: 'Call (512) 555-0188', href: 'tel:+15125550188', type: 'secondary', iconName: 'phone' },
    ],
    images,
    layout: 'split',
    imageFit: 'cover',
    imageBackdrop: 'solid',
    imagePosition: 'center',
    contentOrder: 'text-first',
    background: 'surface',
    align: 'left',
    headlineSize: 'auto',
    intervalMs: 5000,
    overlay: 0.62,
    font: 'IBM Plex Sans',
    headingFont: 'Archivo',
    backgroundColor: '#ffffff',
    textColor: '#12171c',
    accentColor: '#1d4f8c',
    buttonRadius: '8px',
    density: 'comfortable',
    motion: 'subtle',
    showFormSlot: false,
  },
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const NoMotion: Story = { args: { motion: 'none' } }

export const Flat: Story = {
  args: { layout: 'flat', images: [], align: 'center', background: 'tint' },
}

export const SplitSinglePhoto: Story = {
  args: { layout: 'split', images: [images[0]!] },
}

export const SplitFullImages: Story = {
  args: {
    layout: 'split',
    imageFit: 'contain',
    imageBackdrop: 'blur',
    background: 'gradient',
    backgroundColor: '#12171c',
    gradientEndColor: '#30343b',
    textColor: '#ffffff',
  },
}

export const ImageFirst: Story = {
  args: { layout: 'split', contentOrder: 'image-first' },
}

export const TextFirst: Story = {
  args: { layout: 'split', contentOrder: 'text-first' },
}

export const BackgroundCarousel: Story = {
  args: {
    layout: 'background',
    textColor: '#ffffff',
    backgroundColor: '#12171c',
    accentColor: '#f6c54b',
  },
}

export const FullBackgroundImages: Story = {
  args: {
    layout: 'background',
    imageFit: 'contain',
    imageBackdrop: 'blur',
    backgroundColor: '#12171c',
    gradientEndColor: '#30343b',
    textColor: '#ffffff',
    accentColor: '#f6c54b',
  },
}

export const Gradient: Story = {
  args: {
    layout: 'flat',
    images: [],
    background: 'gradient',
    backgroundColor: '#12171c',
    textColor: '#ffffff',
    accentColor: '#746dff',
  },
}

export const FormSlotPlaceholder: Story = {
  args: { layout: 'split', showFormSlot: true, background: 'soft', images: [] },
}

export const BackgroundCarouselWithFormSlot: Story = {
  args: {
    layout: 'background',
    background: 'gradient',
    showFormSlot: true,
    textColor: '#ffffff',
    backgroundColor: '#12171c',
    accentColor: '#f6c54b',
  },
}

export const Mobile: Story = {
  globals: { viewport: 'mobile2' },
  render: (args) => (
    <div style={{ width: 390, maxWidth: '100%', marginInline: 'auto' }}>
      <BusinessSiteHero
        headline={args.headline}
        eyebrow={args.eyebrow}
        answer={args.answer}
        rating={args.rating}
        actions={args.actions}
        images={args.images}
        layout={args.layout}
        contentOrder={args.contentOrder}
        background={args.background}
        appearance={{
          font: args.font, headingFont: args.headingFont, backgroundColor: args.backgroundColor,
          textColor: args.textColor, accentColor: args.accentColor,
          buttonRadius: args.buttonRadius, density: args.density, motion: args.motion,
        }}
      />
    </div>
  ),
}
