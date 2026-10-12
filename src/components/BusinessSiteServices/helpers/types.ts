import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export interface BusinessSiteServiceTier {
  label: string
  value: string
}

export interface BusinessSiteServiceImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface BusinessSiteServiceItem {
  id: string
  title: string
  href?: string
  summary?: string
  iconName?: string
  image?: BusinessSiteServiceImage
  tiers?: readonly BusinessSiteServiceTier[]
  actionLabel?: string
}

export interface BusinessSiteServiceGroup {
  id: string
  trade: string
  /** Complete trade heading supplied by the website API. */
  title?: string
  iconName?: string
  services: readonly BusinessSiteServiceItem[]
  totalCount?: number
}

export interface BusinessSiteServicesAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  gradientStartColor?: string
  gradientEndColor?: string
  /** Legacy override, used only when no gradient palette is supplied. */
  textColor?: string
  /** Legacy override, used only when no gradient palette is supplied. */
  accentColor?: string
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  density?: 'comfortable' | 'compact'
  motion?: BusinessSiteMotion
}

export interface BusinessSiteServicesLink {
  label: string
  href: string
}

export interface BusinessSiteServicesProps {
  groups: readonly BusinessSiteServiceGroup[]
  title?: string
  eyebrow?: string
  intro?: string
  /** Omit a redundant trade heading when a titled section has only one trade. */
  hideSingleGroupHeading?: boolean
  viewAll?: BusinessSiteServicesLink
  appearance?: BusinessSiteServicesAppearance
  sectionId?: string
  className?: string
}
