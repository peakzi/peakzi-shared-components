import type { ReactNode } from 'react'
import { ArrowDown, Check } from 'lucide-react'
import { businessSiteIcon } from '../../utils/businessSiteIcon'
import { safeHref } from '../../utils/safeHref'
import { serviceDetailStyle, type BusinessSiteServiceDetailAppearance } from './helpers/appearance'
import { tradeIcon } from '../BusinessSiteServices/helpers/trade-icon'
import type { BusinessSiteHeroAction } from '../BusinessSiteHero/helpers/types'
import './BusinessSiteServiceDetail.scss'

export interface BusinessSiteServiceDetailReason {
  label: string
  proof?: string
}

export interface BusinessSiteServiceDetailSectionLink {
  /** The ID of an existing, server-rendered section supplied in children. */
  id: string
  label: string
}

export interface BusinessSiteServiceDetailProps {
  /** Use once per page; renders its single H1. */
  headline: string
  description?: string
  trade?: string
  businessName?: string
  actions?: readonly BusinessSiteHeroAction[]
  reasons?: readonly BusinessSiteServiceDetailReason[]
  reasonsTitle?: string
  sections?: readonly BusinessSiteServiceDetailSectionLink[]
  /** Routing stays with the consumer; supply its existing breadcrumb navigation. */
  breadcrumb?: ReactNode
  /** Compose existing Gallery, Offers, Reviews, FAQ, Blogs and Areas sections. */
  children?: ReactNode
  appearance?: BusinessSiteServiceDetailAppearance
  sectionId?: string
  className?: string
}

/** Server-renderable service presentation. No data fetching, hooks or pricing. */
export function BusinessSiteServiceDetail({ headline, description, trade, businessName, actions = [], reasons = [],
  reasonsTitle = 'Why choose us', sections = [], breadcrumb, children, appearance = {}, sectionId = 'service-detail', className }: BusinessSiteServiceDetailProps) {
  const title = headline?.trim()
  if (!title) throw new Error('BusinessSiteServiceDetail requires a non-empty headline')
  const id = /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(sectionId) ? sectionId : 'service-detail'
  const whyId = `${id}-why`
  const proof = reasons.filter((reason) => reason?.label?.trim())
  const validActions = actions.flatMap((action) => {
    const href = safeHref(action?.href)
    return href && action.label?.trim() ? [{ ...action, href }] : []
  })
  const links = [...new Map([
    ...(proof.length ? [{ id: whyId, label: 'Why choose us' }] : []),
    ...sections.filter((section) => section?.label?.trim() && /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(section.id) && section.id !== whyId),
  ].map((section) => [section.id, section])).values()]
  const hasCopy = Boolean(description?.trim() || validActions.length)
  const icon = trade?.trim() ? tradeIcon(trade) : null

  return <div className={['pz-service-detail', className].filter(Boolean).join(' ')}
    data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'}
    data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'} style={serviceDetailStyle(appearance)}>
    {breadcrumb}
    <header className="pz-service-detail__intro" data-has-copy={hasCopy}>
      <div className="pz-service-detail__lead">
        {trade?.trim() && <p className="pz-service-detail__trade">
          {icon && <span className="pz-service-detail__trade-icon" aria-hidden="true">{icon}</span>}{trade}
        </p>}
        <h1 id={`${id}-heading`}>{title}</h1>
        {businessName?.trim() && <p className="pz-service-detail__business">{businessName}</p>}
      </div>
      {hasCopy && <div className="pz-service-detail__copy">
        {description?.trim() && <p className="pz-service-detail__description">{description}</p>}
        {validActions.length > 0 && <div className="pz-service-detail__actions">
          {validActions.map((action) => {
            const newTab = action.newTab === true && /^https?:\/\//i.test(action.href)
            const actionIcon = businessSiteIcon(action.iconName)
            return <a key={action.id} href={action.href} data-action-id={action.id}
              className={`pz-service-detail__action pz-service-detail__action--${action.type === 'primary' ? 'primary' : 'secondary'}`}
              target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}>
              {actionIcon && action.iconPosition !== 'after' && <span aria-hidden="true">{actionIcon}</span>}
              <span>{action.label}</span>
              {actionIcon && action.iconPosition === 'after' && <span aria-hidden="true">{actionIcon}</span>}
            </a>
          })}
        </div>}
      </div>}
    </header>
    {links.length > 1 && <nav className="pz-service-detail__nav" aria-label="On this page">
      <span>On this page</span><ul role="list">{links.map((link) => <li key={link.id}>
        <a href={`#${link.id}`}>{link.label}<ArrowDown size={14} aria-hidden="true" /></a>
      </li>)}</ul>
    </nav>}
    {proof.length > 0 && <section className="pz-service-detail__proof" id={whyId} aria-labelledby={`${whyId}-heading`}>
      <h2 id={`${whyId}-heading`}>{reasonsTitle?.trim() || 'Why choose us'}</h2>
      <ul role="list">{proof.map((reason, index) => <li key={`${reason.label}-${index}`}>
        <span className="pz-service-detail__check" aria-hidden="true"><Check size={16} /></span>
        <div><h3>{reason.label}</h3>{reason.proof?.trim() && <p>{reason.proof}</p>}</div>
      </li>)}</ul>
    </section>}
    <div className="pz-service-detail__sections">{children}</div>
  </div>
}

BusinessSiteServiceDetail.displayName = 'BusinessSiteServiceDetail'
