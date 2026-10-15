import type { ReactNode } from 'react'
import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export interface BusinessSiteBlogImage {
  src: string
  alt: string
}

export interface BusinessSiteBlog {
  id: string
  title: string
  href: string
  category?: string
  /** Backend-supplied display label, e.g. "9 min read". Omit when unavailable. */
  readingTime?: string
  /** ISO calendar date, YYYY-MM-DD. Omit when the backend has no publication date. */
  publishedOn?: string
  /** Display-only label such as Draft when publication metadata is unavailable. */
  statusLabel?: string
  /** Plain text or non-interactive markup; do not include links or a full article. */
  excerpt?: ReactNode
  /** Optional article cover; the company logo is used when no safe cover is supplied. */
  coverImage?: BusinessSiteBlogImage
  newTab?: boolean
}

export interface BusinessSiteBlogsAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  /** Website gradient palette; text and highlights are derived from these colors. */
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

export interface BusinessSiteBlogsProps {
  items: readonly BusinessSiteBlog[]
  /** Featured preserves the homepage layout; grid gives every article an equal image card. */
  layout?: 'featured' | 'grid'
  title?: string
  eyebrow?: string
  viewAll?: { label: string; href: string; newTab?: boolean }
  fallbackImage?: BusinessSiteBlogImage | undefined
  appearance?: BusinessSiteBlogsAppearance
  sectionId?: string
  className?: string
}
