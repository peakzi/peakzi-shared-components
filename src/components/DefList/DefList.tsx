import { Children, isValidElement, type ReactElement, type ReactNode, type HTMLAttributes } from 'react'
import { ExternalLink } from 'lucide-react'

// =============================================================================
// DefList — semantic <dl> key/value list
// =============================================================================

export interface DefListProps extends HTMLAttributes<HTMLDListElement> {
  /** Density. Defaults to `'md'`. */
  size?: 'sm' | 'md'
  /** Inline (term left, value right) or stacked (term above value). */
  layout?: 'inline' | 'stacked'
  /**
   * `'quote'` boxes the whole list in a tinted panel with italic values — for a verbatim
   * quote (e.g. customer evidence), distinct from a plain divided list of analysis text.
   * Unset by default (today's plain divided-row look).
   */
  emphasis?: 'quote'
  children?: ReactNode
}

/**
 * **DefList** — definition list for key/value pairs (account details,
 * metadata panels, settings summaries).
 *
 * @example
 * <DefList>
 *   <DefRow term="Account ID" value="acct_8f2a91" />
 *   <DefRow term="Cohort" value="Beta" />
 *   <DefRow term="Status">
 *     <StatusPill status="active">Active</StatusPill>
 *   </DefRow>
 * </DefList>
 */
export function DefList({
  size = 'md',
  layout = 'inline',
  emphasis,
  children,
  className,
  ...rest
}: DefListProps) {
  const cls = [
    'pz-deflist',
    size !== 'md' && `pz-deflist--${size}`,
    layout !== 'inline' && `pz-deflist--${layout}`,
    emphasis && `pz-deflist--${emphasis}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <dl className={cls} {...rest}>
      {layout === 'stacked' ? groupConsecutiveByTerm(children) : children}
    </dl>
  )
}
DefList.displayName = 'DefList'

// Consecutive DefRows sharing the same string term collapse into one label + a bulleted
// list of their values, instead of repeating the term for every point.
function groupConsecutiveByTerm(children: ReactNode): ReactNode {
  const items = Children.toArray(children)
  const output: ReactNode[] = []
  let i = 0

  while (i < items.length) {
    const item = items[i]
    if (!isValidElement(item) || item.type !== DefRow || typeof (item.props as DefRowProps).term !== 'string') {
      output.push(item)
      i++
      continue
    }

    const term = (item.props as DefRowProps).term
    const group: ReactElement<DefRowProps>[] = [item as ReactElement<DefRowProps>]
    let j = i + 1
    while (
      j < items.length &&
      isValidElement(items[j]) &&
      (items[j] as ReactElement).type === DefRow &&
      (items[j] as ReactElement<DefRowProps>).props.term === term
    ) {
      group.push(items[j] as ReactElement<DefRowProps>)
      j++
    }

    if (group.length > 1) {
      const groupClassName = group.map((row) => row.props.className).filter(Boolean).join(' ')
      output.push(
        <div className={['pz-deflist__row', groupClassName].filter(Boolean).join(' ')} key={`group-${i}`}>
          <dt className="pz-deflist__term">{term}</dt>
          <dd className="pz-deflist__value">
            <ul className="pz-deflist__bullets">
              {group.map((row, idx) => (
                <li className="pz-deflist__bullet" key={idx}>
                  {row.props.children ?? row.props.value}
                  <SourceLink href={row.props.href} />
                </li>
              ))}
            </ul>
          </dd>
        </div>
      )
    } else {
      output.push(item)
    }
    i = j
  }

  return output
}

// =============================================================================
// DefRow
// =============================================================================

export interface DefRowProps {
  term: ReactNode
  /** Use either `value` (string/node shorthand) or `children`. */
  value?: ReactNode
  children?: ReactNode
  /**
   * Link to the row's source (e.g. the original review). Rendered as a small external-link
   * icon after the value. Restricted to `http:`/`https:` — anything else (a malformed string,
   * a `javascript:` URI) is silently dropped rather than rendered as an unsafe href, since this
   * ultimately comes from upstream data, not something hand-authored and trusted by default.
   */
  href?: string
  className?: string
}

// http(s)-only guard — see the `href` doc above for why this isn't rendered unchecked.
function isSafeHref(href?: string): href is string {
  if (!href) return false
  try {
    const { protocol } = new URL(href)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

function SourceLink({ href }: { href: string | undefined }) {
  if (!isSafeHref(href)) return null
  return (
    <a className="pz-deflist__link" href={href} target="_blank" rel="noopener noreferrer" aria-label="View source">
      <ExternalLink size={12} aria-hidden />
    </a>
  )
}

export function DefRow({ term, value, children, href, className }: DefRowProps) {
  const cls = ['pz-deflist__row', className].filter(Boolean).join(' ')
  return (
    <div className={cls}>
      <dt className="pz-deflist__term">{term}</dt>
      <dd className="pz-deflist__value">
        {children ?? value}
        <SourceLink href={href} />
      </dd>
    </div>
  )
}
DefRow.displayName = 'DefRow'
