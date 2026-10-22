import type { TierView } from '../helpers/tiers'
import { PriceFactorGroup } from '../price-factors/PriceFactorGroup'

export function TierCard({ view }: { view: TierView }) {
  return (
    <article className="pz-service-pricing__tier-card">
      <div className="pz-service-pricing__tier-header">
        <h3 className="pz-service-pricing__tier-name">{view.name}</h3>
        {view.hasPrice
          ? <div className="pz-service-pricing__tier-range">{view.priceRange}</div>
          : <div className="pz-service-pricing__tier-no-price">Priced on site</div>}
        {view.showTypical && (
          <div className="pz-service-pricing__typical">
            <div className="pz-service-pricing__typical-bars" aria-hidden="true">
              <span className="pz-service-pricing__typical-track" />
              <span className="pz-service-pricing__typical-bar pz-service-pricing__typical-bar--market" style={view.typicalBarStyle} />
              <span className="pz-service-pricing__typical-bar pz-service-pricing__typical-bar--business" style={view.ourBarStyle} />
            </div>
            <span className={`pz-service-pricing__typical-chip${view.isBelowTypical ? ' pz-service-pricing__typical-chip--below' : ''}`}>
              {view.typicalNote} · area {view.typicalRange}
            </span>
          </div>
        )}
      </div>
      <div className="pz-service-pricing__tier-body">
        {view.included.length > 0 && (
          <div className="pz-service-pricing__included">
            <h4 className="pz-service-pricing__included-title">Included</h4>
            <ul className="pz-service-pricing__included-list" role="list">
              {view.included.map((item, index) => (
                <li key={index}>
                  <span aria-hidden="true">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {view.lowers.length > 0 && <PriceFactorGroup direction="down" factors={view.lowers} />}
        {view.raisers.length > 0 && <PriceFactorGroup direction="up" factors={view.raisers} />}
        {view.isBare && (
          <p className="pz-service-pricing__bare-note">
            {view.hasPrice
              ? 'No add-ons or discounts on record. The range covers most jobs.'
              : 'The technician inspects first, then gives you the price in writing.'}
          </p>
        )}
      </div>
    </article>
  )
}
