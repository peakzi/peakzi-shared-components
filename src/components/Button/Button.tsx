import { type ReactNode, type MouseEventHandler } from 'react'
import { Loader2 } from 'lucide-react'

// =============================================================================
// Types
// =============================================================================

export type ButtonVariant =
  | 'primary'
  | 'gradient'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'text'
  | 'danger'
  | 'success'
  | 'icon'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps {
  /**
   * Visual style of the button.
   * - `primary`  — Default solid CTA. Use **one per view**.
   * - `gradient` — Brand pink→purple→blue gradient. Reserve for hero CTAs only.
   * - `secondary`— Outlined, lower-hierarchy action.
   * - `ghost`    — Transparent, for tertiary actions.
   * - `link`     — Looks like a hyperlink. No background or border.
   * - `text`     — Muted label + icon, no border, no padding. For low-hierarchy controls (footer toggles, inline actions).
   * - `danger`   — Destructive actions (delete, remove).
   * - `success`  — Positive confirmation action.
   * - `icon`     — Square icon-only button. **Requires `aria-label`.**
   */
  variant?: ButtonVariant

  /** Size of the button. Defaults to `'md'`. */
  size?: ButtonSize

  /**
   * Renders the button as an `<a>` element — crawlable by search engines.
   * Use instead of `onClick` for all navigation actions.
   */
  href?: string

  /** Target for anchor (`href`) rendering. e.g. `"_blank"` */
  target?: '_blank' | '_self' | '_parent' | '_top'

  /** `rel` attribute when rendered as `<a>`. Auto-sets `"noopener noreferrer"` for `target="_blank"`. */
  rel?: string

  /** Disables the button and prevents interaction. */
  disabled?: boolean

  /**
   * Shows a spinner and prevents interaction while true.
   * Does not remove the label — keeps layout stable (no CLS).
   */
  loading?: boolean

  /** Stretches the button to full container width. */
  block?: boolean

  /**
   * Accessible label for icon-only buttons (`variant="icon"`).
   * **Required** when there is no visible text child.
   */
  'aria-label'?: string

  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  children?: ReactNode
  /** Append extra class names (e.g. for one-off spacing overrides). */
  className?: string
  /** HTML `type` attribute — only applies when rendered as `<button>`. */
  type?: 'button' | 'submit' | 'reset'
}

// =============================================================================
// Component
// =============================================================================

/**
 * **Button** — the primary interactive element of the Peakzi design system.
 *
 * ### SEO note
 * Pass `href` to render a semantic `<a>` tag that search engine crawlers can
 * follow. Never use `onClick` for navigation — it creates a dead end for bots.
 *
 * ### Accessibility
 * - Always has an accessible name (visible text **or** `aria-label`).
 * - Renders `type="button"` by default to prevent accidental form submission.
 * - Communicates loading state via `aria-busy` and disables interaction.
 *
 * @example
 * // Navigation link — renders <a href="/pricing">
 * <Button href="/pricing">View pricing</Button>
 *
 * @example
 * // Gradient hero CTA
 * <Button variant="gradient" size="lg">Start free trial</Button>
 *
 * @example
 * // Icon-only (must have aria-label)
 * <Button variant="icon" aria-label="Close dialog"><X size={16} /></Button>
 */
export function Button({
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  disabled = false,
  loading = false,
  block = false,
  children,
  className,
  type = 'button',
  onClick,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  const classNames = [
    'pz-btn',
    `pz-btn--${variant}`,
    size !== 'md' && `pz-btn--${size}`,
    loading && 'pz-btn--loading',
    block && 'pz-btn--block',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // Compute rel: auto-add noopener noreferrer for external links
  const computedRel =
    rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)

  if (href) {
    return (
      <a
        className={classNames}
        href={href}
        target={target}
        rel={computedRel}
        aria-disabled={isDisabled || undefined}
        onClick={isDisabled ? (e) => e.preventDefault() : onClick}
        {...rest}
      >
        {loading && (
          <Loader2
            size={14}
            aria-hidden="true"
            className="pz-btn__spinner"
          />
        )}
        {children}
      </a>
    )
  }

  return (
    <button
      className={classNames}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={onClick}
      {...rest}
    >
      {loading && (
        <Loader2
          size={14}
          aria-hidden="true"
          className="pz-btn__spinner"
        />
      )}
      {children}
    </button>
  )
}

Button.displayName = 'Button'
