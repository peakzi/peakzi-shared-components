import { lazy, Suspense } from 'react'
import { ArrowUpRight, CalendarDays, Calculator, Phone, Star } from 'lucide-react'
import type { IconName } from 'lucide-react/dynamic'

const STATIC_ICONS = {
  phone: Phone,
  calendar: CalendarDays,
  calculator: Calculator,
  'arrow-up-right': ArrowUpRight,
  star: Star,
} as const

function IconPlaceholder() {
  return <span aria-hidden="true" style={{ display: 'inline-block', flex: 'none', width: 17, height: 17 }} />
}

const LazyLucideIcon = lazy(async () => {
  const { DynamicIcon, iconNames } = await import('lucide-react/dynamic')
  const names = new Set<string>(iconNames)
  return {
    default: function NamedIcon({ name }: { name: string }) {
      return names.has(name)
        ? <DynamicIcon name={name as IconName} aria-hidden="true" size={17} strokeWidth={1.75} fallback={IconPlaceholder} />
        : null
    },
  }
})

export function businessSiteIcon(name: string | undefined) {
  if (typeof name !== 'string') return null
  const iconName = name.trim()
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
  const Icon = Object.prototype.hasOwnProperty.call(STATIC_ICONS, iconName)
    ? STATIC_ICONS[iconName as keyof typeof STATIC_ICONS]
    : null
  if (Icon) return <Icon aria-hidden="true" size={17} strokeWidth={1.75} />
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(iconName)) return null
  return <Suspense fallback={<IconPlaceholder />}><LazyLucideIcon name={iconName} /></Suspense>
}
