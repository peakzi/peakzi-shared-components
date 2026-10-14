import { safeHref } from '../../../utils/safeHref'
import { validReviewRating } from '../../../utils/reviewRating'
import { trustSignalIcon } from './trust-icon'
import type {
  BusinessSiteValueShowcaseItem,
  BusinessSiteValueShowcaseProps,
} from './types'

const clean = (value: unknown): string => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '')
const count = (value: unknown): number | null =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : null

export const isTopRank = (rank: string) => /^#\s?1$|^no\.?\s?1$/i.test(rank.trim())

export function validItems(items: readonly BusinessSiteValueShowcaseItem[] | undefined) {
  const ids = new Set<string>()
  return (items ?? []).flatMap((item) => {
    const name = clean(item?.name)
    const rank = clean(item?.rank)
    const proof = clean(item?.proof)
    if (!name || !rank || !proof || ids.has(item.id)) return []
    ids.add(item.id)
    const badge = clean(item.badge)
    // Badges are free text from the payload and render as sent, on any rank.
    return [{ id: item.id, name, rank, proof, badge }]
  })
}

export function validShowcase(props: BusinessSiteValueShowcaseProps) {
  const data = parseShowcase(props)
  return { ...data, hasProof: data.rating !== null || data.reviewCount !== null || data.praise.length > 0 || data.action !== null }
}

function parseShowcase(props: BusinessSiteValueShowcaseProps) {
  const rating = validReviewRating(props.summary?.rating) ? props.summary!.rating! : null
  const reviewCount = count(props.summary?.reviewCount)
  const actionHref = props.action && clean(props.action.label) ? safeHref(props.action.href) : null
  return {
    title: clean(props.title),
    lead: clean(props.lead),
    eyebrow: clean(props.eyebrow ?? 'Independently graded by peakzi'),
    methodHref: props.methodHref ? safeHref(props.methodHref) : null,
    methodLabel: clean(props.methodLabel ?? 'How we measure'),
    gradeChip: clean(props.gradeChip),
    // Every chip renders as sent and always gets an icon.
    trustSignals: (props.trustSignals ?? []).flatMap((signal) => {
      const label = clean(signal?.label)
      if (!label) return []
      return [{ label, iconName: clean(signal.iconName) || trustSignalIcon(signal.kind) }]
    }),
    rating,
    reviewCount,
    reviewLabel: clean(props.summary?.label) || 'homeowner reviews',
    position: clean(props.summary?.position),
    praise: (props.praise ?? []).flatMap((entry) => {
      const value = count(entry?.count)
      const text = clean(entry?.text)
      return value !== null && text ? [{ count: value, text }] : []
    }).slice(0, 2),
    action: actionHref
      ? { label: clean(props.action!.label), href: actionHref, iconName: props.action!.iconName, newTab: props.action!.newTab === true && /^https?:\/\//i.test(actionHref) }
      : null,
    items: validItems(props.items),
    note: clean(props.note),
    mobileVisibleItems: Math.max(1, Math.floor(props.mobileVisibleItems ?? 3)),
  }
}

export type ValidShowcase = ReturnType<typeof validShowcase>
