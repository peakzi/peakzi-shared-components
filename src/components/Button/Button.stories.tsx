import type { Meta, StoryObj } from '@storybook/react'
import { Search, X, ArrowRight, Download } from 'lucide-react'
import { Button } from './Button'

// =============================================================================
// Meta
// =============================================================================

const meta: Meta<typeof Button> = {
  title: 'Components/Inputs/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The **Button** is the primary interactive element in the Peakzi design system.

### Design rules
- Use **one** \`primary\` or \`gradient\` button per view — they signal the most important action.
- Use \`secondary\`, \`ghost\`, or \`link\` for all other actions.
- Always sentence case. No exclamation marks.

### SEO rule
Pass \`href\` for navigation — it renders a semantic \`<a>\` that search engine crawlers can follow.
\`onClick\`-only buttons are invisible to bots.

### Accessibility rule
Icon-only buttons (\`variant="icon"\`) **must** have an \`aria-label\`.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'gradient', 'secondary', 'ghost', 'link', 'danger', 'success', 'icon'],
      description: 'Visual style of the button',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Button size',
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    block: { control: 'boolean' },
    href: { control: 'text', description: 'Renders as <a href> when provided' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// =============================================================================
// Playground — fully interactive via Controls panel
// =============================================================================

export const Playground: Story = {
  args: {
    children: 'Get started',
    variant: 'primary',
    size: 'md',
  },
}

// =============================================================================
// Variants
// =============================================================================

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="gradient">Gradient</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="success">Success</Button>
      <Button variant="icon" aria-label="Close"><X size={16} /></Button>
    </div>
  ),
}

// =============================================================================
// Sizes
// =============================================================================

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium (default)</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra large</Button>
    </div>
  ),
}

// =============================================================================
// States
// =============================================================================

export const Loading: Story = {
  args: { loading: true, children: 'Saving changes…' },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Unavailable' },
}

export const Block: Story = {
  args: { block: true, children: 'Full width button', variant: 'primary' },
  decorators: [(Story) => <div style={{ maxWidth: '320px' }}><Story /></div>],
}

// =============================================================================
// SEO — Navigation as <a>
// =============================================================================

export const AsLink: Story = {
  name: 'As link (SEO-safe navigation)',
  args: {
    href: '/pricing',
    children: 'View pricing',
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Renders as `<a href="/pricing">` — crawlable by Google.',
      },
    },
  },
}

export const ExternalLink: Story = {
  name: 'External link',
  args: {
    href: 'https://peakzi.com',
    target: '_blank',
    children: 'Open Peakzi',
    variant: 'secondary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Auto-adds `rel="noopener noreferrer"` when `target="_blank"` is set.',
      },
    },
  },
}

// =============================================================================
// With icons (Lucide)
// =============================================================================

export const WithIcons: Story = {
  name: 'With icons',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <Button variant="primary">
        <Search size={14} aria-hidden="true" />
        Search
      </Button>
      <Button variant="secondary">
        Download
        <Download size={14} aria-hidden="true" />
      </Button>
      <Button variant="gradient">
        Get started
        <ArrowRight size={14} aria-hidden="true" />
      </Button>
    </div>
  ),
}

// =============================================================================
// Icon-only
// =============================================================================

export const IconOnly: Story = {
  name: 'Icon only (requires aria-label)',
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Button variant="icon" aria-label="Close"><X size={16} /></Button>
      <Button variant="icon" size="sm" aria-label="Search"><Search size={14} /></Button>
      <Button variant="icon" size="lg" aria-label="Download"><Download size={18} /></Button>
    </div>
  ),
}

// =============================================================================
// Gradient — hero CTAs only
// =============================================================================

export const Gradient: Story = {
  args: {
    variant: 'gradient',
    size: 'lg',
    children: 'Start free trial',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Use at most **once** per page — the most prominent action.',
      },
    },
  },
}
