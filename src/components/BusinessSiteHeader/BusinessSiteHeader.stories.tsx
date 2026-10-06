/// <reference types="vite/client" />
import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSiteHeader } from './BusinessSiteHeader'
import type {
  BusinessSiteHeaderAction,
  BusinessSiteHeaderAppearance,
  BusinessSiteHeaderLink,
  BusinessSiteHeaderLogo,
} from './BusinessSiteHeader'
import peakziLogo from '../../../assets/peakzi-logo-color.png'
import peakziLogoWhite from '../../../assets/peakzi-logo-white.png'
import { readableText, safeColor } from '../../utils/siteAppearance'

type Appearance = Required<Pick<BusinessSiteHeaderAppearance,
  'font' | 'backgroundColor' | 'textColor' | 'accentColor' |
  'itemsPosition' | 'buttonRadius' | 'density' | 'layoutWidth'
>>

interface StoryArgs extends Appearance {
  logo: BusinessSiteHeaderLogo
  menu: BusinessSiteHeaderLink[]
  actions: BusinessSiteHeaderAction[]
  currentPath: string
}

const meta = {
  title: 'Components/Business Site/Header',
  component: BusinessSiteHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Tenant-configurable public-site header. Use Controls to test its branding options. Consumers map validated API data to these props and load their chosen font; links are server-rendered as anchors. Colors are applied as selected; use the Accessibility panel to check contrast.',
      },
    },
  },
  render: ({
    logo,
    menu,
    actions,
    currentPath,
    font,
    backgroundColor,
    textColor,
    accentColor,
    layoutWidth,
    itemsPosition,
    buttonRadius,
    density,
  }: StoryArgs) => (
    <BusinessSiteHeader
      logo={logo.src === peakziLogo && readableText('#ffffff', safeColor(backgroundColor, '#ffffff')) === '#ffffff'
        ? { ...logo, src: peakziLogoWhite }
        : logo}
      menu={menu}
      actions={actions}
      currentPath={currentPath}
      appearance={{ font, backgroundColor, textColor, accentColor, layoutWidth, itemsPosition, buttonRadius, density }}
    />
  ),
  argTypes: {
    font: { control: 'text', description: 'Font family name; the consuming app must load the font.' },
    backgroundColor: { control: 'color' },
    textColor: { control: 'color', description: 'Applied exactly. Check contrast against the background in the Accessibility panel.' },
    accentColor: { control: 'color', description: 'Used for the active link and primary action. Check contrast against the background.' },
    layoutWidth: { control: 'inline-radio', options: ['contained', 'full'] },
    itemsPosition: { control: 'inline-radio', options: ['left', 'center', 'right'] },
    buttonRadius: { control: 'inline-radio', options: ['2px', '8px', '16px', '32px'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    currentPath: {
      control: 'select',
      options: ['/', '/services', '/services/electrical', '/about', '/blogs'],
    },
    logo: { control: 'object', description: 'The demo logo switches to its light variant on dark backgrounds. Custom logos stay unchanged. Width and height define its bounding box; square logos align to the left of that box.' },
    menu: { control: 'object' },
    actions: { control: 'object', description: 'Use any Lucide icon name, such as phone, Wrench, or calendar-days.' },
  },
  args: {
    logo: { src: peakziLogo, alt: 'Peakzi', homeHref: '/', width: 168, height: 44 },
    menu: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'services', label: 'Services', href: '/services', children: [
        { id: 'electrical', label: 'Electrical repairs', href: '/services/electrical' },
        { id: 'rewiring', label: 'Whole-home rewiring', href: '/services/rewiring' },
      ] },
      { id: 'about', label: 'About', href: '/about' },
      { id: 'blogs', label: 'Blog', href: '/blogs' },
    ],
    actions: [
      { id: 'call', label: '(512) 555-0188', href: 'tel:+15125550188', type: 'secondary', iconName: 'phone' },
      { id: 'book', label: 'Book online', href: '/book', type: 'primary', iconName: 'arrow-up-right', iconPosition: 'after' },
    ],
    currentPath: '/',
    font: 'IBM Plex Sans',
    backgroundColor: '#ffffff',
    textColor: '#12171c',
    accentColor: '#1d4f8c',
    layoutWidth: 'contained',
    itemsPosition: 'center',
    buttonRadius: '8px',
    density: 'comfortable',
  },
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Mobile: Story = {
  globals: { viewport: 'mobile2' },
}

export const WarmCompact: Story = {
  args: {
    font: 'system-ui',
    backgroundColor: '#fff6e8',
    textColor: '#342113',
    accentColor: '#a04018',
    itemsPosition: 'left',
    buttonRadius: '16px',
    density: 'compact',
  },
}

export const DarkCentered: Story = {
  args: {
    font: 'Georgia',
    backgroundColor: '#111827',
    textColor: '#f9fafb',
    accentColor: '#a5c9ee',
    itemsPosition: 'center',
    buttonRadius: '32px',
    density: 'comfortable',
  },
}
