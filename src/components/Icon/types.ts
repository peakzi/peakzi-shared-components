import type { ComponentType } from 'react'

export interface IconRenderProps {
  /** Instance-scoped prefix for SVG gradient, mask and clip-path IDs. */
  id: string
}

interface IconBaseDefinition {
  viewBox: string
  fillRule?: 'nonzero' | 'evenodd'
}

/** Custom artwork can supply paths or an SVG-content component for more complex shapes. */
export type IconDefinition = IconBaseDefinition & (
  | { paths: readonly string[]; Render?: never }
  | { Render: ComponentType<IconRenderProps>; paths?: never }
)
