import { percent } from '../helpers/format'
import type { BusinessSiteServicePricingSentiment } from '../helpers/types'

interface PerceptionBarsProps {
  shortName: string
  sentiments: readonly BusinessSiteServicePricingSentiment[]
  title: string
  caption: string
}

const ROWS = [
  { key: 'businessPercentage', muted: false },
  { key: 'marketPercentage', muted: true },
] as const

export function PerceptionBars({ shortName, sentiments, title, caption }: PerceptionBarsProps) {
  return (
    <figure className="pz-service-pricing__perception">
      <figcaption className="pz-service-pricing__perception-head">
        <h3 className="pz-service-pricing__perception-title">{title}</h3>
        <span className="pz-service-pricing__perception-caption">{caption}</span>
      </figcaption>
      {ROWS.map((row) => {
        const who = row.muted ? 'Market average' : shortName
        const ariaLabel = `${who}: ${sentiments.map((sentiment) => `${sentiment.label} ${percent(sentiment[row.key])}`).join(', ')}`
        return (
          <div className="pz-service-pricing__perception-row" key={row.key}>
            <span className="pz-service-pricing__perception-who">{who}</span>
            <div className="pz-service-pricing__perception-bar" role="img" aria-label={ariaLabel}>
              {sentiments.map((sentiment) => (
                <span
                  key={sentiment.key}
                  className={`pz-service-pricing__perception-segment pz-service-pricing__perception-segment--${sentiment.key}${row.muted ? ' pz-service-pricing__perception-segment--muted' : ''}`}
                  style={{ width: `${Math.min(Math.max(sentiment[row.key], 0), 100)}%` }}
                >
                  {sentiment[row.key] >= 9 ? percent(sentiment[row.key]) : ''}
                </span>
              ))}
            </div>
          </div>
        )
      })}
      <div className="pz-service-pricing__perception-legend">
        {sentiments.map((sentiment) => (
          <span key={sentiment.key} className="pz-service-pricing__legend-item">
            <span className={`pz-service-pricing__legend-dot pz-service-pricing__legend-dot--${sentiment.key}`} aria-hidden="true" />
            {sentiment.label}
          </span>
        ))}
      </div>
    </figure>
  )
}
