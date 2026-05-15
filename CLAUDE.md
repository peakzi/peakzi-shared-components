# Peakzi Shared Components — AI Agent Reference

> Read this file completely before writing a single line of design or code.
> This is the ground truth for every UI agent working on any Peakzi product.

---

## What This Repo Is

Package name: `@peakzi/components`
30 component groups covering every common UI pattern across all Peakzi apps.

**Consuming app setup (already done in existing apps — do not repeat):**
```tsx
// index.html — Google Fonts
// main.tsx — import '@peakzi/components/styles'
// index.html <html> — data-theme="light" | "dark"
```

---

## Component Inventory

**Check this list before creating anything new. Compose existing components first.**

### Inputs
| Component | Key Props |
|-----------|-----------|
| `Button` | `variant`: primary \| gradient \| secondary \| ghost \| link \| danger \| success \| icon. `size`: xs \| sm \| md \| lg \| xl. `href` renders `<a>` for SEO. `loading` shows spinner. |
| `Field` | `label` — always wraps Input / Textarea / Select |
| `Input` | `size`: sm \| md \| lg. Always inside `<Field>` |
| `Textarea` | Always inside `<Field>` |
| `Select` | Always inside `<Field>` |
| `Checkbox`, `Radio` | Binary and multi-select |
| `Switch` | Toggle |
| `Slider` | Range input |
| `Segmented` | Tab-like option picker |

### Surfaces
| Component | Key Props |
|-----------|-----------|
| `Card` | `variant`: default \| hoverable \| elevated \| inset \| dark \| gradient |
| `CardTitle` | `as` prop for semantic heading tag |
| `CardBody` | `<p>` wrapper |
| `Stat` | `eyebrow`, `value`, `delta`, `deltaType`: positive \| negative \| neutral |
| `StatCard` | Card + Stat combined: `eyebrow`, `value`, `delta`, `deltaType`, `footer` |
| `Badge` | `variant`: default \| success \| warning \| danger \| info \| brand. `size`: sm \| md |
| `Chip` | Removable tag |
| `StatusPill` | Traffic-light status: `status` prop |

### App Shell
| Component | Key Props |
|-----------|-----------|
| `PageHeader` | `title`, `lede` — use at the top of every page |
| `SideNav`, `SideNavGroup`, `SideNavItem` | Sidebar navigation |
| `TopBar` | Top application bar |
| `AppFooter` | Page footer |

### Navigation
| Component | Key Props |
|-----------|-----------|
| `Tabs`, `TabList`, `Tab`, `TabPanel` | Tabbed content |
| `Navbar`, `NavBrand`, `NavLinks`, `NavLink`, `NavActions` | Marketing top nav |
| `Breadcrumbs` | Wayfinding trail |
| `Pagination` | Page navigator |
| `Stepper`, `StepperItem` | Step-by-step flows |
| `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` | Collapsible sections |

### Feedback
| Component | Key Props |
|-----------|-----------|
| `Alert` | `variant`: info \| success \| warning \| danger |
| `Progress` | Linear progress bar |
| `Ring` | Circular progress |
| `Spinner` | Loading indicator. `variant`: brand \| muted. `size`: sm \| md \| lg |
| `Skeleton` | Placeholder shimmer. `variant`: text \| rect \| circle |
| `EmptyState` | Zero-data state. `size`: sm \| md \| lg. `title`, `body`, optional action slot |

### Overlays
| Component | Key Props |
|-----------|-----------|
| `Modal` | `size`: sm \| md \| lg \| xl \| full |
| `Dropdown`, `DropdownTrigger`, `DropdownMenu`, `DropdownItem`, `DropdownSeparator`, `DropdownLabel` | Contextual menus |
| `Tooltip` | Hover hint |

### Data Display
| Component | Key Props |
|-----------|-----------|
| `Table`, `Thead`, `Tbody`, `Tr`, `Th`, `Td` | Sortable data tables |
| `Avatar` | `size`: xs \| sm \| md \| lg \| xl. `variant`: circle \| square. `status` prop |
| `AvatarStack` | Overlapping avatar group |
| `CopyField` | Read-only value + copy button |
| `EditableField` | Inline editable value |
| `DefList`, `DefRow` | Key-value definition lists |

### Brand
| Component | Key Props |
|-----------|-----------|
| `PeakziLogo` | `variant`: color \| white \| navy. `size`: xs \| sm \| md \| lg \| xl |

---

## Design Tokens

**Non-negotiable rule: never hardcode a hex, rgb, or pixel value. Use `var(--token)` exclusively.**

### Semantic Surfaces
```
--bg               page background (white light / dark-navy dark)
--bg-subtle        off-white section fills
--bg-muted         muted fills, disabled areas
--surface-1        cards (white)
--surface-2        raised surfaces
--surface-3        recessed / inset areas
--surface-overlay  modal backdrops
```

### Foreground
```
--fg-1     primary text (navy-800)
--fg-2     secondary text
--fg-3     tertiary / captions
--fg-4     placeholder text
--fg-inverse   text on dark/navy backgrounds
--fg-accent    brand purple
--fg-link      link blue
```

### Borders & Focus
```
--border-subtle    hairlines
--border           standard borders
--border-strong    emphasized borders
--border-focus     purple focus ring color
--ring-focus       purple focus box-shadow (rgba)
--ring-danger      red danger box-shadow (rgba)
```

### Status
```
--success / --success-soft / --success-strong
--warning / --warning-soft / --warning-strong
--danger  / --danger-soft  / --danger-strong
--info    / --info-soft
```

### Brand Gradients (reserved for hero / accent use)
```
--gradient-brand          pink→purple→blue, 135deg  (primary hero)
--gradient-brand-soft     softer tints, same direction
--gradient-brand-vertical purple→blue, 180deg
--gradient-peak           pink→purple→blue, 180deg
--gradient-navy-fade      navy, 180deg
--gradient-dawn           navy→purple→pink, 135deg
```

### Spacing (4px base grid)
```
--space-1  = 4px    --space-2  = 8px    --space-3  = 12px
--space-4  = 16px   --space-5  = 20px   --space-6  = 24px
--space-8  = 32px   --space-10 = 40px   --space-12 = 48px
--space-16 = 64px   --space-20 = 80px   --space-24 = 96px   --space-32 = 128px
```

### Typography Tokens
```
--font-display   Urbanist (headings)
--font-body      Inter (body / UI)
--font-mono      JetBrains Mono (code)

--text-xs   = 12px    --text-sm   = 14px    --text-base = 16px
--text-md   = 18px    --text-lg   = 20px    --text-xl   = 24px
--text-2xl  = 30px    --text-3xl  = 36px    --text-5xl  = 64px

--weight-regular = 400   --weight-medium = 500   --weight-semibold = 600
--weight-bold    = 700   --weight-extrabold = 800
```

### Typography Classes (prefer over raw CSS)
```
.peakzi-h-display   104px Urbanist 800 — hero headlines only
.peakzi-h1          64px  Urbanist 700
.peakzi-h2          36px  Urbanist 700
.peakzi-h3          24px  Urbanist 600
.peakzi-h4          20px  Urbanist 600
.peakzi-eyebrow     12px  Inter 600 uppercase — labels above headings
.peakzi-lede        20px  Inter 400 — intro paragraphs
.peakzi-p           16px  Inter 400 — body copy
.peakzi-small       14px  Inter — captions, helper text
.peakzi-code        JetBrains Mono, muted bg pill
.peakzi-gradient-text   brand gradient via background-clip
```

### Radius
```
--radius-xs = 4px   --radius-sm = 6px   --radius-md = 10px   --radius-lg = 14px
--radius-xl = 20px  --radius-2xl = 28px --radius-full = 9999px
```

### Shadows
```
Standard:  --shadow-xs  --shadow-sm  --shadow-md  --shadow-lg  --shadow-xl  --shadow-2xl
Glow:      --shadow-glow-purple  --shadow-glow-pink  --shadow-glow-brand
Inset:     --shadow-inset  (pressed / input fields)
```

### Motion
```
Duration:  --duration-instant (80ms)  --duration-fast (150ms)  --duration-base (220ms)
           --duration-slow (380ms)    --duration-slower (560ms)
Easing:    --ease-out  --ease-in-out  --ease-spring
```

### Z-index
```
--z-base (1)  --z-dropdown (100)  --z-sticky (200)  --z-modal (1000)  --z-toast (1100)
```

---

## New Component Format

Only create a new component when the inventory above has no suitable match.
Follow this structure exactly — no deviations.

### File structure
```
src/components/[ComponentName]/
  [ComponentName].tsx         functional component + all exported types
  [ComponentName].scss        BEM styles, var() tokens only — no hardcoded values
  [ComponentName].test.tsx    vitest smoke tests
  [ComponentName].stories.tsx Storybook story with Controls + dark/light toggle
  index.ts                    re-exports component + all type names
```

### [ComponentName].tsx pattern
```tsx
import type { HTMLAttributes, ReactNode } from 'react'
import './[ComponentName].scss'

export type [Name]Variant = 'default' | 'elevated'   // extend as needed
export type [Name]Size    = 'sm' | 'md' | 'lg'

export interface [Name]Props extends HTMLAttributes<HTMLDivElement> {
  variant?: [Name]Variant
  size?:    [Name]Size
  children?: ReactNode
}

export function [Name]({ variant = 'default', size = 'md', className, children, ...rest }: [Name]Props) {
  const cls = [
    'pz-[name]',
    `pz-[name]--${variant}`,
    size !== 'md' && `pz-[name]--${size}`,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  )
}

[Name].displayName = '[Name]'
```

### [ComponentName].scss pattern
```scss
.pz-[name] {
  background:    var(--surface-1);
  border:        1px solid var(--border);
  border-radius: var(--radius-md);
  padding:       var(--space-4) var(--space-6);
  color:         var(--fg-1);
  font-family:   var(--font-body);
  transition:    all var(--duration-fast) var(--ease-out);

  &--elevated {
    box-shadow: var(--shadow-md);
  }

  &--sm { padding: var(--space-2) var(--space-3); }
  &--lg { padding: var(--space-5) var(--space-8); }

  &__[element] {
    color: var(--fg-2);
    font-size: var(--text-sm);
  }
}
```

### index.ts pattern
```ts
export { [Name] } from './[Name]'
export type { [Name]Props, [Name]Variant, [Name]Size } from './[Name]'
```

### After scaffolding a new component
Add named exports + type exports to `src/index.ts` under the correct category comment block.
Follow the exact two-line pattern (component export, then type export) already established there.

---

## Non-Negotiable Rules

1. **Tokens only** — `var(--token)` everywhere. No hex, rgb, or hardcoded px in component SCSS or inline page styles.
2. **Existing components first** — exhaust the inventory before scaffolding a new component.
3. **BEM naming** — `.pz-{block}`, `.pz-{block}--{modifier}`, `.pz-{block}__{element}`.
4. **Field wrapping** — Input, Textarea, Select must always be children of `<Field label="...">`.
5. **SEO-first buttons** — `<Button href="...">` for navigation (renders `<a>`). `onClick` only for in-page actions.
6. **Icon button labels** — `<Button variant="icon" aria-label="Close">` — aria-label is required.
7. **Named exports** — no default exports for components. All prop types must be exported.
8. **Inline style for layout only** — use `style={{ gap: 'var(--space-3)' }}` only for layout gaps not covered by a prop. Never for color, typography, or decoration.

---

## Real-World Reference

Correct implementation from `app.peakzi/src/pages/admin-dashboard-v2/accounts/AccountsPage.tsx`:

```tsx
import { PageHeader, Field, Input, Button, EmptyState } from '@peakzi/components';

export default function AccountsPage() {
  return (
    <div>
      <PageHeader
        title="Accounts"
        lede="Search, view, and manage customer accounts by user email or account ID."
      />

      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end', marginTop: 'var(--space-6)' }}>
        <Field label="User email or account ID" style={{ flex: 1 }}>
          <Input
            value={inputUserId}
            onChange={(e) => setInputUserId(e.target.value)}
            placeholder="user@example.com or account ID"
          />
        </Field>
        <Button variant="primary" onClick={() => void fetchAccountList()} loading={isFetchingAccountList}>
          Search
        </Button>
      </div>

      <div style={{ marginTop: 'var(--space-6)' }}>
        {accountListError ? (
          <EmptyState size="sm" title="Failed to load accounts" body="There was an error fetching account data." />
        ) : (
          <AccountList ... />
        )}
      </div>
    </div>
  );
}
```

Patterns to note:
- `PageHeader` is always the first element of a page
- `Field` wraps `Input` — never Input standalone
- Layout spacing uses `var(--space-N)` in inline style, never `px` values
- `Button loading={bool}` handles the spinner — never roll your own
- `EmptyState` handles all zero/error states — never a raw `<p>No results</p>`
