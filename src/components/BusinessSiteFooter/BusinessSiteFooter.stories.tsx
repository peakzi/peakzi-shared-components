/// <reference types="vite/client" />
import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteFooter } from './BusinessSiteFooter'
import type { BusinessSiteFooterAppearance, BusinessSiteFooterProps } from './BusinessSiteFooter'
import peakziLogoWhite from '../../../assets/peakzi-logo-white.png'
import peakziLogoColor from '../../../assets/peakzi-logo-color.png'
import { readableText, safeColor } from '../../utils/siteAppearance'

type StoryArgs = Omit<BusinessSiteFooterProps, 'appearance'> & Required<BusinessSiteFooterAppearance>

const meta = {
  title: 'Components/Business Site/Footer',
  component: BusinessSiteFooter,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Tenant-configurable public-site footer. Consumers pass trusted business contact details and real links from their API; all content and links render in the initial HTML. The consumer loads its selected font. Colors are applied as selected; use the Accessibility panel to check contrast.',
      },
    },
  },
  render: ({ font, backgroundColor, textColor, accentColor, density, ...props }: StoryArgs) => {
    const demoLogo = props.logo?.src === peakziLogoWhite || props.logo?.src === peakziLogoColor
    const lightLogo = readableText('#ffffff', safeColor(backgroundColor, '#12171c')) === '#ffffff'
    const logo = demoLogo && props.logo
      ? { ...props.logo, src: lightLogo ? peakziLogoWhite : peakziLogoColor }
      : props.logo

    return (
      <BusinessSiteFooter
        {...props}
        logo={logo}
        appearance={{ font, backgroundColor, textColor, accentColor, density }}
      />
    )
  },
  argTypes: {
    font: { control: 'text', description: 'Font family name; the consuming app must load the font.' },
    backgroundColor: { control: 'color' },
    textColor: { control: 'color', description: 'Applied exactly. Check contrast against the background in the Accessibility panel.' },
    accentColor: { control: 'color', description: 'Used for the phone link and link hover. Check contrast against the background.' },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    logo: { control: 'object', description: 'The demo logo switches variants with the background. Custom logos stay unchanged.' },
    addressLines: { control: 'object' },
    phone: { control: 'object' },
    columns: { control: 'object' },
    bottomLinks: { control: 'object' },
    attribution: { control: 'object' },
  },
  args: {
    businessName: 'Peakzi Demo Services',
    logo: { src: peakziLogoWhite, alt: 'Peakzi', homeHref: '/', width: 168, height: 44 },
    addressLines: ['123 Example Street', 'Austin, TX 78701'],
    phone: { display: '(512) 555-0188', href: 'tel:+15125550188' },
    columns: [
      { id: 'services', heading: 'Services', links: [
        { id: 'electrical', label: 'Electrical repairs', href: '/services/electrical' },
        { id: 'rewiring', label: 'Whole-home rewiring', href: '/services/rewiring' },
        { id: 'generators', label: 'Generators', href: '/services/generators' },
      ] },
      { id: 'company', heading: 'Company', links: [
        { id: 'about', label: 'About us', href: '/about' },
        { id: 'areas', label: 'Service areas', href: '/service-areas' },
        { id: 'reviews', label: 'Reviews', href: '/reviews' },
      ] },
    ],
    bottomLinks: [
      { id: 'privacy', label: 'Privacy policy', href: '/privacy' },
      { id: 'terms', label: 'Terms of use', href: '/terms' },
    ],
    attribution: { id: 'peakzi', label: 'Website powered by Peakzi', href: 'https://www.peakzi.me', newTab: true },
    copyrightYear: 2026,
    font: 'IBM Plex Sans',
    backgroundColor: '#12171c',
    textColor: '#f7f9fb',
    accentColor: '#a5c9ee',
    density: 'comfortable',
  },
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Mobile: Story = {
  globals: { viewport: 'mobile2' },
}

export const Light: Story = {
  args: {
    logo: { src: peakziLogoColor, alt: 'Peakzi', homeHref: '/', width: 168, height: 44 },
    backgroundColor: '#fff6e8',
    textColor: '#342113',
    accentColor: '#a04018',
  },
}

export const Compact: Story = {
  args: { density: 'compact' },
}
