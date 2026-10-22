import { servicesStyle } from '../BusinessSiteServices/helpers/appearance'
import { PricingFooter } from './footer/PricingFooter'
import { pricingLede, pricingStats, resolveFairValue, showPerception, usableSentiments } from './helpers/summary'
import { buildTierView } from './helpers/tiers'
import type { BusinessSiteServicePricingProps } from './helpers/types'
import { PerceptionBars } from './perception/PerceptionBars'
import { PriceStats } from './stats/PriceStats'
import { TierCard } from './tier-card/TierCard'
import './BusinessSiteServicePricing.scss'

export function BusinessSiteServicePricing({
  isLoading = false,
  businessName,
  shortBusinessName,
  service,
  phoneHref,
  vsMarketPercentage,
  fairValue,
  sentiments = [],
  tiers = [],
  typicalComparison = 'always',
  eyebrow,
  title = 'What you can expect to pay',
  perceptionTitle = 'How customers rated the bill',
  perceptionCaption = 'Post-job survey · verified customers',
  appearance = {},
  sectionId,
  className,
}: BusinessSiteServicePricingProps) {
  if (!isLoading && tiers.length === 0) return null

  const tierViews = tiers.map((tier) => buildTierView(tier, typicalComparison))
  const resolvedFairValue = resolveFairValue(fairValue)
  const ratings = usableSentiments(sentiments)
  const headingId = sectionId ? `${sectionId}-heading` : undefined

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={['pz-service-pricing', className].filter(Boolean).join(' ')}
      data-density={appearance.density === 'comfortable' ? 'comfortable' : 'compact'}
      data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'}
      style={servicesStyle(appearance)}
    >
      <div className="pz-service-pricing__intel">
        <div className="pz-service-pricing__intel-header">
          <div className="pz-service-pricing__intel-lead">
            <span className="pz-service-pricing__eyebrow">{eyebrow?.trim() || `Pricing · ${service}`}</span>
            <h2 id={headingId} className="pz-service-pricing__title">{title}</h2>
            {!isLoading && <p className="pz-service-pricing__lede">{pricingLede(service, tiers, tierViews)}</p>}
          </div>
          <PriceStats isLoading={isLoading} stats={pricingStats(vsMarketPercentage, resolvedFairValue)} />
        </div>
        {!isLoading && showPerception(ratings.length, resolvedFairValue) && (
          <PerceptionBars
            shortName={shortBusinessName?.trim() || businessName}
            sentiments={ratings}
            title={perceptionTitle}
            caption={perceptionCaption}
          />
        )}
      </div>

      <div className="pz-service-pricing__jobs">
        {isLoading ? (
          <div className="pz-service-pricing__tiers" data-count="2" aria-hidden="true">
            {[1, 2].map((key) => <div className="pz-service-pricing__skeleton pz-service-pricing__skeleton--card" key={key} />)}
          </div>
        ) : (
          <>
            <div className="pz-service-pricing__tiers" data-count={tierViews.length}>
              {tierViews.map((view, index) => <TierCard view={view} key={index} />)}
            </div>
            <PricingFooter businessName={businessName} hasPrices={tierViews.some((view) => view.hasPrice)} phoneHref={phoneHref} />
          </>
        )}
      </div>
    </section>
  )
}

BusinessSiteServicePricing.displayName = 'BusinessSiteServicePricing'
