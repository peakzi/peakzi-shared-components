import { Award, Plus, Minus } from 'lucide-react'
import { useId, useState } from 'react'
import type { CSSProperties } from 'react'
import type { ValidShowcase } from '../helpers/validate'

interface Props { items: ValidShowcase['items']; visible: number }

export function ValueShowcaseTiles({ items, visible }: Props) {
  const listId = `${useId()}-tiles`
  const [expanded, setExpanded] = useState(false)
  const hidden = Math.max(0, items.length - visible)
  if (!items.length) return null
  return (
    <>
      {/* Every tile stays in the DOM; narrow containers only hide tiles past `visible` until expanded. */}
      <ul
        id={listId}
        className="pz-business-value-showcase__tiles"
        role="list"
        aria-label="Graded services"
        data-count={items.length}
        data-expanded={expanded || hidden === 0 ? 'true' : 'false'}
        style={{ '--pz-business-value-showcase-visible': visible } as CSSProperties}
      >
        {items.map((item, index) => <li key={item.id} data-collapsible={index >= visible ? 'true' : undefined}>
          <article className="pz-business-value-showcase__tile">
            <span className="pz-business-value-showcase__rank">{item.rank}</span>
            <div className="pz-business-value-showcase__tile-body">
              <div className="pz-business-value-showcase__tile-head">
                <h3>{item.name}</h3>
                {item.badge && <span className="pz-business-value-showcase__badge"><Award aria-hidden="true" size={13} strokeWidth={1.75} />{item.badge}</span>}
              </div>
              <p>{item.proof}</p>
            </div>
          </article>
        </li>)}
      </ul>
      {hidden > 0 && <button
        type="button"
        className="pz-business-value-showcase__more"
        aria-expanded={expanded}
        aria-controls={listId}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? 'Show fewer services' : `Show ${hidden} more ${hidden === 1 ? 'service' : 'services'}`}
        {expanded ? <Minus aria-hidden="true" size={16} /> : <Plus aria-hidden="true" size={16} />}
      </button>}
    </>
  )
}
