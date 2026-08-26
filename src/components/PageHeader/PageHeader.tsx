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
  /** Heading level for SEO/structure. Defaults to `h1`. Controls the semantic tag only — use `titleSize` to change the visual size. */
  as?: 'h1' | 'h2' | 'h3'
  /**
   * Visual size of `title`. Defaults to `lg` (30px), sized for a short name/label.
   * Use `md` (24px) when `title` holds a full sentence (e.g. a verdict) instead
   * of a short name — `lg` wraps sentence-length text into a tall, oversized block.
   */
  titleSize?: 'lg' | 'md'
  /**
   * Renders `actions` on its own full-width row below `title`/`lede` instead of
   * beside them. Off by default. Turn on when a wide `actions` group would
   * squeeze a long `title` (e.g. sentence-length, see `titleSize`).
   */
  stackedActions?: boolean
  /**
   * Background treatment. Defaults to `none` (transparent, today's behavior — the
   * header just sits on the page background). `subtle` wraps it in a tinted,
   * rounded panel (`--bg-subtle`) so a masthead reads as its own distinct band
   * instead of blending into the page. Self-contained — removes the bottom
   * border on its own, no need to also pass `borderless`.
   */
  background?: 'none' | 'subtle'
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
  titleSize = 'lg',
  stackedActions,
  background = 'none',
  borderless,
  className,
  ...rest
}: PageHeaderProps) {
  const cls = [
    'pz-page-header',
    borderless && 'pz-page-header--borderless',
    stackedActions && 'pz-page-header--stacked-actions',
    background === 'subtle' && 'pz-page-header--bg-subtle',
    className,
  ].filter(Boolean).join(' ')
  const titleCls = ['pz-page-header__title', titleSize === 'md' && 'pz-page-header__title--md'].filter(Boolean).join(' ')

  return (
    <header className={cls} {...rest}>
      <div className="pz-page-header__text">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs className="pz-page-header__breadcrumbs" items={breadcrumbs} />
        )}
        <Tag className={titleCls}>{title}</Tag>
        {lede && <p className="pz-page-header__lede">{lede}</p>}
      </div>
      {actions && <div className="pz-page-header__actions">{actions}</div>}
    </header>
  )
}
PageHeader.displayName = 'PageHeader'
