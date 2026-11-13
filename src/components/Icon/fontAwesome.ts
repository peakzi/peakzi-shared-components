import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF'
import { faXTwitter } from '@fortawesome/free-brands-svg-icons/faXTwitter'
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn'
import { faTiktok } from '@fortawesome/free-brands-svg-icons/faTiktok'
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube'
import { faYelp } from '@fortawesome/free-brands-svg-icons/faYelp'
import { faOpenai } from '@fortawesome/free-brands-svg-icons/faOpenai'

// Register only the definitions needed by the application, from any Font Awesome pack.
// Adding another icon here extends IconName and the Storybook catalogue automatically.
export const fontAwesomeIcons = {
  facebook: faFacebookF,
  twitter: faXTwitter,
  instagram: faInstagram,
  linkedin: faLinkedinIn,
  tiktok: faTiktok,
  youtube: faYoutube,
  yelp: faYelp,
  chatgpt: faOpenai,
} as const
