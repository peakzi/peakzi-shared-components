import type { ComponentType } from 'react'

export interface IconArtworkProps { id: string }
export interface IconArtwork {
  viewBox: string
  Content: ComponentType<IconArtworkProps>
}
export interface IconVariants {
  monochrome: IconArtwork
  color?: IconArtwork
  /** Supplied original artwork intended for a dark surface. */
  dark?: IconArtwork
}
export interface IconDefinition {
  filled?: IconVariants
  outline?: IconVariants
}

/** Construct static path artwork once, when the registry loads. */
export function pathArtwork(d: string, fill = 'currentColor', fillRule?: 'nonzero' | 'evenodd') {
  return function PathArtwork() { return <path d={d} fill={fill} fillRule={fillRule} /> }
}
