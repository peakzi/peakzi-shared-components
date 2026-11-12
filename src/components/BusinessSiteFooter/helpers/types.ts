import type { IconName } from '../../Icon'
import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export interface BusinessSiteFooterLogo {
  src: string
  alt: string
  homeHref: string
  width: number
  height: number
}

export interface BusinessSiteFooterPhone {
  display: string
  href: string
}

export interface BusinessSiteFooterLink {
  id: string
  label: string
  href: string
  newTab?: boolean
}

export interface BusinessSiteFooterSocialLink extends Pick<BusinessSiteFooterLink, 'id' | 'label' | 'href'> {
  iconName: IconName
}

export interface BusinessSiteFooterColumn {
  id: string
  heading: string
  links: readonly BusinessSiteFooterLink[]
}

export interface BusinessSiteFooterAppearance {
  font?: string
  backgroundColor?: string
  textColor?: string
  accentColor?: string
  density?: 'comfortable' | 'compact'
  motion?: BusinessSiteMotion
  /** Size passed to the shared Icon renderer. Defaults to 20. */
  socialIconSize?: number | string
}

export interface BusinessSiteFooterProps {
  businessName: string
  logo?: BusinessSiteFooterLogo
  addressLines?: readonly string[]
  phone?: BusinessSiteFooterPhone
  socialLinks?: readonly BusinessSiteFooterSocialLink[] | undefined
  columns?: readonly BusinessSiteFooterColumn[]
  bottomLinks?: readonly BusinessSiteFooterLink[]
  attribution?: BusinessSiteFooterLink
  copyrightYear?: number
  appearance?: BusinessSiteFooterAppearance
  navigationLabel?: string
  className?: string
}
