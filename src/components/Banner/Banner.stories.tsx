import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Banner } from './Banner'
import { Button } from '../Button'

const meta: Meta<typeof Banner> = {
  title: 'Components/Feedback/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Full-width notification strips. Use `variant` for tone, `size` for density, and `position` ' +
          'for inline flow vs. fixed viewport anchoring (`top` / `bottom`). ' +
          'Add `dismissible` + `onDismiss` for user-closeable banners, and `action` for a trailing CTA.',
      },
    },
    layout: 'padded',
  },
  argTypes: {
    variant:  { control: 'select', options: ['info', 'success', 'warning', 'danger', 'brand', 'neutral'] },
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    position: { control: 'select', options: ['inline', 'top', 'bottom'] },
  },
}

export default meta
type Story = StoryObj<typeof Banner>

// ---------------------------------------------------------------------------
// Playground (default — driven by Storybook controls)
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    variant: 'info',
    size: 'md',
    position: 'inline',
    title: 'Scheduled maintenance',
    children: 'The platform will be unavailable on Sunday, 15 Jun from 02:00–04:00 UTC.',
    dismissible: true,
  },
}

// ---------------------------------------------------------------------------
// All variants
// ---------------------------------------------------------------------------

export const Variants: Story = {
  name: 'Variants',
  parameters: {
    docs: {
      description: { story: 'All six tone variants. Neutral has no default icon.' },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Banner variant="info">
        Your free trial expires in <strong>3 days</strong>. Upgrade to keep access.
      </Banner>
      <Banner variant="success" title="Payment received">
        Invoice #1042 has been paid. A receipt was sent to billing@company.com.
      </Banner>
      <Banner variant="warning" title="API key expiring soon">
        Your production API key expires on 30 Jun 2026. Rotate it before then.
      </Banner>
      <Banner variant="danger" title="Service disruption">
        Outbound email delivery is currently impaired. Our team is investigating.
      </Banner>
      <Banner variant="brand" title="New: AI Website Builder">
        Generate a fully branded site in minutes — now available for all plans.
      </Banner>
      <Banner variant="neutral">
        Read-only mode is active. Contact your admin to request edit access.
      </Banner>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------

export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Banner variant="brand" size="sm">
        Compact — sm: great for persistent notices that should not dominate the page.
      </Banner>
      <Banner variant="brand">
        Standard — md: the default size for most use cases.
      </Banner>
      <Banner variant="brand" size="lg" title="Large announcement">
        Prominent — lg: use for high-priority announcements or hero-style notices.
      </Banner>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Dismissible
// ---------------------------------------------------------------------------

export const Dismissible: Story = {
  name: 'Dismissible',
  parameters: {
    docs: {
      description: {
        story: 'Pass `dismissible` + `onDismiss` to show the × button. The consumer controls visibility.',
      },
    },
  },
  render: function DismissibleStory() {
    const [visible, setVisible] = useState(true)
    return visible ? (
      <Banner
        variant="warning"
        title="Unsaved changes"
        dismissible
        onDismiss={() => setVisible(false)}
      >
        You have unsaved changes. They will be lost if you navigate away.
      </Banner>
    ) : (
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
        <span style={{ color: 'var(--fg-3)', fontSize: 'var(--text-sm)' }}>Banner dismissed.</span>
        <Button variant="ghost" size="sm" onClick={() => setVisible(true)}>Reset</Button>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// With action
// ---------------------------------------------------------------------------

export const WithAction: Story = {
  name: 'With action',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Banner
        variant="info"
        title="New version available"
        action={<Button variant="secondary" size="sm">Update now</Button>}
      >
        v3.15.0 is ready with bug fixes and performance improvements.
      </Banner>
      <Banner
        variant="brand"
        title="Upgrade to Pro"
        action={<Button variant="primary" size="sm">Get started</Button>}
        dismissible
      >
        Unlock advanced analytics, priority support, and unlimited seats.
      </Banner>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Without icon
// ---------------------------------------------------------------------------

export const NoIcon: Story = {
  name: 'Without icon',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Banner variant="info" icon={null}>
        Icon suppressed — pass <code>icon={'{null}'}</code> to hide the default icon.
      </Banner>
      <Banner variant="success" icon={null} title="Done">
        All records exported successfully.
      </Banner>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Position — top (fixed to iframe top)
// ---------------------------------------------------------------------------

export const PositionTop: Story = {
  name: 'Position — top (fixed)',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          '`position="top"` fixes the banner to the top of the viewport with `z-index: var(--z-sticky)`. ' +
          'In production, render it as the very first child of `<body>` or your app shell.',
      },
    },
  },
  render: function TopStory() {
    const [visible, setVisible] = useState(true)
    return (
      <div style={{ minHeight: 300, paddingTop: visible ? 52 : 0, boxSizing: 'border-box' }}>
        {visible && (
          <Banner
            variant="warning"
            size="sm"
            position="top"
            title="Maintenance window:"
            dismissible
            onDismiss={() => setVisible(false)}
          >
            Sunday 15 Jun 02:00–04:00 UTC — the platform will be read-only.
          </Banner>
        )}
        <div style={{ padding: 24, color: 'var(--fg-3)', fontSize: 13 }}>
          {visible ? 'Page content pushed down by top banner.' : 'Banner dismissed — no layout shift.'}
        </div>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Position — bottom (fixed to iframe bottom)
// ---------------------------------------------------------------------------

export const PositionBottom: Story = {
  name: 'Position — bottom (fixed)',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: '`position="bottom"` fixes the banner to the bottom of the viewport.',
      },
    },
  },
  render: function BottomStory() {
    const [visible, setVisible] = useState(true)
    return (
      <div style={{ minHeight: 300, paddingBottom: visible ? 52 : 0, boxSizing: 'border-box' }}>
        <div style={{ padding: 24, color: 'var(--fg-3)', fontSize: 13 }}>
          {visible
            ? 'Scroll to the bottom of the frame to see the fixed banner.'
            : 'Banner dismissed.'}
        </div>
        {visible && (
          <Banner
            variant="brand"
            size="sm"
            position="bottom"
            title="Cookie notice:"
            dismissible
            onDismiss={() => setVisible(false)}
            action={<Button variant="primary" size="sm">Accept all</Button>}
          >
            We use cookies to improve your experience.
          </Banner>
        )}
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// All sizes × positions matrix
// ---------------------------------------------------------------------------

export const Matrix: Story = {
  name: 'Size × Variant matrix',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {(['info', 'success', 'warning', 'danger', 'brand', 'neutral'] as const).map((v) => (
        <div key={v} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {v}
          </span>
          <Banner variant={v} size="sm">Small — {v}</Banner>
          <Banner variant={v} size="md">Medium — {v}</Banner>
          <Banner variant={v} size="lg" title="Large banner">Content for the {v} large variant.</Banner>
        </div>
      ))}
    </div>
  ),
}
