import { describe, expect, it } from 'vitest'
import * as root from './index'

// Charts/maps depend on optional peers (highcharts, leaflet). Exporting them from
// the root would make every `@peakzi/components` import require those packages.
describe('root entry', () => {
  it('does not export chart or map components', () => {
    for (const name of ['ColumnChart', 'TimeSeriesChart', 'PieChart', 'TreeMapChart', 'GaugeChart', 'PyramidChart', 'RadialGauge', 'GeoMap', 'MapMarker']) {
      expect(root).not.toHaveProperty(name)
    }
  })
})
