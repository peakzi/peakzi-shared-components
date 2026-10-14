import type { BusinessSiteMotion } from '../../../utils/siteAppearance'

export interface BusinessSiteContentFilterNavTrade {
  key: string
  label: string
  services: readonly string[]
}

export interface BusinessSiteContentFilterNavAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  /** Website gradient palette; text, accents, and the mobile "Change" button are derived from these colors. */
  gradientStartColor?: string
  gradientEndColor?: string
  /** Legacy override, used only when no gradient palette is supplied. */
  textColor?: string
  /** Legacy override, used only when no gradient palette is supplied. */
  accentColor?: string
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  motion?: BusinessSiteMotion
}

export interface BusinessSiteContentFilterNavProps {
  /** Trade groups in display order, each with its own service list. */
  trades: readonly BusinessSiteContentFilterNavTrade[]
  /** Key of the currently active trade. Falls back to the first trade if it doesn't match. */
  activeTrade: string
  /** Active service name. There is no "all services in this trade" option — the API only ever resolves a single active service. */
  activeService?: string | null
  /** Builds the href for a trade (its first service) or a specific service within it. A trade tab links to that trade's first service, since there is no "view all" page. */
  buildHref: (trade: string, service?: string | null) => string
  /** Accessible name for the nav landmark. Default: "Filter by topic". */
  ariaLabel?: string
  /** Heading shown inside the mobile filter sheet. Default: "Browse topics". */
  mobileDialogTitle?: string
  appearance?: BusinessSiteContentFilterNavAppearance
  sectionId?: string
  className?: string
}
