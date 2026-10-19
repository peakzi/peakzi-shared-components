/** One graded service or metric. Every string renders exactly as sent; the component never rounds or rewrites. */
export interface BusinessSiteValueShowcaseItem {
  /** Stable key. Optional: a positional key is used when missing. */
  id?: string
  /** Service or metric name. Rendered as the item heading (h3 by default). */
  name: string
  /** Standing line, e.g. "Out of 200+ businesses" or "In top 6%". */
  standing?: string
  /** Supporting line, e.g. "Backed by 1,700+ DFW reviews". */
  proof?: string
  /** Short grade label shown as a badge, e.g. "Leader", "Great". Free text, any value. */
  label?: string
  /** Lucide icon name for the medallion. No icon, no medallion. */
  iconName?: string
}

/** One award, guarantee or reputation point shown as a pill. */
export interface BusinessSiteValueShowcaseHighlight {
  title: string
  /** Optional second line, e.g. "Gold every year since 2022". */
  detail?: string
  /** Lucide icon name. Omit for a text-only pill. */
  iconName?: string
}

/** Optional circular seal beside the heading. */
export interface BusinessSiteValueShowcaseSeal {
  text: string
  /** Lucide icon name. Omit for a text-only seal. */
  iconName?: string
  /** Decorative five-star row, shown only when true. It is not a rating and is hidden from screen readers. */
  stars?: boolean
}

export interface BusinessSiteValueShowcaseAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  gradientStartColor?: string
  gradientEndColor?: string
  /** Standing and label colour. Stepped to a readable colour automatically. */
  accentColor?: string
  /** Card radius. Same option set as the other Business Site sections. */
  buttonRadius?: '2px' | '8px' | '16px' | '32px'
  density?: 'comfortable' | 'compact'
  /** 1px line under the section. Default true. */
  divider?: boolean
}

export interface BusinessSiteValueShowcaseProps {
  title: string
  lead?: string
  seal?: BusinessSiteValueShowcaseSeal
  highlights?: readonly BusinessSiteValueShowcaseHighlight[]
  /** Accessible name for the highlights list. Omitted when not sent. */
  highlightsLabel?: string
  items?: readonly BusinessSiteValueShowcaseItem[]
  /** Accessible name for the cards list. Omitted when not sent. */
  itemsLabel?: string
  note?: string
  /** Cards shown before the "Show more" button in narrow containers (640px and below). Default 3. Every card stays in the page. */
  mobileVisibleItems?: number
  /** Button text while cards are collapsed. `{count}` is the number of hidden cards, `{total}` the card count. Default "Show {count} more". */
  showMoreLabel?: string
  /** Button text while all cards are shown. Default "Show fewer". */
  showLessLabel?: string
  /** Section heading level. Items render one level below. Default 2. */
  headingLevel?: 2 | 3
  appearance?: BusinessSiteValueShowcaseAppearance
  sectionId?: string
  className?: string
}
