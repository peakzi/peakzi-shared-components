import type { IconDefinition } from '../types'
import { bbbIcon } from './bbb'
import { angiIcon } from './angi'
import { geminiIcon, geminiColorIcon } from './gemini'
import { nextdoorIcon } from './nextdoor'
import { googleBusinessIcon } from './googleBusiness'

// Keep each custom SVG in its own file. The renderer does not need to change.
export const customIcons = {
  bbb: bbbIcon,
  angi: angiIcon,
  gemini: geminiIcon,
  'gemini-color': geminiColorIcon,
  nextdoor: nextdoorIcon,
  'google-business': googleBusinessIcon,
} as const satisfies Record<string, IconDefinition>
