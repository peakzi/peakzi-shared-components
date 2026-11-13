import { fontAwesomeIcons } from './fontAwesome'
import { customIcons } from './customIcon'
import type { IconDefinition } from './types'

export type IconName = keyof typeof fontAwesomeIcons | keyof typeof customIcons

export const iconNames: readonly IconName[] = [
  ...new Set([...Object.keys(fontAwesomeIcons), ...Object.keys(customIcons)] as IconName[]),
]

/** Prefer a registered Font Awesome definition; use local custom artwork otherwise. */
export function getIconDefinition(name: string): IconDefinition | undefined {
  if (Object.prototype.hasOwnProperty.call(fontAwesomeIcons, name)) {
    const { icon: [width, height, , , path] } = fontAwesomeIcons[name as keyof typeof fontAwesomeIcons]
    return {
      viewBox: `0 0 ${width} ${height}`,
      paths: typeof path === 'string' ? [path] : path,
    }
  }
  return Object.prototype.hasOwnProperty.call(customIcons, name)
    ? customIcons[name as keyof typeof customIcons]
    : undefined
}
