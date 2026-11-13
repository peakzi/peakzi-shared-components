# Icon artwork

The Icon component renders local SVG artwork. It makes no icon, script,
font, or image requests. These assets identify profile links; they are not accreditation
or endorsement badges.

## Font Awesome

Facebook, X, Instagram, LinkedIn, TikTok, YouTube, Yelp and OpenAI (registered as
`chatgpt`) definitions come from @fortawesome/free-brands-svg-icons 7.3.1.
Only those eight per-icon modules are imported.

- Source: https://github.com/FortAwesome/Font-Awesome
- Icons: Font Awesome Free, copyright Fonticons, Inc., CC BY 4.0.
- Licence: https://fontawesome.com/license/free
- Package: https://www.npmjs.com/package/@fortawesome/free-brands-svg-icons

## BBB

- Brand owner: Better Business Bureau.
- Artwork: https://m.bbb.org/brand/logos/BBB_SecondaryLogo_Black_RGB.svg
- The compact B mark is extracted from the official monochrome logo; the original
  path geometry and proportions are retained, and the adjacent wordmark is omitted
  for legibility at icon sizes. This is the corporate mark, not an Accredited
  Business seal.

## Angi

- Brand owner: Angi.
- Artwork source: https://logotyp.us/file/angi.svg
- Brand reference: https://www.angi.com/
- The original paths are retained; the embedding scale/translation and outer
  whitespace are removed. Both original colour layers render in the consumer's
  monochrome colour.

Brand names and marks remain the property of their respective owners.

## Additional custom artwork

- Gemini: supplied `gemini.svg` and `gemini-color.svg`. `gemini` follows the
  consumer's `color`; `gemini-color` preserves the supplied gradient palette.
- Nextdoor: supplied `nextdoor-svgrepo-com.svg`, retaining its original path.
- Google Business: supplied `google-my-business-svgrepo-com.svg`, retaining its
  outline geometry and using the consumer's `color` for strokes.

These are registry definitions under `Icon/customIcon/`, using the same renderer
and props as BBB and Angi. No raster images, data URIs or additional renderers are
needed. The old `variant`, `appearance` and `surface` API is not retained.
