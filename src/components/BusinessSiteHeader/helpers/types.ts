import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export type BusinessSiteHeaderIconName = string
export type BusinessSiteHeaderFont = string
export type BusinessSiteHeaderButtonRadius = '2px' | '8px' | '16px' | '32px'

export interface BusinessSiteHeaderLogo {
  src: string
  alt: string
  homeHref: string
  width: number
  height: number
}

export interface BusinessSiteHeaderSubmenuLink {
  id: string
  label: string
  href: string
}

export interface BusinessSiteHeaderLink extends BusinessSiteHeaderSubmenuLink {
  children?: readonly BusinessSiteHeaderSubmenuLink[]
}

export interface BusinessSiteHeaderAction {
  id: string
  label: string
  href: string
  type: 'primary' | 'secondary'
  iconName?: BusinessSiteHeaderIconName
  iconPosition?: 'before' | 'after'
  newTab?: boolean
}

export interface BusinessSiteHeaderAppearance {
  /** Keep content in the standard container or use the available viewport width. */
  layoutWidth?: 'contained' | 'full'
  font?: BusinessSiteHeaderFont
  backgroundColor?: string
  textColor?: string
  /** The site brand colour used by primary actions. */
  accentColor?: string
  /** Places the navigation next to the logo, in the centre, or next to the actions. */
  itemsPosition?: 'left' | 'center' | 'right'
  buttonRadius?: BusinessSiteHeaderButtonRadius
  density?: 'comfortable' | 'compact'
  /** Pin the header to the top of the viewport while the page scrolls; off by default. No ancestor may set `overflow`. */
  sticky?: boolean
  /** Site-wide motion preference; disabled by default. */
  motion?: BusinessSiteMotion
}

export interface BusinessSiteHeaderProps {
  logo: BusinessSiteHeaderLogo
  menu: readonly BusinessSiteHeaderLink[]
  actions?: readonly BusinessSiteHeaderAction[]
  appearance?: BusinessSiteHeaderAppearance
  currentPath?: string
  navigationLabel?: string
  className?: string
}
