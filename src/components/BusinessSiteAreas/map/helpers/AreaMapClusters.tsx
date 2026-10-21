import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import { createElementObject, createLayerComponent, extendContext } from '@react-leaflet/core'

const ClusterLayer = createLayerComponent<L.MarkerClusterGroup, { children?: ReactNode }>((_props, context) => {
  const group = L.markerClusterGroup({
    maxClusterRadius: 48,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: true,
    spiderfyDistanceMultiplier: 1.4,
    animate: false,
    iconCreateFunction: (cluster) => {
      const count = cluster.getChildCount()
      // Only a numeric count is interpolated. City labels remain React-rendered text.
      return L.divIcon({
        className: 'pz-business-areas__cluster',
        html: `<span data-cluster-count="${count}" aria-hidden="true">${count}</span><span class="pz-business-areas__cluster-label">${count} cities. Zoom in to explore.</span>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      })
    },
  })
  return createElementObject(group, extendContext(context, { layerContainer: group }))
})

export function AreaMapClusters({ selectedLabel, children }: { selectedLabel: string | undefined; children: ReactNode }) {
  const ref = useRef<L.MarkerClusterGroup>(null)
  useEffect(() => {
    const group = ref.current
    if (!selectedLabel || !group) return
    const marker = group.getLayers().find((layer): layer is L.Marker =>
      layer instanceof L.Marker && layer.options.title === selectedLabel)
    if (!marker) return
    let cancelled = false
    group.zoomToShowLayer(marker, () => { if (!cancelled) marker.openTooltip() })
    return () => { cancelled = true }
  }, [selectedLabel])
  return <ClusterLayer ref={ref}>{children}</ClusterLayer>
}
