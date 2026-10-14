import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export interface BusinessSiteProjectImage {
  src: string
  /** Describe the actual work pictured; supplied by the consuming app. */
  alt: string
  caption?: string
  location?: string
  /** A real project destination or the original full-size photo. */
  href?: string
  newTab?: boolean
  width?: number
  height?: number
  srcSet?: string
  previewSrc?: string
  tags?: readonly string[]
}

export interface BusinessSiteProjectGalleryAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  gradientEndColor?: string
  textColor?: string
  accentColor?: string
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  density?: 'comfortable' | 'compact'
  motion?: BusinessSiteMotion
}

export interface BusinessSiteProjectGalleryProps {
  items: readonly BusinessSiteProjectImage[]
  title?: string
  eyebrow?: string
  viewAll?: { label: string; href: string; newTab?: boolean }
  appearance?: BusinessSiteProjectGalleryAppearance
  sectionId?: string
  className?: string
  layout?: 'grid' | 'mosaic'
  imageFit?: 'cover' | 'contain'
  enablePreview?: boolean
}
