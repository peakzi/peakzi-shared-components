import type { ReactNode } from 'react'
import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export interface BusinessSiteContentListItem {
  id: string
  title: string
  href: string
  /** Plain text or server-rendered rich content (e.g. from the app's own markdown renderer). */
  excerpt?: ReactNode
  category?: string
  /** Pre-formatted display date — this package does not parse or format dates. */
  date?: string
  actionLabel?: string
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
  textColor?: string
  accentColor?: string
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  density?: 'comfortable' | 'compact'
  motion?: BusinessSiteMotion
}

export interface BusinessSiteContentListProps {
  items: readonly BusinessSiteContentListItem[]
  title?: string
  eyebrow?: string
  intro?: string
  isLoading?: boolean
  /** Shown instead of the grid when there are no items. Omit to render nothing when empty. */
  emptyMessage?: string
  /** Number of skeleton placeholders to render while isLoading. */
  loadingCount?: number
  viewAll?: BusinessSiteContentListLink
  appearance?: BusinessSiteContentListAppearance
  sectionId?: string
  className?: string
}
