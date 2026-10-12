import type { ReactNode } from 'react'
import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export interface BusinessSiteArea {
  id: string
  label: string
  href: string
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
  /** Interactive map island. The city list remains server-renderable without it. */
  map?: ReactNode
  appearance?: BusinessSiteAreasAppearance
  sectionId?: string
  className?: string
}

export interface BusinessSiteAreasMapProps {
  areas: readonly BusinessSiteArea[]
}
