import { useCallback, useSyncExternalStore } from 'react'
import { useMap } from 'react-leaflet'

const serverSnapshot = () => false

/** Match the section's stacked layout, including narrow Storybook containers. */
export function useMobileClustering(enabled: boolean) {
  const map = useMap()
  const root = map.getContainer().closest('.pz-business-areas') ?? map.getContainer()
  const subscribe = useCallback((notify: () => void) => {
    if (!enabled) return () => {}
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', notify)
      return () => window.removeEventListener('resize', notify)
    }
    const observer = new ResizeObserver(notify)
    observer.observe(root)
    return () => observer.disconnect()
  }, [enabled, root])
  const snapshot = useCallback(() => enabled && (root.getBoundingClientRect().width || window.innerWidth) <= 900, [enabled, root])
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot)
}
