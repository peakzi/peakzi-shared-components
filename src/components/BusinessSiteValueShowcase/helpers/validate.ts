import { showcaseIcon } from './icons'
import type { BusinessSiteValueShowcaseProps } from './types'

const clean = (value: unknown): string => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '')

/** Shrinks long seal text so it fits the circle. 1 for short text, never below 0.8. */
export function sealScale(text: string): number {
  const length = Math.max(1, [...text].length)
  return Math.round(Math.max(0.8, Math.min(1, Math.sqrt(24 / length))) * 1000) / 1000
}

/** Fills `{total}` and `{count}` in a button label. */
export function fillLabel(template: string, total: number, count: number): string {
  return template.replace(/\{total\}/g, String(total)).replace(/\{count\}/g, String(count))
}

export function validShowcase(props: BusinessSiteValueShowcaseProps) {
  const ids = new Set<string>()
  const items = (props.items ?? []).flatMap((item, index) => {
    const name = clean(item?.name)
    const standing = clean(item?.standing)
    const proof = clean(item?.proof)
    if (!name || (!standing && !proof)) return []
    const id = clean(item.id) || `item-${index}`
    if (ids.has(id)) return []
    ids.add(id)
    return [{ id, name, standing, proof, label: clean(item.label), iconName: showcaseIcon(item.iconName) }]
  })

  const keys = new Set<string>()
  const highlights = (props.highlights ?? []).flatMap((entry) => {
    const title = clean(entry?.title)
    if (!title) return []
    const detail = clean(entry.detail)
    const key = `${title}|${detail}`.toLowerCase()
    if (keys.has(key)) return []
    keys.add(key)
    return [{ key, title, detail, iconName: showcaseIcon(entry.iconName) }]
  })

  const sealText = clean(props.seal?.text)
  return {
    title: clean(props.title),
    lead: clean(props.lead),
    note: clean(props.note),
    seal: sealText
      ? { text: sealText, iconName: showcaseIcon(props.seal!.iconName), stars: props.seal!.stars === true, scale: sealScale(sealText) }
      : null,
    highlights,
    highlightsLabel: clean(props.highlightsLabel),
    items,
    itemsLabel: clean(props.itemsLabel),
    mobileVisibleItems: Number.isFinite(props.mobileVisibleItems) ? Math.max(1, Math.floor(props.mobileVisibleItems!)) : 3,
    showMoreLabel: clean(props.showMoreLabel) || 'Show {count} more',
    showLessLabel: clean(props.showLessLabel) || 'Show fewer',
    level: props.headingLevel === 3 ? 3 : 2,
  }
}

export type ValidShowcase = ReturnType<typeof validShowcase>
