import { pathArtwork, type IconArtworkProps } from './types'
import { FACEBOOK_PATHS, INSTAGRAM_CLIP, X_PATH, YELP_SYMBOL_PATH } from './social-paths'
import { YOUTUBE_PATH, YOUTUBE_PLAY_PATH, LINKEDIN_PATH, LINKEDIN_COLOR_PATH, LINKEDIN_WHITE_PATH } from './media-paths'
import instagramGradient from './assets/instagram-gradient.jpg'

// Artwork coordinates and brand fills below come from the supplied source files.
export function FacebookMonochrome() {
  return <path {...FACEBOOK_PATHS[0]} fill="currentColor" />
}
export function FacebookColor() {
  return <><path {...FACEBOOK_PATHS[0]} fill="#0866FF" /><path {...FACEBOOK_PATHS[1]} fill="#FFFFFF" /></>
}
export function GoogleBusinessOutline() {
  return <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="14.25 19.557 24 19.557 24 7.094 15.858 7.094 14.25 19.557" />
    <path d="M15.8582,7.0938H9.1424A2,2,0,0,0,7.2006,8.6145L4.5,19.5573h9.75" />
    <path d="M24,19.5573a4.875,4.875,0,0,1-9.75,0" />
    <path d="M14.25,19.5573a4.875,4.875,0,0,1-9.75,0" />
    <polygon points="33.75 19.557 24 19.557 24 7.094 32.142 7.094 33.75 19.557" />
    <path d="M32.1418,7.0938h6.7158a2,2,0,0,1,1.9418,1.5207L43.5,19.5573H33.75" />
    <path d="M24,19.5573a4.875,4.875,0,0,0,9.75,0" />
    <path d="M33.75,19.5573a4.875,4.875,0,0,0,9.75,0" />
    <path d="M7.3252,23.9768V38.9062a2,2,0,0,0,2,2h29.35a2,2,0,0,0,2-2V23.978" />
    <path d="M33.4991,33.5687h3.9566a3.9771,3.9771,0,0,1-3.88,4.0721l-.0768.0012a4.0733,4.0733,0,1,1,0-8.1466,4.011,4.011,0,0,1,2.02.5357" />
  </g>
}
export function InstagramColor({ id }: IconArtworkProps) {
  // Clip before applying the supplied transform to the optimized gradient image.
  return <><defs><clipPath id={id + '-clip'}><path d={INSTAGRAM_CLIP} /></clipPath></defs>
    <g clipPath={'url(#' + id + '-clip)'}><image width="2500" height="2500" href={instagramGradient} transform="translate(-703.26 -703.26) scale(1.56)" /></g>
  </>
}
export function XColor() { return <path d={X_PATH} fill="#000000" /> }
export function XDark() { return <path d={X_PATH} fill="#FFFFFF" /> }

export function YouTubeMonochrome() {
  return <path d={YOUTUBE_PATH} transform="matrix(1 0 0 -1 158.728 198.411)" fill="currentColor" fillRule="evenodd" />
}
export function YouTubeColor() {
  return <g transform="matrix(1 0 0 -1 158.728 198.411)">
    <path d={YOUTUBE_PATH} fill="#FF0033" fillRule="evenodd" />
    <path d={YOUTUBE_PLAY_PATH} fill="#FFFFFF" />
  </g>
}
export function LinkedInMonochrome() { return <path d={LINKEDIN_PATH} fill="currentColor" fillRule="evenodd" /> }
export function LinkedInColor() { return <path d={LINKEDIN_COLOR_PATH} fill="#2867B2" fillRule="evenodd" /> }
export function LinkedInDark() { return <path d={LINKEDIN_WHITE_PATH} fill="#FFFFFF" fillRule="evenodd" /> }

export const yelpSymbolColor = pathArtwork(YELP_SYMBOL_PATH, '#FF1A1A')
export const yelpSymbolDark = pathArtwork(YELP_SYMBOL_PATH, '#FFFFFF')
