import { type ReactNode, type HTMLAttributes } from 'react'
import { Breadcrumbs, type BreadcrumbItem } from '../Breadcrumbs'

// =============================================================================
// PageHeader
// =============================================================================

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Breadcrumb trail rendered above the title (e.g. Home → Customers → Accounts). */
  breadcrumbs?: BreadcrumbItem[]
  /** Page title — rendered as `<h1>`. Required. */
  title: ReactNode
  /** Optional supporting copy below the title. */
  lede?: ReactNode
  /** Right-aligned action group (typically Buttons). */
  actions?: ReactNode
  /** Heading level for SEO/structure. Defaults to `h1`. */
  as?: 'h1' | 'h2' | 'h3'
  /** Removes the bottom border, bottom margin, and vertical padding. */
  borderless?: boolean
}

/**
 * **PageHeader** — top-of-page block: breadcrumbs → title → lede + actions.
 *
 * Use once per page, immediately inside `.pz-app__main-inner`.
 *
 * @example
 * <PageHeader
 *   breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Accounts' }]}
 *   title="Accounts"
 *   lede="Search, edit, and manage customer accounts."
 *   actions={<Button variant="primary">New account</Button>}
 * />
 */
export function PageHeader({
  breadcrumbs,
  title,
  lede,
  actions,
  as: Tag = 'h1',
  borderless,
  className,
  ...rest
}: PageHeaderProps) {
  const cls = ['pz-page-header', borderless && 'pz-page-header--borderless', className].filter(Boolean).join(' ')

  return (
    <header className={cls} {...rest}>
      <div className="pz-page-header__text">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs className="pz-page-header__breadcrumbs" items={breadcrumbs} />
        )}
        <Tag className="pz-page-header__title">{title}</Tag>
        {lede && <p className="pz-page-header__lede">{lede}</p>}
      </div>
      {actions && <div className="pz-page-header__actions">{actions}</div>}
    </header>
  )
}
PageHeader.displayName = 'PageHeader'
