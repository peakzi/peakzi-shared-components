import type { ReactNode } from 'react'

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
  textColor?: string
  accentColor?: string
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  density?: 'comfortable' | 'compact'
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
  layout?: 'flat' | 'split' | 'background'
  /** Order of the text and image (or aside slot) in a split layout, on desktop and mobile. */
  contentOrder?: 'text-first' | 'image-first'
  background?: 'surface' | 'tint' | 'soft' | 'gradient' | 'ink'
  align?: 'left' | 'center'
  headlineSize?: 'auto' | 'xl' | 'lg' | 'md' | 'sm'
  /** Content such as an estimate form. In a split layout it replaces the image column. */
  aside?: ReactNode
  /** Carousel autoplay in milliseconds. Set to 0 to disable. */
  intervalMs?: number
  /** Darkness of a photo-background overlay; clamped to 0.55–0.85. */
  overlay?: number
  appearance?: BusinessSiteHeroAppearance
  className?: string
}
