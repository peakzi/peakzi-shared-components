import { safeHref } from '../../utils/safeHref'
import { businessSiteIcon } from '../../utils/businessSiteIcon'
import { BusinessSiteHeroCarousel } from './carousel/BusinessSiteHeroCarousel'
import { heroStyle } from './helpers/appearance'
import type {
  BusinessSiteHeroAction,
  BusinessSiteHeroImage,
  BusinessSiteHeroProps,
} from './helpers/types'

export type {
  BusinessSiteHeroAction,
  BusinessSiteHeroAppearance,
  BusinessSiteHeroImage,
  BusinessSiteHeroProps,
  BusinessSiteHeroRating,
} from './helpers/types'

function headlineSize(headline: string, requested: BusinessSiteHeroProps['headlineSize']) {
  if (requested && requested !== 'auto' && ['xl', 'lg', 'md', 'sm'].includes(requested)) return requested
  if (headline.length <= 36) return 'xl'
  if (headline.length <= 70) return 'lg'
  if (headline.length <= 110) return 'md'
  return 'sm'
}

function validImages(images: BusinessSiteHeroProps['images']): BusinessSiteHeroImage[] {
  return (images ?? []).flatMap((image) => {
    const src = safeHref(image?.src, true)
    if (!src || !image.alt?.trim() || !Number.isFinite(image.width) || image.width <= 0 ||
      !Number.isFinite(image.height) || image.height <= 0) return []
    return [{ ...image, src, alt: image.alt.trim() }]
  })
}

function actionLink(action: BusinessSiteHeroAction) {
  const href = safeHref(action.href)
  if (!href || !action.label?.trim()) return null
  const newTab = action.newTab === true && /^https?:\/\//i.test(href)
  const icon = businessSiteIcon(action.iconName)
  return (
    <a
      key={action.id}
      className={`pz-business-hero__action pz-business-hero__action--${action.type === 'primary' ? 'primary' : 'secondary'}`}
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      data-action-id={action.id}
    >
      {icon && action.iconPosition !== 'after' && <span aria-hidden="true">{icon}</span>}
      <span>{action.label}</span>
      {icon && action.iconPosition === 'after' && <span aria-hidden="true">{icon}</span>}
    </a>
  )
}

export function BusinessSiteHero({
  headline,
  eyebrow,
  answer,
  rating,
  actions = [],
  images,
  layout,
  contentOrder = 'text-first',
  background = 'surface',
  align = 'left',
  headlineSize: requestedSize = 'auto',
  aside,
  intervalMs = 5000,
  overlay,
  appearance = {},
  className,
}: BusinessSiteHeroProps) {
  const title = headline?.trim()
  if (!title) throw new Error('BusinessSiteHero requires a non-empty headline')

  const photos = validImages(images)
  const requestedLayout = layout ?? (photos.length > 0 ? 'split' : 'flat')
  const resolvedLayout = requestedLayout === 'background' && photos.length === 0 ? 'flat'
    : requestedLayout === 'split' && photos.length === 0 && !aside ? 'flat'
      : requestedLayout
  const showMedia = resolvedLayout === 'background' || (resolvedLayout === 'split' && !aside)
  const showAside = Boolean(aside) && (resolvedLayout === 'split' || resolvedLayout === 'background')
  const imageFirst = resolvedLayout === 'split' && contentOrder === 'image-first'
  const autoplay = intervalMs === 0 ? 0 : Number.isFinite(intervalMs) ? Math.max(2000, intervalMs) : 5000
  const validActions = actions.filter((action) => safeHref(action?.href) && action.label?.trim())
  const ratingLabel = rating?.label?.trim()
  const ratingIcon = ratingLabel ? businessSiteIcon(rating?.iconName) : null

  const media = showMedia && photos.length > 0 && (
    <div className="pz-business-hero__media">
      {photos.length > 1 ? (
        <BusinessSiteHeroCarousel images={photos} intervalMs={autoplay} />
      ) : (
        <img
          src={photos[0]!.src}
          alt={photos[0]!.alt}
          width={photos[0]!.width}
          height={photos[0]!.height}
          loading="eager"
          fetchPriority="high"
        />
      )}
    </div>
  )
  const splitVisual = resolvedLayout === 'split'
    ? aside ? <div className="pz-business-hero__aside">{aside}</div> : media
    : null

  return (
    <section
      className={['pz-business-hero', className].filter(Boolean).join(' ')}
      data-layout={resolvedLayout}
      data-content-order={imageFirst ? 'image-first' : 'text-first'}
      data-surface={background}
      data-align={align === 'center' && !showAside ? 'center' : 'left'}
      data-size={headlineSize(title, requestedSize)}
      data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'}
      data-has-aside={showAside || (resolvedLayout === 'split' && Boolean(aside))}
      style={heroStyle(appearance, resolvedLayout, background, overlay)}
    >
      {resolvedLayout === 'background' && media}
      <div className="pz-business-hero__inner">
        {imageFirst && splitVisual}
        <div className="pz-business-hero__copy">
          {eyebrow?.trim() && <span className="pz-business-hero__eyebrow">{eyebrow.trim()}</span>}
          <h1 className="pz-business-hero__headline">{title}</h1>
          {answer?.trim() && <p className="pz-business-hero__answer">{answer.trim()}</p>}
          {ratingLabel && (
            <div className="pz-business-hero__rating">
              {ratingIcon && rating?.iconPosition !== 'after' && <span className="pz-business-hero__rating-icon" aria-hidden="true">{ratingIcon}</span>}
              <span>{ratingLabel}</span>
              {ratingIcon && rating?.iconPosition === 'after' && <span className="pz-business-hero__rating-icon" aria-hidden="true">{ratingIcon}</span>}
            </div>
          )}
          {validActions.length > 0 && (
            <div className="pz-business-hero__actions">{validActions.map(actionLink)}</div>
          )}
        </div>
        {!imageFirst && splitVisual}
        {resolvedLayout === 'background' && showAside && <div className="pz-business-hero__aside">{aside}</div>}
      </div>
    </section>
  )
}

BusinessSiteHero.displayName = 'BusinessSiteHero'
