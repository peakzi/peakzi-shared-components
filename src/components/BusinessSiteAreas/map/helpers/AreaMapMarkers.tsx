import type { ReactNode } from 'react'
import { AreaMapClusters } from './AreaMapClusters'
import { useMobileClustering } from './use-mobile-clustering'

export function AreaMapMarkers({ clusterOnMobile, selectedLabel, children }: {
  clusterOnMobile: boolean
  selectedLabel: string | undefined
  children: ReactNode
}) {
  const clustered = useMobileClustering(clusterOnMobile)
  return clustered ? <AreaMapClusters selectedLabel={selectedLabel}>{children}</AreaMapClusters> : children
}
