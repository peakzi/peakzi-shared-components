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
| **Surfaces** | `Card`, `CardTitle`, `CardBody`, `Stat`, `Badge`, `Chip`, `StatusPill` |
| **Navigation** | `Tabs`, `TabList`, `Tab`, `TabPanel`, `Navbar`, `NavBrand`, `NavLinks`, `NavLink`, `NavActions`, `Breadcrumbs`, `Pagination`, `Stepper`, `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` |
| **Feedback** | `Alert`, `Progress`, `Ring`, `Spinner`, `Skeleton`, `EmptyState` |
| **Overlays** | `Modal`, `Dropdown`, `DropdownTrigger`, `DropdownMenu`, `DropdownItem`, `Tooltip` |
| **Data Display** | `Table`, `Thead`, `Tbody`, `Tr`, `Th`, `Td`, `Avatar`, `AvatarStack`, `StatCard`, `CopyField`, `DefList`, `EditableField` |
| **App Shell** | `AppFooter`, `PageHeader`, `SideNav` |
| **Brand** | `PeakziLogo` |

All named exports and their TypeScript prop types are available from the root import:

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
  Feedback     — Alert, EmptyState, Progress
  Navigation   — Breadcrumbs, Navbar, Tabs, Stepper, Accordion
  Overlays     — Dropdown, Modal, Tooltip
  Data Display — Avatar, Table, StatCard, CopyField, DefList, EditableField
  App Shell    — AppFooter, PageHeader, SideNav
  Brand        — PeakziLogo
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
