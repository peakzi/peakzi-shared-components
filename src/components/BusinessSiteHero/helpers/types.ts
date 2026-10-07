import type { ReactNode } from 'react'
import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export interface BusinessSiteHeroImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface BusinessSiteHeroAction {
  id: string
  label: string
  href: string
  type: 'primary' | 'secondary'
  iconName?: string
  iconPosition?: 'before' | 'after'
  newTab?: boolean
}

export interface BusinessSiteHeroRating {
  label: string
  iconName?: string
  iconPosition?: 'before' | 'after'
}

export interface BusinessSiteHeroAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  /** Optional gradient end color, independent of CTA accent color. */
  gradientEndColor?: string
  textColor?: string
  accentColor?: string
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  density?: 'comfortable' | 'compact'
  motion?: BusinessSiteMotion
}

export interface BusinessSiteHeroProps {
  /** Use once per page: this component renders the page's h1. */
  headline: string
  eyebrow?: string
  answer?: string
  rating?: BusinessSiteHeroRating
  actions?: readonly BusinessSiteHeroAction[]
  /** One image is static; multiple images render a carousel. */
  images?: readonly BusinessSiteHeroImage[]
  /** Cover fills the frame; contain keeps the entire image visible. */
  imageFit?: 'cover' | 'contain'
  /** In split or background + contain mode, blur a second copy behind the full image. */
  imageBackdrop?: 'solid' | 'blur'
  /** Horizontal image placement within its frame. Defaults to center. */
  imagePosition?: 'left' | 'center' | 'right'
  layout?: 'flat' | 'split' | 'background'
  /** Desktop split order. Mobile shows the headline and actions before the media, with the answer below. */
  contentOrder?: 'text-first' | 'image-first'
  background?: 'surface' | 'tint' | 'soft' | 'gradient' | 'ink'
  align?: 'left' | 'center'
  headlineSize?: 'auto' | 'xl' | 'lg' | 'md' | 'sm'
  /** Content such as an estimate form. In a split layout it replaces the image column. */
  aside?: ReactNode
  /** Carousel autoplay in milliseconds. Requires subtle motion; 0 disables it. */
  intervalMs?: number
  /** Darkness of a photo-background overlay; clamped to 0.55–0.85. */
  overlay?: number
  appearance?: BusinessSiteHeroAppearance
  className?: string
}
