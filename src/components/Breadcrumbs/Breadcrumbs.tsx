import React, { type ReactNode, type AnchorHTMLAttributes, type HTMLAttributes, Fragment } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BreadcrumbItem {
  label: string
  href?: string
}

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  /** Separator between items — defaults to "/" */
  separator?: ReactNode
}

export function Breadcrumbs({ items, separator = '/', className, ...rest }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={['pz-breadcrumbs', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <ol style={{ display: 'contents' }}>
        {items.map((item, i) => {
          const isCurrent = i === items.length - 1
          return (
            <Fragment key={`${item.label}-${i}`}>
              {i > 0 && (
                <li className="pz-breadcrumbs__sep" aria-hidden="true" style={{ display: 'contents' }}>
                  <span className="pz-breadcrumbs__sep">{separator}</span>
                </li>
              )}
              <li style={{ display: 'contents' }}>
                {isCurrent || !item.href ? (
                  <span
                    className={[
                      'pz-breadcrumbs__item',
                      isCurrent && 'is-current',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <a className="pz-breadcrumbs__item" href={item.href}>
                    {item.label}
                  </a>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
Breadcrumbs.displayName = 'Breadcrumbs'

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  /** Total number of pages */
  total: number
  /** Currently active page (1-based) */
  page: number
  /** Called with new page number when a page button is clicked */
  onPageChange: (page: number) => void
  /** Base URL for SEO-friendly href generation (e.g. "/blog") */
  baseHref?: string
}

function buildHref(baseHref: string | undefined, page: number) {
  if (!baseHref) return undefined
  return page === 1 ? baseHref : `${baseHref}?page=${page}`
}

export function Pagination({
  total,
  page,
  onPageChange,
  baseHref,
  className,
  ...rest
}: PaginationProps) {
  const pages = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <nav
      aria-label="Pagination"
      className={['pz-pagination', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {/* Previous */}
      <PaginationButton
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        href={buildHref(baseHref, page - 1)}
        aria-label="Previous page"
      >
        ←
      </PaginationButton>

      {/* Page numbers */}
      {pages.map((p) => (
        <PaginationButton
          key={p}
          isActive={p === page}
          onClick={() => onPageChange(p)}
          href={buildHref(baseHref, p)}
          aria-label={`Page ${p}`}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </PaginationButton>
      ))}

      {/* Next */}
      <PaginationButton
        onClick={() => onPageChange(page + 1)}
        disabled={page >= total}
        href={buildHref(baseHref, page + 1)}
        aria-label="Next page"
      >
        →
      </PaginationButton>
    </nav>
  )
}
Pagination.displayName = 'Pagination'

// ---------------------------------------------------------------------------
// Internal PaginationButton — renders <a> with href when baseHref provided
// ---------------------------------------------------------------------------

interface PaginationButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean
  disabled?: boolean
  children?: ReactNode
  onClick?: () => void
}

function PaginationButton({
  isActive,
  disabled,
  href,
  children,
  onClick,
  ...rest
}: PaginationButtonProps) {
  const cls = [
    'pz-pagination__btn',
    isActive && 'is-active',
    disabled && 'is-disabled',
  ]
    .filter(Boolean)
    .join(' ')

  if (href && !disabled) {
    return (
      <a
        className={cls}
        href={href}
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    )
  }

  // Omit anchor-only attrs so we can spread safely onto <button>
  const { rel, target, download, ...buttonRest } = rest
  void rel
  void target
  void download
  return (
    <button
      type="button"
      className={cls}
      disabled={disabled}
      onClick={onClick}
      {...(buttonRest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
