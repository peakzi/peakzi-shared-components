import { createElement, Fragment } from 'react'
import type { IconDefinition, IconRenderProps } from '../types'

// Artwork supplied in gemini.svg and gemini-color.svg.
const GEMINI_PATH = "M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
const gradients = [
  { x1: '7', x2: '11', y1: '15.5', y2: '12', color: '#08B962', offset: '1' },
  { x1: '8', x2: '11.5', y1: '5.5', y2: '11', color: '#F94543', offset: '1' },
  { x1: '3.5', x2: '17.5', y1: '13.5', y2: '12', color: '#FABC12', offset: '.46' },
] as const

/** Preserve the supplied artwork; scope paint-server IDs to each SVG instance. */
function GeminiColor({ id }: IconRenderProps) {
  return createElement(Fragment, null,
    createElement('path', { d: GEMINI_PATH, fill: '#3186FF' }),
    ...gradients.map((_, index) => createElement('path', { key: index, d: GEMINI_PATH, fill: `url(#${id}-gemini-${index})` })),
    createElement('defs', null,
      ...gradients.map(({ color, offset, ...coordinates }, index) => createElement('linearGradient', {
        key: index, gradientUnits: 'userSpaceOnUse', id: `${id}-gemini-${index}`, ...coordinates,
      },
      createElement('stop', { stopColor: color }),
      createElement('stop', { offset, stopColor: color, stopOpacity: '0' }),
      )),
    ),
  )
}

export const geminiIcon: IconDefinition = { viewBox: '0 0 24 24', paths: [GEMINI_PATH], fillRule: 'evenodd' }
export const geminiColorIcon: IconDefinition = { viewBox: '0 0 24 24', Render: GeminiColor }
