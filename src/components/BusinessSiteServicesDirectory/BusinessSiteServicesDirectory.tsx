'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { safeHref } from '../../utils/safeHref'
import { servicesStyle } from '../BusinessSiteServices/helpers/appearance'
import { tradeIcon } from '../BusinessSiteServices/helpers/trade-icon'
import type { BusinessSiteServiceGroup, BusinessSiteServicesAppearance } from '../BusinessSiteServices/helpers/types'
import './BusinessSiteServicesDirectory.scss'

export interface BusinessSiteServicesDirectoryProps {
  groups: readonly BusinessSiteServiceGroup[]
  title?: string
  eyebrow?: string
  intro?: string
  headingLevel?: 'h1' | 'h2'
  appearance?: BusinessSiteServicesAppearance
  sectionId?: string
  className?: string
}

function searchable(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().replace(/\s+/g, ' ').trim()
}

/** A price-free directory. Every service link is server-rendered; hydration only
 * enhances search. The existing homepage Services component stays unchanged. */
export function BusinessSiteServicesDirectory({ groups, title = 'Our services', eyebrow, intro,
  headingLevel = 'h2', appearance = {}, sectionId, className }: BusinessSiteServicesDirectoryProps) {
  const generatedId = useId()
  const baseId = sectionId || `services-directory-${generatedId.replace(/:/g, '')}`
  const [query, setQuery] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const catalogue = useMemo(() => (groups ?? []).flatMap((group, index) => {
    const services = (group.services ?? []).filter((service) => service?.title?.trim())
    return group.trade?.trim() && services.length ? [{ ...group, services, anchor: `${baseId}-trade-${index + 1}` }] : []
  }), [groups, baseId])
  const words = searchable(query).split(' ').filter(Boolean)
  const filtered = catalogue.flatMap((group) => {
    const services = group.services.filter((service) => {
      const value = searchable(`${group.trade} ${group.title ?? ''} ${service.title} ${service.summary ?? ''}`)
      return words.every((word) => value.includes(word))
    })
    return services.length ? [{ ...group, services }] : []
  })
  const total = catalogue.reduce((count, group) => count + group.services.length, 0)
  const matches = filtered.reduce((count, group) => count + group.services.length, 0)
  const Heading = headingLevel
  const TradeHeading = headingLevel === 'h1' ? 'h2' : 'h3'
  const ServiceHeading = headingLevel === 'h1' ? 'h3' : 'h4'
  const clear = () => { setQuery(''); input.current?.focus() }

  return <section id={baseId} className={['pz-services-directory', className].filter(Boolean).join(' ')}
    aria-labelledby={`${baseId}-heading`} data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'}
    data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'} style={servicesStyle(appearance)}>
    <div className="pz-services-directory__inner">
      <header className="pz-services-directory__header">
        <div className="pz-services-directory__intro">
          {eyebrow?.trim() && <p className="pz-services-directory__eyebrow">{eyebrow.trim()}</p>}
          <Heading id={`${baseId}-heading`}>{title}</Heading>
          {intro?.trim() && <p className="pz-services-directory__description">{intro.trim()}</p>}
          <p className="pz-services-directory__inventory">{total} {total === 1 ? 'service' : 'services'}
            {catalogue.length > 1 && <><span aria-hidden="true"> / </span>{catalogue.length} trades</>}</p>
        </div>
        {total > 0 && <div className="pz-services-directory__search" role="search" aria-label="Find a service">
          <label htmlFor={`${baseId}-search`}>Search services</label>
          <div className="pz-services-directory__search-field">
            <Search size={19} aria-hidden="true" />
            <input ref={input} id={`${baseId}-search`} type="search" value={query}
              onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => {
                if (event.key === 'Escape' && query) { event.preventDefault(); clear() }
              }} placeholder="Search services or trades" aria-controls={`${baseId}-results`} />
            {query && <button type="button" onClick={clear} aria-label="Clear service search"><X size={18} aria-hidden="true" /></button>}
          </div>
        </div>}
      </header>
      {catalogue.length > 1 && filtered.length > 0 && <nav className="pz-services-directory__nav" aria-label="Browse service trades">
        <span>Browse by trade</span><ul>{filtered.map((group) => <li key={group.id}>
          <a href={`#${group.anchor}`}>{tradeIcon(group.trade, group.iconName)}<span>{group.trade}</span>{' '}
            <span className="pz-services-directory__nav-count">{group.services.length}</span></a>
        </li>)}</ul>
      </nav>}
      <p className="pz-services-directory__status" role="status" aria-live="polite" aria-atomic="true">
        {words.length > 0 ? `${matches} of ${total} services match your search` : ''}
      </p>
      <div id={`${baseId}-results`} className="pz-services-directory__results">
        {filtered.map((group) => <section key={group.id} id={group.anchor}
          className="pz-services-directory__group" data-filtered={words.length > 0 ? 'true' : undefined} aria-labelledby={`${group.anchor}-heading`}>
          <header className="pz-services-directory__trade">
            <span className="pz-services-directory__trade-icon" aria-hidden="true">{tradeIcon(group.trade, group.iconName)}</span>
            <TradeHeading id={`${group.anchor}-heading`}>{group.title?.trim() || group.trade}</TradeHeading>
            <p className="pz-services-directory__trade-count"><strong>{group.services.length}</strong>
              {words.length ? ' matching' : ''} {group.services.length === 1 ? 'service' : 'services'}</p>
          </header>
          <ul className="pz-services-directory__list">{group.services.map((service) => {
            const href = safeHref(service.href)
            const content = <><div><ServiceHeading>{service.title}</ServiceHeading>
              {service.summary?.trim() && <p>{service.summary.trim()}</p>}</div>
              {href && <ArrowUpRight size={19} aria-hidden="true" />}</>
            return <li key={service.id}>{href
              ? <a className="pz-services-directory__service" href={href}>{content}</a>
              : <article className="pz-services-directory__service">{content}</article>}</li>
          })}</ul>
        </section>)}
        {filtered.length === 0 && <div className="pz-services-directory__empty">
          <p>{total ? 'No matching services' : 'No services to display'}</p>
          <p>{total ? 'Try a different service name or trade.' : 'There are no services listed for this business right now.'}</p>
          {total > 0 && <button type="button" onClick={clear}>Clear search</button>}
        </div>}
      </div>
    </div>
  </section>
}

BusinessSiteServicesDirectory.displayName = 'BusinessSiteServicesDirectory'
