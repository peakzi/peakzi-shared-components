import { publicationDate } from '../helpers/publication-date'
import type { BusinessSiteBlog } from '../helpers/types'

export function BlogMetadata({ item }: { item: BusinessSiteBlog }) {
  const category = item.category?.trim()
  const readingTime = item.readingTime?.trim()
  const date = publicationDate(item.publishedOn)
  if (!category && !readingTime && !date) return null

  return (
    <div className="pz-business-blogs__meta">
      {category && <span className="pz-business-blogs__category">{category}</span>}
      {readingTime && <span className="pz-business-blogs__reading-time">{readingTime}</span>}
      {date && <time dateTime={date.dateTime}>{date.label}</time>}
    </div>
  )
}
