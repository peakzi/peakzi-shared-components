import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteAbout } from './BusinessSiteAbout'

const meta = {
  title: 'Components/Business Site/About',
  component: BusinessSiteAbout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Reusable server-rendered About presentation. The application supplies company content, validated actions, optional About-specific photo, breadcrumb and website appearance. The hero uses the website page background. Missing photos and sections leave no placeholders. The component makes no API requests and does not select homepage images.' } },
  },
  argTypes: {
    appearance: { control: 'object' },
    sections: { control: 'object' },
    actions: { control: 'object' },
    image: { control: 'object' },
    headline: { control: 'text' },
    businessName: { control: 'text' },
  },
  render: (args, context) => <BusinessSiteAbout {...args} appearance={{
    ...args.appearance,
    ...(context.globals['theme'] === 'dark' ? { backgroundColor: '#091020', textColor: '#f5f7fb' } : {}),
  }} />,
  args: {
    headline: 'About Summit Home Services',
    description: 'Company-provided introduction, rendered without generating additional claims.',
    businessName: 'Summit Home Services',
    breadcrumb: <nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li>About us</li></ol></nav>,
    sections: [
      { id: 'who-we-are', title: 'Who we are', content: <><p>Company-provided story and background.</p><p>A second paragraph supplied by the business.</p></> },
      { id: 'our-promise', title: 'Our promise', content: <p>The company describes its commitment to customers here.</p> },
      { id: 'why-choose-us', title: 'Why choose us', content: <><p>Company-provided reasons to choose the team.</p><p>Additional details supplied by the company.</p></> },
      { id: 'awards-and-certifications', title: 'Awards and certifications', content: <p>Only qualifications confirmed and supplied by the company appear here.</p> },
      { id: 'our-motto', title: 'Our motto', content: <p>Here when you need us.</p> },
    ],
    actions: [
      { id: 'book', label: 'Book service', href: '/schedule', type: 'secondary', iconName: 'calendar' },
      { id: 'call', label: 'Call now', desktopLabel: '(800) 555-0142', href: 'tel:8005550142', type: 'primary', iconName: 'phone' },
    ],
    cta: { title: 'Speak with our team', description: 'Company-provided closing invitation.', placement: 'about-us-end' },
    appearance: {
      font: 'system-ui', headingFont: 'system-ui', backgroundColor: '#ffffff', textColor: '#17324d',
      darkBackgroundColor: '#091020', gradientEndColor: '#294d6d', textOnDark: '#ffffff',
      accentColor: '#efbf57', buttonRadius: '8px', density: 'comfortable', motion: 'none',
    },
  },
} satisfies Meta<typeof BusinessSiteAbout>

export default meta
type Story = StoryObj<typeof meta>

export const WithoutImage: Story = {}
export const WithExplicitImage: Story = {
  args: { image: { src: '/demo-assets/hero-example-team.svg', alt: 'Illustration for an explicitly supplied company photo', caption: 'A company-provided image and caption.' } },
}
export const Compact: Story = { args: { appearance: { ...meta.args.appearance, density: 'compact' } } }
export const MissingOptionalContent: Story = { args: { sections: [meta.args.sections[0]!], cta: undefined } }
export const WithoutContact: Story = { args: { actions: [], cta: undefined } }
export const Mobile: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 'calc(var(--space-4) * 24)', marginInline: 'auto' }}><Story /></div>],
}
