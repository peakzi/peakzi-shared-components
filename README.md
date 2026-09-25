# @peakzi/components

Brand-consistent UI component library for all Peakzi websites. Built with React 18+, TypeScript, and global CSS design tokens.

## What's inside

- **30 component groups** — inputs, surfaces, navigation, feedback, overlays, data display, app shell, and brand
- **Design tokens** — CSS custom properties for colour, typography, spacing, radius, shadow, and motion
- **Dark mode** — toggle via `data-theme="dark"` on `<html>`, no JavaScript required for the styles
- **Accessible** — ARIA roles, keyboard navigation, focus rings, and zero a11y violations enforced in CI

---

## Installation

```bash
# Local development (same machine)
npm install file:../peakzi-shared-components

# After publishing to a registry
npm install @peakzi/components
```

---

## Setup (one-time, per consuming repo)

### 1. Add Google Fonts to `index.html`

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

### 2. Import styles in your root file

```tsx
// main.tsx / App.tsx — import once at the top level
import '@peakzi/components/styles'
```

### 3. Set the theme

```tsx
// Light mode (default)
document.documentElement.setAttribute('data-theme', 'light')

// Dark mode
document.documentElement.setAttribute('data-theme', 'dark')

// Respect the user's OS preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
```

---

## Usage

```tsx
import { Button, Card, CardTitle, CardBody, Badge } from '@peakzi/components'

export function Example() {
  return (
    <Card variant="hoverable">
      <CardTitle>
        AI Visibility Score <Badge variant="success">+23%</Badge>
      </CardTitle>
      <CardBody>
        Your business appeared in 14 AI-generated answers this week.
      </CardBody>
      <Button variant="gradient" href="/dashboard">View dashboard</Button>
    </Card>
  )
}
```

---

## Components

| Category | Components |
|---|---|
| **Inputs** | `Button`, `Input`, `Field`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Slider`, `Segmented` |
| **Surfaces** | `Card`, `CardTitle`, `CardBody`, `CardFooter`, `Stat`, `Badge`, `Chip`, `StatusPill` |
| **Layout** | `Grid`, `Stack`, `Section`, `SectionHeader` |
| **Navigation** | `Tabs`, `TabList`, `Tab`, `TabPanel`, `Navbar`, `NavBrand`, `NavLinks`, `NavLink`, `NavActions`, `Breadcrumbs`, `Pagination`, `Stepper`, `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` |
| **Feedback** | `Alert`, `Progress`, `Ring`, `Spinner`, `Skeleton`, `EmptyState` |
| **Overlays** | `Modal`, `Dropdown`, `DropdownTrigger`, `DropdownMenu`, `DropdownItem`, `Tooltip` |
| **Data Display** | `Table`, `Thead`, `Tbody`, `Tr`, `Th`, `Td`, `Avatar`, `AvatarStack`, `StatCard`, `CopyField`, `DefList`, `EditableField` |
| **App Shell** | `AppFooter`, `PageHeader`, `SideNav` |
| **Brand** | `PeakziLogo` |
| **Charts & Maps** | `ColumnChart`, `TimeSeriesChart`, `PieChart`, `TreeMapChart`, `GaugeChart`, `PyramidChart`, `RadialGauge`, `GeoMap`, `MapMarker` — **subpath imports only** (`@peakzi/components/ColumnChart`, ...), need extra peer dependencies; see [Charts & Maps](#charts--maps) |

All named exports and their TypeScript prop types (except Charts & Maps, see above) are available from the root import:

```tsx
import { Button } from '@peakzi/components'
import type { ButtonProps, ButtonVariant, ButtonSize } from '@peakzi/components'
```

Deep imports are also supported for bundle-splitting:

```tsx
import { Button } from '@peakzi/components/Button'
import { Modal } from '@peakzi/components/Modal'
```

---

## Charts & Maps

Chart components (`ColumnChart`, `TimeSeriesChart`, `PieChart`, `TreeMapChart`, `GaugeChart`, `PyramidChart`, `RadialGauge`) are built on [Highcharts](https://www.highcharts.com/), and map components (`GeoMap`, `MapMarker`) on [Leaflet](https://leafletjs.com/)/[React Leaflet](https://react-leaflet.js.org/). Both are **optional peer dependencies** — they're not bundled into this package, so only repos that actually use a chart or map need to install them:

```bash
npm install highcharts highcharts-react-official
npm install leaflet react-leaflet@^5
```

The map components target **React Leaflet 5**, which requires **React 19** (`react-leaflet@5` peers on `react`/`react-dom` `^19` and `leaflet` `^1.9`). An app still on React 18 / React Leaflet 4 should upgrade React and its map dependencies before adopting `GeoMap`.

**Import charts and maps from their subpaths — they are not exported from the root entry.** This keeps apps that never render a chart (e.g. ones without Highcharts or Leaflet installed) from requiring those packages or running the shared Highcharts setup just by importing `@peakzi/components`:

```tsx
import { ColumnChart } from '@peakzi/components/ColumnChart'
import { GeoMap, MapMarker } from '@peakzi/components/GeoMap'
```

Subpaths: `ColumnChart`, `TimeSeriesChart`, `PieChart`, `TreeMapChart`, `GaugeChart`, `PyramidChart`, `RadialGauge`, `GeoMap` (which also exports `MapMarker`). Each subpath exports the component and its prop types.

Highcharts requires a commercial license for non-personal projects — confirm licensing is in place before shipping chart components to production, independent of this package.

Every chart/map component accepts `className` for the root element and `testId` (rendered as `data-testid`) for test targeting.

`ColumnChart`, `TimeSeriesChart`, `PieChart`, `TreeMapChart` and `PyramidChart` have an export menu with a **View Full Screen** toggle plus PNG/JPEG/SVG/PDF download. `GaugeChart` and `RadialGauge` are fixed-size KPI widgets, so they have neither.

### Theming

Charts and maps take their colors, font, text sizes, weights and radii from the design tokens (`--peakzi-purple`, `--fg-1`, `--fg-2`, `--border`, `--surface-1`, `--font-body`, `--text-*`, `--weight-*`, `--radius-*`, `--info`, ...). There are **no hardcoded fallback values**, so `@peakzi/components/styles` must be imported. If a token doesn't resolve, Highcharts uses its own default for that option.

Switching themes restyles mounted charts immediately: they re-read tokens whenever `data-theme` or `class` changes anywhere in the document (including a scoped `.peakzi-dark` ancestor), with no re-render needed from the caller. Map pins and HTML labels are styled purely by CSS classes. Every chart also accepts explicit color props to override the defaults per instance.

Highcharts can't take `var(--token)` directly: it writes colors as SVG attributes, does its own color math, and serializes exports outside the page. That's why tokens are read as resolved values instead of being passed through.

### ColumnChart

Column, bar, and line charts. Pass `data` for one series, or `series` for several named ones (add `stacked` to stack them instead of grouping).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `number[]` | — | Single-series values. Ignored if `series` is set. |
| `series` | `{ name, data, color? }[]` | — | Multiple named series — enables the legend automatically. |
| `stacked` | `boolean` | `false` | Stack `series` instead of grouping. |
| `categories` | `string[]` | — | X-axis labels. |
| `type` | `'column' \| 'bar' \| 'line'` | `'column'` | |
| `title` / `yAxisTitle` | `string` | — | |
| `tooltipFormatter` | Highcharts `TooltipFormatterCallbackFunction` | built-in | |
| `columnWidth` | `number` | `80` | Max point width, px. |
| `color` | `string` | brand accent | Point/line color for a single `data` series. |
| `chartHeight` | `number` | `480` | |
| `isLoading` | `boolean` | `false` | Renders `Skeleton` in place of the chart. |

### TimeSeriesChart

A time-axis line/area/spline chart for trend data at a fixed interval.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `series` | `{ name, data }[]` | — | `data` entries may be `null` to leave gaps. |
| `pointInterval` / `pointStart` | `number` | — | Milliseconds between points / timestamp (ms) of the first point. |
| `type` | `'line' \| 'area' \| 'spline'` | `'line'` | |
| `legendEnabled` | `boolean` | `true` | |
| `subtitle` | `string` | — | |
| `onVisibleSeriesChange` | `(names: string[]) => void` | — | Called with the series left visible after a legend toggle. |
| `tooltipFormatter` | Highcharts `TooltipFormatterCallbackFunction` | — | |
| `chartHeight` | `number` | `300` | |
| `isLoading` | `boolean` | `false` | |

### PieChart

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `{ name: string, value: number }[]` | — | |
| `title` | `string` | — | |
| `valueSuffix` | `string` | `'%'` | Appended in the tooltip and data labels. |
| `chartHeight` | `number` | `400` | |
| `isLoading` | `boolean` | `false` | |

### TreeMapChart

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `{ name, value, id?, parent?, color? }[]` | — | `id`/`parent` enable hierarchical (drilldown) treemaps. |
| `title` | `string` | — | |
| `valueSuffix` | `string` | `'%'` | |
| `chartHeight` | `number` | `400` | |
| `isLoading` | `boolean` | `false` | |

### GaugeChart

A compact solid-gauge for a single KPI value against a max.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` / `maxValue` | `number` | — | |
| `unit` | `string` | `''` | Appended after the value, e.g. `'%'`. Fully caller-controlled — there's no hardcoded metric-name matching. |
| `chartHeight` | `number` | `170` | |

### PyramidChart

A funnel/pyramid chart for size-tiered distributions. Values are log-scaled internally for visual balance; the chart still displays and tooltips real counts.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `[name: string, value: number][]` | — | |
| `emptyState` | `ReactNode` | `null` | Rendered instead of the chart when every value is zero (or `data` is empty). The chart has no built-in empty state — pass your own message/illustration. |
| `chartHeight` | `number` | `415` | |
| `isLoading` | `boolean` | `false` | |

### RadialGauge

A generic full-circle solid-gauge with a slot for center content — the mechanical primitive behind a branded score meter (compose it with your own logo/icon rather than hardcoding one into the chart).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` / `maxValue` | `number` | — | |
| `size` | `number` | `140` | Diameter, px. |
| `colors` | `[string, string]` | brand gradient | Two-stop gradient for the arc fill. |
| `centerContent` | `ReactNode` | — | Rendered centered over the gauge. |

### GeoMap / MapMarker

`GeoMap` is a `MapContainer`/`TileLayer`/auto-fit-bounds primitive — it renders no markers itself. Compose `MapMarker` for the common point-with-tooltip case, or your own `react-leaflet` layers (`CircleMarker`, `GeoJSON`, ...) as children for anything more custom.

**`GeoMap`**

| Prop | Type | Default | Notes |
|---|---|---|---|
| `points` | `{ lat, lon }[]` | `[]` | Used only to compute the auto-fit viewport — doesn't render anything. |
| `center` | `{ lat, lon }` | `points[0]` | Fallback center when `points` is empty. |
| `zoom` | `number` | `9` | |
| `boundsPadding` | `[number, number]` | — | Extra px padding around the fitted bounds. |
| `maxFitZoom` | `number` | `15` | Zoom cap when auto-fitting several points. A single point uses `zoom`. |
| `height` | `number \| string` | `400` | |
| `isLoading` | `boolean` | `false` | |
| `children` | `ReactNode` | — | `MapMarker` or other `react-leaflet` layers. |

**`MapMarker`** — takes a single `point: MapPoint`:

| Field | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | |
| `position` | `{ lat, lon }` | — | |
| `tooltip` | `ReactNode` | — | Shown on hover (or tap, on touch devices). Omit for a bare marker with no tooltip. |
| `color` | `string` | brand accent / secondary tone if `emphasized` | Pin color for the bundled default icon. |
| `iconUrl` | `string` | — | Fully custom marker icon — overrides `color` and the bundled default pin entirely. |
| `iconSize` | `[number, number]` | `[14,14]` / `[20,20]` if `emphasized` | |
| `emphasized` | `boolean` | `false` | Visually distinguishes one point among many (e.g. "your business" among competitors). |

**Map CSS comes from the shared stylesheet, not the `GeoMap` JavaScript subpath.** The build extracts Leaflet's base CSS, together with the map, pin and tooltip styles, into `@peakzi/components/styles` (`dist/components.css`). Importing `@peakzi/components/GeoMap` alone does not load it — without `import '@peakzi/components/styles'` tiles render scattered and markers unstyled. Apps that already import the shared styles globally need nothing extra; there's no need to import `leaflet/dist/leaflet.css` separately.

For several `points`, the viewport auto-fits but never zooms past `maxFitZoom` (default `15`). A single point, or points that all coincide, is centered at `zoom` instead of fitted. `MapMarker` `color` must be a valid CSS color (hex, `rgb()`, `hsl()`, a named color or `var(--token)`); anything else is ignored and the pin uses its token default.

See Storybook's `Charts` and `Maps` sections for live, interactive examples of all of the above.

---

## Automatic element styling

Once `@peakzi/components/styles` is imported and `data-theme` is set on `<html>`, **all native HTML elements are styled automatically** — no class names needed.

```tsx
// These look identical across every Peakzi repo:
<h2>Rajt</h2>        // → Urbanist 700, 36px, tight leading, --fg-1
<p>Some text</p>     // → Inter 400, 16px, relaxed leading, --fg-2
<a href="/">Link</a> // → --fg-link colour, underline on hover
<code>token</code>   // → JetBrains Mono, muted background pill
<strong>Bold</strong> // → semibold, --fg-1
```

| Element | Font | Size | Maps to |
|---|---|---|---|
| `<h1>` | Urbanist 700 | 64px | `.peakzi-h1` |
| `<h2>` | Urbanist 700 | 36px | `.peakzi-h2` |
| `<h3>` | Urbanist 600 | 24px | `.peakzi-h3` |
| `<h4>` | Urbanist 600 | 20px | `.peakzi-h4` |
| `<h5>` | Urbanist 600 | 16px | — |
| `<h6>` | Inter 600 | 14px uppercase | — |
| `<p>` | Inter 400 | 16px | `.peakzi-p` |
| `<a>` | Inherited | Inherited | `--fg-link` |
| `<code>` | JetBrains Mono | 0.9em | `.peakzi-code` |
| `<strong>` | Semibold | Inherited | — |
| `<small>` | Inter | 14px | — |

**How specificity works with MUI:** The selector is `[data-theme] h2` (specificity 0-1-1), which is lower than MUI's class-based selectors (`.MuiTypography-h2` = 0-1-0 + chaining = 0-2-0+). So MUI components keep their own styles. Plain `<h2>` elements get Peakzi styles.

---

## Design tokens

All tokens are CSS custom properties on `:root`. Use them directly in any stylesheet or inline style in the consuming repo — no import needed once the styles are loaded.

```css
.my-element {
  background: var(--surface-1);
  color: var(--fg-1);
  border: 1px solid var(--border);
  font-family: var(--font-display);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
```

### Key token groups

| Group | Examples |
|---|---|
| Backgrounds | `--bg`, `--bg-subtle`, `--surface-1`, `--surface-2` |
| Foreground | `--fg-1`, `--fg-2`, `--fg-3`, `--fg-accent`, `--fg-link` |
| Brand colours | `--peakzi-navy-800`, `--peakzi-purple`, `--peakzi-pink` |
| Gradients | `--gradient-brand`, `--gradient-peak` |
| Typography | `--font-display`, `--font-body`, `--font-mono` |
| Spacing | `--space-1` (4px) → `--space-32` (128px) |
| Radius | `--radius-xs` (4px) → `--radius-full` (9999px) |
| Shadows | `--shadow-xs` → `--shadow-2xl`, `--shadow-glow-brand` |
| Motion | `--duration-fast`, `--ease-spring` |

---

## Typography classes

Apply these classes to any element for canonical Peakzi typography:

```tsx
<h1 className="peakzi-h1">AI Visibility</h1>
<p className="peakzi-lede">Track where AI systems cite your business.</p>
<span className="peakzi-eyebrow">New feature</span>
<code className="peakzi-code">data-theme="dark"</code>
<span className="peakzi-gradient-text peakzi-h2">Peakzi</span>
```

| Class | Font | Size | Use for |
|---|---|---|---|
| `.peakzi-h-display` | Urbanist 800 | 104px | Hero headlines only |
| `.peakzi-h1` | Urbanist 700 | 64px | Page titles |
| `.peakzi-h2` | Urbanist 700 | 36px | Section headings |
| `.peakzi-h3` | Urbanist 600 | 24px | Card titles |
| `.peakzi-h4` | Urbanist 600 | 20px | Sub-headings |
| `.peakzi-eyebrow` | Inter 600 | 12px uppercase | Labels above headings |
| `.peakzi-lede` | Inter 400 | 20px | Intro paragraphs |
| `.peakzi-p` | Inter 400 | 16px | Body copy |
| `.peakzi-small` | Inter | 14px | Captions, helper text |
| `.peakzi-code` | JetBrains Mono | 0.9em | Inline code |
| `.peakzi-gradient-text` | — | — | Brand gradient on text |

---

## Development

```bash
# Start Storybook (component explorer + docs)
npm run dev

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# TypeScript check
npm run typecheck

# Lint (zero warnings enforced)
npm run lint

# Build the library
npm run build
```

### Storybook

Storybook runs at `http://localhost:6006`. The sidebar is organised as:

```
Foundation
  Colors       — full brand palette and semantic token reference
  Typography   — font families, type scale, and all typography classes

Components
  Inputs       — Button, Input, Checkbox, Switch, Slider, Segmented
  Surfaces     — Card, Badge, StatusPill
  Layout       — Grid, Stack, Section
  Feedback     — Alert, EmptyState, Progress
  Navigation   — Breadcrumbs, Navbar, Tabs, Stepper, Accordion
  Overlays     — Dropdown, Modal, Tooltip
  Data Display — Avatar, Table, StatCard, CopyField, DefList, EditableField
  App Shell    — AppFooter, PageHeader, SideNav
  Brand        — PeakziLogo

Charts — ColumnChart, TimeSeriesChart, PieChart, TreeMapChart, GaugeChart, PyramidChart, RadialGauge
Maps   — GeoMap
```

Each story includes interactive Controls, a dark/light theme toggle, and an a11y panel.

---

## Publishing

```bash
# prepublishOnly runs automatically: typecheck → lint → test → build
npm publish --access public
```

The `dist/` folder is gitignored and rebuilt on every publish.

---

## Consuming repo checklist

- [ ] `npm install @peakzi/components` (or `file:../peakzi-shared-components`)
- [ ] Google Fonts `<link>` tags added to `index.html`
- [ ] `import '@peakzi/components/styles'` at the root of the app
- [ ] `data-theme` attribute set on `<html>` at startup
- [ ] No raw hex values in custom styles — use `var(--token-name)` instead
- [ ] Navigation links use `<Button href="...">` not `<Button onClick>` (for SEO crawlability)
- [ ] If using any chart/map component: `highcharts` + `highcharts-react-official` and/or `leaflet` + `react-leaflet@^5` (React 19) installed directly, imported from subpaths (`@peakzi/components/ColumnChart`, ...), and `@peakzi/components/styles` imported (see [Charts & Maps](#charts--maps))
