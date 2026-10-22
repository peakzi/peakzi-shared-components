import { factorAmount } from '../helpers/factors'
import type { BusinessSiteServicePricingFactor } from '../helpers/types'

const GROUPS = {
  down: { title: 'Lowers the price', icon: '↓' },
  up: { title: 'Raises the price', icon: '↑' },
} as const

interface PriceFactorGroupProps {
  direction: keyof typeof GROUPS
  factors: readonly BusinessSiteServicePricingFactor[]
}

export function PriceFactorGroup({ direction, factors }: PriceFactorGroupProps) {
  const { title, icon } = GROUPS[direction]

  return (
    <div className={`pz-service-pricing__factor-group pz-service-pricing__factor-group--${direction}`}>
      <div className="pz-service-pricing__factor-group-head">
        <span className="pz-service-pricing__factor-group-icon" aria-hidden="true">{icon}</span>
        <h4 className="pz-service-pricing__factor-group-title">{title}</h4>
        <span className="pz-service-pricing__factor-group-count">{factors.length}</span>
      </div>
      <ul className="pz-service-pricing__factor-list" role="list">
        {factors.map((factor, index) => (
          <li key={index}>
            <span>{factor.label}</span>
            <span className={`pz-service-pricing__factor-amount pz-service-pricing__factor-amount--${direction}`}>{factorAmount(factor)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
