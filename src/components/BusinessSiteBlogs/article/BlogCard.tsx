import { ArrowUpRight } from 'lucide-react'
import { safeHref } from '../../../utils/safeHref'
import { BlogMetadata } from '../metadata/BlogMetadata'
import { BlogCover } from '../cover/BlogCover'
import type { BusinessSiteBlog, BusinessSiteBlogImage } from '../helpers/types'

export function BlogCard({ item, featured = false, fallbackImage }: { item: BusinessSiteBlog; featured?: boolean; fallbackImage?: BusinessSiteBlogImage | undefined }) {
  const href = safeHref(item.href)
  const newTab = item.newTab === true && !!href && /^https?:\/\//i.test(href)
  const content = (
    <>
      {featured && <BlogCover item={item} fallbackImage={fallbackImage} />}
      <div className="pz-business-blogs__content">
        <BlogMetadata item={item} />
        <h3>{item.title}</h3>
        {item.excerpt && <div className="pz-business-blogs__excerpt">{item.excerpt}</div>}
        {href && <span className="pz-business-blogs__read">Read the guide<ArrowUpRight size={18} aria-hidden="true" /></span>}
      </div>
    </>
  )

  return (
    <article className="pz-business-blogs__article">
      {href ? (
        <a className="pz-business-blogs__card" href={href} aria-label={item.title + (newTab ? ' (opens in a new tab)' : '')} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}>
          {content}
        </a>
      ) : <div className="pz-business-blogs__card">{content}</div>}
    </article>
  )
}
