import type { PricingStat } from '../helpers/summary'

interface PriceStatsProps {
  isLoading: boolean
  stats: readonly PricingStat[]
}

export function PriceStats({ isLoading, stats }: PriceStatsProps) {
  if (isLoading) {
    return (
      <div className="pz-service-pricing__stats" aria-hidden="true">
        <div className="pz-service-pricing__skeleton pz-service-pricing__skeleton--stat" />
        <div className="pz-service-pricing__skeleton pz-service-pricing__skeleton--stat" />
      </div>
    )
  }
  if (stats.length === 0) return null

  return (
    <div className="pz-service-pricing__stats">
      {stats.map((stat) => (
        <div className="pz-service-pricing__stat" key={stat.label}>
          <span className="pz-service-pricing__stat-value">{stat.value}</span>
          <span className="pz-service-pricing__stat-label">{stat.label}</span>
          <span className="pz-service-pricing__stat-sub">{stat.sub}</span>
        </div>
      ))}
    </div>
  )
}
