import { chatgpt } from './chatgpt'
import { GEMINI_PATH } from './gemini-path'
import { GeminiColor } from './GeminiColor'
import { AngiColor, AngiMonochrome, AngiOutline, BbbOutline } from './PlatformArtwork'
import { BBB_FILLED_PATH } from './platform-paths'
import { pathArtwork, type IconDefinition } from './types'
import { INSTAGRAM_PATH, NEXTDOOR_PATH, TIKTOK_PATH, X_PATH, YELP_SYMBOL_VIEWBOX, YELP_SYMBOL_PATH } from './social-paths'
import {
  FacebookColor, FacebookMonochrome, GoogleBusinessOutline, InstagramColor,
  LinkedInColor, LinkedInDark, LinkedInMonochrome, XColor, XDark,
  YouTubeColor, YouTubeMonochrome,
  yelpSymbolColor, yelpSymbolDark,
} from './SocialArtwork'

export type { IconDefinition } from './types'

/** Local supplied artwork only. Missing treatments fall back to an available form/variant. */
export const iconDefinitions = {
  chatgpt: { filled: { monochrome: { viewBox: chatgpt.viewBox, Content: pathArtwork(chatgpt.path) } } },
  gemini: { filled: {
    monochrome: { viewBox: '0 0 24 24', Content: pathArtwork(GEMINI_PATH, 'currentColor', 'evenodd') },
    color: { viewBox: '0 0 24 24', Content: GeminiColor },
  } },
  facebook: { filled: {
    monochrome: { viewBox: '100 100 500 500', Content: FacebookMonochrome },
    color: { viewBox: '100 100 500 500', Content: FacebookColor },
  } },
  instagram: { filled: {
    monochrome: { viewBox: '0 0 1000 1000', Content: pathArtwork(INSTAGRAM_PATH) },
    color: { viewBox: '0 0 2499.85 2499.85', Content: InstagramColor },
  } },
  youtube: { filled: {
    monochrome: { viewBox: '0 0 396.532 277.776', Content: YouTubeMonochrome },
    color: { viewBox: '0 0 396.532 277.776', Content: YouTubeColor },
  } },
  x: { filled: {
    monochrome: { viewBox: '0 0 1200 1227', Content: pathArtwork(X_PATH) },
    color: { viewBox: '0 0 1200 1227', Content: XColor },
    dark: { viewBox: '0 0 1200 1227', Content: XDark },
  } },
  tiktok: {
    filled: { monochrome: { viewBox: '0 0 32 32', Content: pathArtwork(TIKTOK_PATH) } },
  },
  linkedin: { filled: {
    monochrome: { viewBox: '0 0 840 779', Content: LinkedInMonochrome },
    color: { viewBox: '0 0 635 540', Content: LinkedInColor },
    dark: { viewBox: '0 0 840 779', Content: LinkedInDark },
  } },
  nextdoor: { filled: { monochrome: { viewBox: '0 0 32 32', Content: pathArtwork(NEXTDOOR_PATH) } } },
  yelp: {
    filled: {
      monochrome: { viewBox: YELP_SYMBOL_VIEWBOX, Content: pathArtwork(YELP_SYMBOL_PATH) },
      color: { viewBox: YELP_SYMBOL_VIEWBOX, Content: yelpSymbolColor },
      dark: { viewBox: YELP_SYMBOL_VIEWBOX, Content: yelpSymbolDark },
    },
  },
  'google-business': { outline: { monochrome: { viewBox: '0 0 48 48', Content: GoogleBusinessOutline } } },
  angi: {
    filled: {
      monochrome: { viewBox: '0 0 150 150', Content: AngiMonochrome },
      color: { viewBox: '0 0 150 150', Content: AngiColor },
    },
    outline: { monochrome: { viewBox: '0 0 48 48', Content: AngiOutline } },
  },
  bbb: {
    // Trim empty canvas space while retaining each source mark's original proportions.
    filled: { monochrome: { viewBox: '0 9.939 56.48 36.603', Content: pathArtwork(BBB_FILLED_PATH) } },
    outline: { monochrome: { viewBox: '0 76.942 511.999 358.115', Content: BbbOutline } },
  },
} as const satisfies Record<string, IconDefinition>
