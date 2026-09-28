import Highcharts from 'highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import Exporting from 'highcharts/modules/exporting'
import OfflineExporting from 'highcharts/modules/offline-exporting'
import SolidGauge from 'highcharts/modules/solid-gauge'
import Funnel from 'highcharts/modules/funnel'
import Treemap from 'highcharts/modules/treemap'
import HighchartsReactImport from 'highcharts-react-official'

// Every chart component imports Highcharts from here instead of importing
// 'highcharts' directly, so every module a chart could need is registered
// exactly once regardless of which chart happens to mount first. Highcharts'
// module functions are idempotent, but centralizing this removes any
// load-order dependency between chart components entirely.
;[HighchartsMore, Exporting, OfflineExporting, SolidGauge, Funnel, Treemap].forEach((registerModule) =>
  registerModule(Highcharts),
)

// highcharts-react-official ships as a UMD/CJS bundle with no ESM entry.
// Depending on how a consumer's bundler interops CJS, the default import
// resolves to either the component itself or a `{ default: Component }`
// wrapper. Normalize both shapes here once, so every chart component gets
// the actual component regardless of the bundler's interop behavior. The
// `.d.ts` always describes the real component shape, so cast back to it.
const resolvedHighchartsReact =
  (HighchartsReactImport as { default?: unknown }).default ?? HighchartsReactImport
export const HighchartsReact = resolvedHighchartsReact as typeof HighchartsReactImport

export { Highcharts }
export type { Options as HighchartsOptions, SeriesOptionsType, TooltipFormatterContextObject } from 'highcharts'
