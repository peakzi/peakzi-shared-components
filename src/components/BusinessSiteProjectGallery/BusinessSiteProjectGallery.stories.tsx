import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteProjectGallery } from './BusinessSiteProjectGallery'
import type { BusinessSiteProjectGalleryAppearance, BusinessSiteProjectGalleryProps } from './helpers/types'

interface StoryArgs extends Omit<BusinessSiteProjectGalleryProps, 'appearance'>, Required<BusinessSiteProjectGalleryAppearance> {}

const imageBase = 'https://res.cloudinary.com/dzinii45g/image/upload/aiWebsiteImagesProd/'
const meta = {
  title: 'Components/Business Site/Project Gallery',
  component: BusinessSiteProjectGallery,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Server-rendered project photos, captions and service tags. The original uniform grid remains available; Mosaic uses natural-ratio columns with three desktop columns (four in compact), two on tablet/mobile, and one on narrow phones. Optional native-dialog previews support keyboard navigation, swipe, focus restoration and scroll locking; original links still work without JavaScript. Image dimensions reserve space when supplied; unknown dimensions use an initial ratio until images load. These stories use demonstration captions.' } },
  },
  render: ({ font, headingFont, backgroundColor, gradientEndColor, textColor, accentColor, buttonRadius, density, motion, ...props }: StoryArgs) => (
    <BusinessSiteProjectGallery {...props} appearance={{ font, headingFont, backgroundColor, gradientEndColor, textColor, accentColor, buttonRadius, density, motion }} />
  ),
  argTypes: {
    items: { control: 'object' },
    viewAll: { control: 'object' },
    font: { control: 'text' },
    headingFont: { control: 'text' },
    backgroundColor: { control: 'color' },
    gradientEndColor: { control: 'color' },
    textColor: { control: 'color' },
    accentColor: { control: 'color' },
    buttonRadius: { control: 'inline-radio', options: ['2px', '8px', '16px', '32px'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    motion: { control: 'inline-radio', options: ['none', 'subtle'] },
    layout: { control: 'inline-radio', options: ['grid', 'mosaic'] },
    imageFit: { control: 'inline-radio', options: ['contain', 'cover'] },
    enablePreview: { control: 'boolean' },
  },
  args: {
    title: 'Recent work',
    eyebrow: 'Project gallery',
    items: [
      { src: `${imageBase}knxuhj0nue7osqx0fprx.jpg`, alt: 'Before and after a valve and pipe replacement on a brick wall.', caption: 'Pipe replacement — demonstration caption', location: 'Santa Maria, CA', href: `${imageBase}knxuhj0nue7osqx0fprx.jpg`, newTab: true },
      { src: `${imageBase}pzuza3qbdcgjhvtsxm0b.jpg`, alt: 'Traditional and tankless water heater installations.', caption: 'Water heater installation — demonstration caption', location: 'Santa Maria, CA' },
      { src: `${imageBase}thhrewgkdvrbc7dsc0r5.jpg`, alt: 'Before and after upgrading to a tankless water heater.', caption: 'Tankless upgrade — demonstration caption', location: 'Santa Maria, CA' },
      { src: `${imageBase}j9ncp2dph5uw4kfqsw0w.jpg`, alt: 'Service vehicles parked outside a commercial building.', caption: 'Service team vehicles — demonstration caption' },
    ],
    viewAll: { label: 'View project gallery', href: '/project-gallery' },
    font: 'IBM Plex Sans',
    headingFont: 'Archivo',
    backgroundColor: '#ffffff',
    gradientEndColor: '#ffffff',
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
export const Dark: Story = { args: { backgroundColor: '#12171c', gradientEndColor: '#12171c', textColor: '#ffffff', accentColor: '#a5c9ee' } }
export const SingleImage: Story = { args: { items: [meta.args.items[0]!] } }
export const WithoutCaptions: Story = { args: { items: meta.args.items.map(({ src, alt }) => ({ src, alt })) } }
export const Empty: Story = { args: { items: [] } }
export const Mobile: Story = { decorators: [(Story) => <div style={{ maxWidth: 390, margin: '0 auto' }}><Story /></div>] }
export const Mosaic: Story = { args: { layout: 'mosaic', enablePreview: true, backgroundColor: '#12171c', gradientEndColor: '#12171c', textColor: '#ffffff', accentColor: '#a5c9ee', viewAll: undefined } }
export const CompactMosaic: Story = { args: { ...Mosaic.args, density: 'compact' } }
export const MobileMosaic: Story = { args: { ...Mosaic.args }, decorators: Mobile.decorators }
