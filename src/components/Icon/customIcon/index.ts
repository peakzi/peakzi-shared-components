import type { IconDefinition } from '../types'
import { bbbIcon } from './bbb'
import { angiIcon } from './angi'

// Keep each custom SVG in its own file. The renderer does not need to change.
export const customIcons = {
  bbb: bbbIcon,
  angi: angiIcon,
} as const satisfies Record<string, IconDefinition>
