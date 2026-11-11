import type { ComponentType } from 'react'
import { chatgpt } from './chatgpt'
import { GEMINI_PATH } from './gemini-path'
import { GeminiColor } from './GeminiColor'

export interface IconDefinition {
  viewBox: string
  path: string
  fillRule?: 'nonzero' | 'evenodd'
  Color?: ComponentType<{ id: string }>
}

/** Add future brand or general-purpose artwork here without changing the public component. */
export const iconDefinitions = {
  chatgpt,
  gemini: { viewBox: '0 0 24 24', path: GEMINI_PATH, fillRule: 'evenodd', Color: GeminiColor },
} as const satisfies Record<string, IconDefinition>
