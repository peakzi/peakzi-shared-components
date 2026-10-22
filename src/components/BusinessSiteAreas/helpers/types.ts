import type { ReactNode } from 'react'
import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export interface BusinessSiteArea {
  id: string
  label: string
  /** Omit until an individual city page is available. */
  href?: string
  favorite?: boolean
  /** Coordinates from the consuming site; the component never geocodes city names. */
  position?: { lat: number; lon: number }
}

export interface BusinessSiteAreasAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  gradientEndColor?: string
  gradientAngle?: number
  textColor?: string
  accentColor?: string
  /** Directory heading palette; the search and city list keep the main palette. */
  headingBackgroundColor?: string
  headingGradientEndColor?: string
  headingTextColor?: string
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  density?: 'comfortable' | 'compact'
  motion?: BusinessSiteMotion
}

export interface BusinessSiteAreasProps {
  areas: readonly BusinessSiteArea[]
  title?: string
  eyebrow?: string
  /** Label next to the count. Defaults to "cities" ("city" for one). */
  countLabel?: string
  /** Full coverage count when the consuming page displays only a city preview. */
  totalCount?: number
  /** Optional crawlable link beneath the city list. */
  viewAll?: { label: string; href: string }
  /** Interactive map island. The city list remains server-renderable without it. */
  map?: ReactNode
  appearance?: BusinessSiteAreasAppearance
  sectionId?: string
  className?: string
  /** Directory uses a side-by-side map and panel instead of the homepage overlay. */
  variant?: 'section' | 'directory'
  headingLevel?: 'h1' | 'h2'
  controls?: ReactNode
}

export interface BusinessSiteAreasMapProps {
  areas: readonly BusinessSiteArea[]
  markerStyle?: 'dot' | 'pin'
  /** Preferred maximum starting zoom; reduced as needed to keep all pins visible. */
  defaultZoom?: number
  /** Group nearby markers when the service-area section uses its mobile layout. */
  clusterOnMobile?: boolean
}
