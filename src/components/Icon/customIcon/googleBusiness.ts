import { createElement } from 'react'
import type { IconDefinition } from '../types'

// Artwork supplied in google-my-business-svgrepo-com.svg.
function GoogleBusinessArtwork() {
  return createElement('g', { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' },
    createElement('polygon', { points: '14.25 19.557 24 19.557 24 7.094 15.858 7.094 14.25 19.557' }),
    createElement('path', { d: 'M15.8582,7.0938H9.1424A2,2,0,0,0,7.2006,8.6145L4.5,19.5573h9.75' }),
    createElement('path', { d: 'M24,19.5573a4.875,4.875,0,0,1-9.75,0' }),
    createElement('path', { d: 'M14.25,19.5573a4.875,4.875,0,0,1-9.75,0' }),
    createElement('polygon', { points: '33.75 19.557 24 19.557 24 7.094 32.142 7.094 33.75 19.557' }),
    createElement('path', { d: 'M32.1418,7.0938h6.7158a2,2,0,0,1,1.9418,1.5207L43.5,19.5573H33.75' }),
    createElement('path', { d: 'M24,19.5573a4.875,4.875,0,0,0,9.75,0' }),
    createElement('path', { d: 'M33.75,19.5573a4.875,4.875,0,0,0,9.75,0' }),
    createElement('path', { d: 'M7.3252,23.9768V38.9062a2,2,0,0,0,2,2h29.35a2,2,0,0,0,2-2V23.978' }),
    createElement('path', { d: 'M33.4991,33.5687h3.9566a3.9771,3.9771,0,0,1-3.88,4.0721l-.0768.0012a4.0733,4.0733,0,1,1,0-8.1466,4.011,4.011,0,0,1,2.02.5357' }),
  )
}

export const googleBusinessIcon: IconDefinition = { viewBox: '0 0 48 48', Render: GoogleBusinessArtwork }
