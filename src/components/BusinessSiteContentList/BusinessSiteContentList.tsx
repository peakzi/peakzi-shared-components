import { ArrowRight } from 'lucide-react'
import { safeHref } from '../../utils/safeHref'
import { contentListStyle } from './helpers/appearance'
import { publicationDate } from './helpers/publication-date'
import type {
  BusinessSiteContentListImage,
  BusinessSiteContentListItem,
  BusinessSiteContentListProps,
} from './helpers/types'

export type {
  BusinessSiteContentListAppearance,
  BusinessSiteContentListImage,
  BusinessSiteContentListItem,
  BusinessSiteContentListLink,
  BusinessSiteContentListProps,
} from './helpers/types'

function ContentListMedia({ item, fallbackImage }: { item: BusinessSiteContentListItem; fallbackImage?: BusinessSiteContentListImage | undefined }) {
  const cover = safeHref(item.image?.src, true)
  const logo = safeHref(fallbackImage?.src, true)
  const src = cover ?? logo
  if (!src) return null

  return (
    <div className="pz-business-content-list__media" data-image-kind={cover ? 'cover' : 'logo'}>
      <img
        src={src}
        alt={(cover ? item.image?.alt : fallbackImage?.alt)?.trim() || item.title}
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

function ContentListMeta({ item }: { item: BusinessSiteContentListItem }) {
  const category = item.category?.trim()
  const readingTime = item.readingTime?.trim()
  const date = publicationDate(item.publishedOn)
  if (!category && !readingTime && !date) return null

  return (
    <div className="pz-business-content-list__meta">
      {category && <span className="pz-business-content-list__category">{category}</span>}
      {readingTime && <span className="pz-business-content-list__reading-time">{readingTime}</span>}
      {date && <time className="pz-business-content-list__date" dateTime={date.dateTime}>{date.label}</time>}
    </div>
  )
}

function ContentListCard({ item, showImages, fallbackImage }: {
  item: BusinessSiteContentListItem
  showImages: boolean
  fallbackImage?: BusinessSiteContentListImage | undefined
}) {
  const href = safeHref(item.href)
  const newTab = item.newTab === true && !!href && /^https?:\/\//i.test(href)
  const actionLabel = item.actionLabel?.trim() || 'Read more'
  const hasExcerpt = item.excerpt !== undefined && item.excerpt !== null && item.excerpt !== ''

  const content = (
    <>
      {showImages && <ContentListMedia item={item} fallbackImage={fallbackImage} />}
      <div className="pz-business-content-list__content">
        <ContentListMeta item={item} />
        <h3 className="pz-business-content-list__card-title">{item.title.trim()}</h3>
        {hasExcerpt && <div className="pz-business-content-list__excerpt">{item.excerpt}</div>}
        <span className="pz-business-content-list__action">
          {actionLabel}
          <ArrowRight aria-hidden="true" size={16} />
        </span>
      </div>
    </>
  )

  return href
    ? (
      <a
        className="pz-business-content-list__card"
        href={href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    )
    : <article className="pz-business-content-list__card">{content}</article>
}

export function BusinessSiteContentList({
  items,
  title = 'Latest resources',
  eyebrow = 'Resources',
  intro,
  layout = 'grid',
  isLoading = false,
  emptyMessage,
  loadingCount = 3,
  viewAll,
  showImages = true,
  fallbackImage,
  appearance = {},
  sectionId,
  className,
}: BusinessSiteContentListProps) {
  const visibleItems = (items ?? []).filter((item) => item?.title?.trim())
  const trimmedEmptyMessage = emptyMessage?.trim()
  if (!isLoading && visibleItems.length === 0 && !trimmedEmptyMessage) return null

  const headingId = `${sectionId ?? 'pz-business-content-list'}-heading`
  const sectionTitle = title.trim() || 'Latest resources'
  const viewAllHref = safeHref(viewAll?.href)
  const newTab = viewAll?.newTab === true && !!viewAllHref && /^https?:\/\//i.test(viewAllHref)

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={['pz-business-content-list', className].filter(Boolean).join(' ')}
      data-layout={layout === 'stack' ? 'stack' : 'grid'}
      data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'}
      style={contentListStyle(appearance)}
    >
      <div className="pz-business-content-list__inner">
        <div className="pz-business-content-list__intro">
          {eyebrow.trim() && <span className="pz-business-content-list__eyebrow">{eyebrow.trim()}</span>}
          <h2 id={headingId} className="pz-business-content-list__title">{sectionTitle}</h2>
          {intro?.trim() && <p className="pz-business-content-list__lede">{intro.trim()}</p>}
        </div>
        {isLoading ? (
          <div className="pz-business-content-list__grid" aria-hidden="true">
            {Array.from({ length: Math.max(1, loadingCount) }).map((_, index) => (
              <div className="pz-business-content-list__skeleton" key={index} />
            ))}
          </div>
        ) : visibleItems.length === 0 ? (
          <p className="pz-business-content-list__empty">{trimmedEmptyMessage}</p>
        ) : (
          <div className="pz-business-content-list__grid">
            {visibleItems.map((item) => (
              <ContentListCard key={item.id} item={item} showImages={showImages} fallbackImage={fallbackImage} />
            ))}
          </div>
        )}
        {!isLoading && viewAllHref && viewAll?.label.trim() && (
          <a
            className="pz-business-content-list__view-all"
            href={viewAllHref}
            target={newTab ? '_blank' : undefined}
            rel={newTab ? 'noopener noreferrer' : undefined}
          >
            {viewAll.label.trim()}
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        )}
      </div>
    </section>
  )
}

BusinessSiteContentList.displayName = 'BusinessSiteContentList'
