import { safeHref } from '../../../utils/safeHref'
import { BlogMetadata } from '../metadata/BlogMetadata'
import type { BusinessSiteBlog } from '../helpers/types'

export function BlogListItem({ item, number }: { item: BusinessSiteBlog; number: number }) {
  const href = safeHref(item.href)
  const newTab = item.newTab === true && !!href && /^https?:\/\//i.test(href)
  const content = (
    <>
      <span className="pz-business-blogs__number" aria-hidden="true">{String(number).padStart(2, '0')}</span>
      <div className="pz-business-blogs__list-content">
        <h3>{item.title}</h3>
        <BlogMetadata item={item} />
      </div>
    </>
  )

  return (
    <article className="pz-business-blogs__article">
      {href ? (
        <a className="pz-business-blogs__list-link" href={href} aria-label={item.title + (newTab ? ' (opens in a new tab)' : '')} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}>
          {content}
        </a>
      ) : <div className="pz-business-blogs__list-link">{content}</div>}
    </article>
  )
}
