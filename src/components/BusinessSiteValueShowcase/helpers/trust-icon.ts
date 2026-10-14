import type { BusinessSiteValueShowcaseKnownTrustSignalKind } from './types'

/** One icon per trust-signal kind. Every chip gets an icon; anything unknown uses "check". */
const KIND_ICONS: Record<BusinessSiteValueShowcaseKnownTrustSignalKind, string> = {
  financing: 'dollar-sign',
  guarantee: 'shield-check',
  warranty: 'shield-check',
  license: 'badge-check',
  certification: 'award',
  availability: 'clock',
  estimate: 'clipboard-check',
  offer: 'tag',
  booking: 'calendar',
  other: 'check',
}

export function trustSignalIcon(kind: unknown): string {
  return typeof kind === 'string' && Object.prototype.hasOwnProperty.call(KIND_ICONS, kind)
    ? KIND_ICONS[kind as BusinessSiteValueShowcaseKnownTrustSignalKind]
    : KIND_ICONS.other
}
