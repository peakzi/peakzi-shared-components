import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export interface BusinessSiteValueShowcaseItem {
  id: string
  /** Service or metric name, e.g. "Water heater". Rendered as h3. */
  name: string
  /** Display rank exactly as graded, e.g. "Top 3" or "#1". */
  rank: string
  /**
   * Free-text label from the payload, shown as given (e.g. "Elite", "Verified #1", or any new label).
   * Omit for no badge. Rendered as sent on any rank.
   */
  badge?: string
  /** One sentence of evidence. Never invented by the component. */
  proof: string
}

/** Kinds with a dedicated icon. Not a closed list: any other string is accepted and gets the "check" icon. */
export type BusinessSiteValueShowcaseKnownTrustSignalKind =
  | 'financing'
  | 'guarantee'
  | 'warranty'
  | 'license'
  | 'certification'
  | 'availability'
  | 'estimate'
  | 'offer'
  | 'booking'
  | 'other'

/** Open string: known kinds keep editor autocomplete, new kinds are still valid. */
export type BusinessSiteValueShowcaseTrustSignalKind = BusinessSiteValueShowcaseKnownTrustSignalKind | (string & {})

export interface BusinessSiteValueShowcaseTrustSignal {
  label: string
  /** Decides the icon. Booking is better sent as `action`; a booking chip still renders. */
  kind?: BusinessSiteValueShowcaseTrustSignalKind
  /** Optional Lucide icon override. Prefer `kind`; use this only for a deliberate exception. */
  iconName?: string
}

export interface BusinessSiteValueShowcaseSummary {
  /** 0–5. Missing or invalid values hide the rating, never default to 5. */
  rating?: number | null
  reviewCount?: number | null
  /** Optional standing line, e.g. "#1 of 377 Dallas-Fort Worth home service pros for review volume". */
  position?: string
  /** Noun after the count. Defaults to "homeowner reviews". */
  label?: string
}

export interface BusinessSiteValueShowcasePraise {
  count: number
  text: string
}

export interface BusinessSiteValueShowcaseAction {
  label: string
  href: string
  iconName?: string
  newTab?: boolean
}

export interface BusinessSiteValueShowcaseAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  gradientStartColor?: string
  gradientEndColor?: string
  /** Primary action color, same role as the Hero accent. */
  accentColor?: string
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  density?: 'comfortable' | 'compact'
  motion?: BusinessSiteMotion
  /** Band surface. Same options as the Hero. */
  background?: 'surface' | 'tint' | 'soft' | 'gradient' | 'ink'
}

export interface BusinessSiteValueShowcaseProps {
  title: string
  lead?: string
  eyebrow?: string
  methodHref?: string
  methodLabel?: string
  gradeChip?: string
  trustSignals?: readonly BusinessSiteValueShowcaseTrustSignal[]
  summary?: BusinessSiteValueShowcaseSummary
  /** At most two are shown. */
  praise?: readonly BusinessSiteValueShowcasePraise[]
  /** @deprecated Use `actions`. Still read as a single-item fallback when `actions` is omitted. */
  action?: BusinessSiteValueShowcaseAction
  /** First is styled as primary, the rest as secondary. At most two are shown. */
  actions?: readonly BusinessSiteValueShowcaseAction[]
  items: readonly BusinessSiteValueShowcaseItem[]
  note?: string
  /** Tiles shown before the mobile expander. Default 3. */
  mobileVisibleItems?: number
  appearance?: BusinessSiteValueShowcaseAppearance
  sectionId?: string
  className?: string
}
