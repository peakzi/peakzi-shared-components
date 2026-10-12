import { useId } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { safeHref } from '../../utils/safeHref'
import { BlogCard } from './article/BlogCard'
import { BlogListItem } from './list-item/BlogListItem'
import { blogsStyle } from './helpers/appearance'
import type { BusinessSiteBlogsProps } from './helpers/types'

export function BusinessSiteBlogs({
  items,
  title = 'Helpful resources',
  eyebrow = 'Learn more',
  viewAll,
  fallbackImage,
  appearance = {},
  sectionId,
  className,
}: BusinessSiteBlogsProps) {
  const headingId = useId() + '-heading'
  const seen = new Set<string>()
  const blogs = items.filter((item) => {
    if (!item.title.trim() || seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
  if (blogs.length === 0) return null
  const href = viewAll?.label.trim() ? safeHref(viewAll.href) : null
  const newTab = viewAll?.newTab === true && !!href && /^https?:\/\//i.test(href)
  const featured = blogs[0]!
  const remaining = blogs.slice(1)
  const compact = appearance.density === 'compact'

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={['pz-business-blogs', className].filter(Boolean).join(' ')}
      data-density={compact ? 'compact' : 'comfortable'}
      data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'}
      style={blogsStyle(appearance)}
    >
      <div className="pz-business-blogs__inner">
        <div className="pz-business-blogs__header">
          <div>
            {eyebrow.trim() && <p className="pz-business-blogs__eyebrow">{eyebrow}</p>}
            <h2 id={headingId}>{title.trim() || 'Helpful resources'}</h2>
          </div>
          <span className="pz-business-blogs__count">{blogs.length} {blogs.length === 1 ? 'guide' : 'guides'}</span>
        </div>
        {compact ? (
          <ul className="pz-business-blogs__grid" role="list">
            {blogs.map((item) => <li key={item.id}><BlogCard item={item} /></li>)}
          </ul>
        ) : (
          <div className="pz-business-blogs__featured-layout" data-single={remaining.length === 0 ? 'true' : undefined}>
            <BlogCard item={featured} featured fallbackImage={fallbackImage} />
            {remaining.length > 0 && (
              <ol className="pz-business-blogs__list" start={2} role="list">
                {remaining.map((item, index) => <li key={item.id}><BlogListItem item={item} number={index + 2} /></li>)}
              </ol>
            )}
          </div>
        )}
        {href && (
          <div className="pz-business-blogs__footer">
            <a className="pz-business-blogs__view-all" href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}>
              {viewAll?.label}<ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

BusinessSiteBlogs.displayName = 'BusinessSiteBlogs'
