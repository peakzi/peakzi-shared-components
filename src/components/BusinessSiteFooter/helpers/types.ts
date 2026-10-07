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
}

export interface BusinessSiteFooterProps {
  businessName: string
  logo?: BusinessSiteFooterLogo
  addressLines?: readonly string[]
  phone?: BusinessSiteFooterPhone
  columns?: readonly BusinessSiteFooterColumn[]
  bottomLinks?: readonly BusinessSiteFooterLink[]
  attribution?: BusinessSiteFooterLink
  copyrightYear?: number
  appearance?: BusinessSiteFooterAppearance
  navigationLabel?: string
  className?: string
}
