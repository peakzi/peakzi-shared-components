import type { ReactNode } from 'react'
import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export interface BusinessSiteFaqItem {
  id: string
  question: string
  /** Plain text or server-rendered rich content supplied by the consuming app. */
  answer: ReactNode
}

export interface BusinessSiteFaqAction {
  id: string
  label: string
  href: string
  iconName?: string
  iconPosition?: 'before' | 'after'
  newTab?: boolean
}

export interface BusinessSiteFaqContact {
  title: string
  description?: string
  actions?: readonly BusinessSiteFaqAction[]
}

export interface BusinessSiteFaqAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  /** Shared website gradient used by the contact card and disclosure controls. */
  gradientStartColor?: string
  gradientEndColor?: string
  /** Legacy override, used only when no gradient palette is supplied. */
  textColor?: string
  /** Legacy override, used only when no gradient palette is supplied. */
  accentColor?: string
  /** Legacy contact color, superseded by gradientStartColor. */
  contactBackgroundColor?: string
  /** Legacy contact color, superseded by gradientEndColor. */
  contactGradientEndColor?: string
  /** Legacy override, used only when no gradient palette is supplied. */
  contactTextColor?: string
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  density?: 'comfortable' | 'compact'
  motion?: BusinessSiteMotion
}

export interface BusinessSiteFaqProps {
  items: readonly BusinessSiteFaqItem[]
  title?: string
  eyebrow?: string
  intro?: string
  contact?: BusinessSiteFaqContact
  /** Opens the first answer initially; native controls remain usable without JavaScript. */
  defaultOpenFirst?: boolean
  /** Focus and reveal a question after the visitor opens it; respects reduced motion and the sticky header. */
  revealOnOpen?: boolean
  /** Stack places the topic heading above the answers, suitable for directory pages. */
  layout?: 'split' | 'stack'
  appearance?: BusinessSiteFaqAppearance
  sectionId?: string
  className?: string
}
