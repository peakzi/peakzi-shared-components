'use client'

import { useId, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { BusinessSiteAreas } from '../BusinessSiteAreas'
import type { BusinessSiteArea, BusinessSiteAreasAppearance } from '../BusinessSiteAreas'
import { safeHref } from '../../utils/safeHref'

export interface BusinessSiteAreasDirectoryProps {
  areas: readonly BusinessSiteArea[]
  title?: string
  appearance?: BusinessSiteAreasAppearance
  /** Supply a browser-only map from the consuming framework. No map dependency is bundled here. */
  renderMap?: (areas: readonly BusinessSiteArea[]) => ReactNode
}

const normalize = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

export function BusinessSiteAreasDirectory({ areas, title, appearance, renderMap }: BusinessSiteAreasDirectoryProps) {
  const [query, setQuery] = useState('')
  const searchId = useId()
  const ordered = useMemo(() => areas.filter((area) => area.label.trim() &&
    (area.href === undefined || safeHref(area.href))).sort((a, b) =>
    Number(b.favorite === true) - Number(a.favorite === true) || a.label.localeCompare(b.label, 'en'),
  ), [areas])
  const filtered = useMemo(() => ordered.filter((area) => normalize(area.label).includes(normalize(query))), [ordered, query])

  return <BusinessSiteAreas areas={filtered} {...(title !== undefined ? { title } : {})}
    {...(appearance !== undefined ? { appearance } : {})}
    variant="directory" headingLevel="h1" map={renderMap?.(filtered)}
    controls={<div className="pz-business-areas__search">
      <label htmlFor={searchId}>Search cities</label>
      <div className="pz-business-areas__search-field">
        <Search size={18} aria-hidden="true" className="pz-business-areas__search-icon" />
        <input id={searchId} type="search" value={query} onChange={(event) => setQuery(event.target.value)}
          placeholder="Enter a city or state" autoComplete="off" />
        {query && <button type="button" onClick={() => setQuery('')}>Clear search</button>}
      </div>
      <p role="status" aria-live="polite">{query.trim()
        ? `${filtered.length} of ${ordered.length} cities found`
        : renderMap ? 'Select a city to highlight it on the map.' : 'Search the cities served.'}</p>
    </div>} />
}

BusinessSiteAreasDirectory.displayName = 'BusinessSiteAreasDirectory'
