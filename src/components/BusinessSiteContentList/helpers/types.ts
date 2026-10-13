import type { ReactNode } from 'react'
import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export interface BusinessSiteContentListImage {
  src: string
  alt: string
}

export interface BusinessSiteContentListItem {
  id: string
  title: string
  href: string
  /** Plain text or server-rendered rich content (e.g. from the app's own markdown renderer). */
  excerpt?: ReactNode
  category?: string
  /** Backend-supplied display label, e.g. "9 min read". Omit when unavailable. */
  readingTime?: string
  /** ISO calendar date, YYYY-MM-DD. Omit when the backend has no publication date. */
  publishedOn?: string
  /** Optional card image; the section's fallbackImage is used when absent and showImages is true. */
  image?: BusinessSiteContentListImage
  actionLabel?: string
  newTab?: boolean
}

export interface BusinessSiteContentListLink {
  label: string
  href: string
  newTab?: boolean
}

export interface BusinessSiteContentListAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  /** Website gradient palette; text, accents, and the view-all button are derived from these colors. */
  gradientStartColor?: string
  gradientEndColor?: string
  /** Legacy override, used only when no gradient palette is supplied. */
  textColor?: string
  /** Legacy override, used only when no gradient palette is supplied. */
  accentColor?: string
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  motion?: BusinessSiteMotion
}

export interface BusinessSiteContentListProps {
  items: readonly BusinessSiteContentListItem[]
  title?: string
  eyebrow?: string
  intro?: string
  /** Default 'grid' arranges items in a responsive multi-column grid. 'stack' is the compact variant: a single-column row list with a thumbnail on the left, tighter spacing, and a smaller type scale. */
  layout?: 'grid' | 'stack'
  isLoading?: boolean
  /** Shown instead of the grid when there are no items. Omit to render nothing when empty. */
  emptyMessage?: string
  /** Number of skeleton placeholders to render while isLoading. */
  loadingCount?: number
  viewAll?: BusinessSiteContentListLink
  /** Default true; set false to omit images/logo entirely, e.g. FAQ listings have no imagery. */
  showImages?: boolean
  /** Used as each card's image when the item has no image of its own, e.g. the business logo. */
  fallbackImage?: BusinessSiteContentListImage
  appearance?: BusinessSiteContentListAppearance
  sectionId?: string
  className?: string
}
