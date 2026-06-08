import { type HTMLAttributes } from 'react'

// =============================================================================
// AppFooter
// =============================================================================

export type AppFooterPosition = 'left' | 'center' | 'right' | 'split'
export type AppFooterVersionPlacement = 'inline' | 'block'

export interface AppFooterProps extends HTMLAttributes<HTMLElement> {
  /** Copyright / brand text. The © symbol is prepended automatically. */
  text?: string
  /** Version string — rendered after the text (e.g. "v3.14.0"). */
  version?: string
  /** Horizontal alignment of the content. Defaults to `'center'`. */
  position?: AppFooterPosition
  /** Whether version appears on the same line (`'inline'`) or a new line below (`'block'`). Defaults to `'inline'`. */
  versionPlacement?: AppFooterVersionPlacement
}

/**
 * **AppFooter** — slim app-shell footer strip.
 *
 * Renders: `© {text} {version}` aligned by `position`.
 *
 * @example
 * <AppFooter text="Peakzi Copyright" version="v3.14.0" position="center" />
 * // → © Peakzi Copyright v3.14.0  (centred)
 *
 * @example
 * <AppFooter text="Peakzi Copyright" version="v3.14.0" versionPlacement="block" />
 * // → © Peakzi Copyright
 * //   v3.14.0
 */
export function AppFooter({
  text,
  version,
  position = 'center',
  versionPlacement = 'inline',
  className,
  ...rest
}: AppFooterProps) {
  const cls = [
    'pz-app-footer',
    `pz-app-footer--${position}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const contentCls = [
    'pz-app-footer__content',
    versionPlacement === 'block' && 'pz-app-footer__content--stacked',
  ]
    .filter(Boolean)
    .join(' ')

  if (position === 'split') {
    return (
      <footer className={cls} {...rest}>
        {text && <span>{'© '}{text}</span>}
        {version && <span className="pz-app-footer__version">{version}</span>}
      </footer>
    )
  }

  return (
    <footer className={cls} {...rest}>
      {text && (
        <span className={contentCls}>
          <span>{'© '}{text}</span>
          {version && <span className="pz-app-footer__version">{version}</span>}
        </span>
      )}
    </footer>
  )
}
AppFooter.displayName = 'AppFooter'
