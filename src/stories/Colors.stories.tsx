import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Foundation/Colors',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'All Peakzi brand primitives and semantic tokens. Components must only reference **semantic tokens** (`--bg`, `--fg-1`, `--border`, etc.) — never raw hex values. Semantic tokens swap automatically between light and dark mode.',
      },
    },
  },
}
export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Shared swatch helpers
// ---------------------------------------------------------------------------

interface SwatchProps {
  label: string
  variable: string
  value: string
}

function Swatch({ label, variable, value }: SwatchProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        style={{
          background: `var(${variable}, ${value})`,
          width: 80,
          height: 56,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)',
        }}
      />
      <div style={{ fontSize: 11, lineHeight: 1.4, color: 'var(--fg-2)', fontFamily: 'var(--font-body)' }}>
        <div style={{ fontWeight: 600, color: 'var(--fg-1)' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>{variable}</div>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-4)' }}>{value}</div>
      </div>
    </div>
  )
}

interface GradientSwatchProps {
  label: string
  variable: string
  value: string
}

function GradientSwatch({ label, variable, value }: GradientSwatchProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        style={{
          background: `var(${variable})`,
          width: 160,
          height: 56,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)',
        }}
      />
      <div style={{ fontSize: 11, lineHeight: 1.4, fontFamily: 'var(--font-body)' }}>
        <div style={{ fontWeight: 600, color: 'var(--fg-1)' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>{variable}</div>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-4)', wordBreak: 'break-all' }}>{value}</div>
      </div>
    </div>
  )
}

interface SemanticSwatchProps {
  variable: string
  description: string
}

function SemanticSwatch({ variable, description }: SemanticSwatchProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
        background: 'var(--surface-1)',
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-sm)',
          background: `var(${variable})`,
          border: '1px solid var(--border)',
        }}
      />
      <div style={{ fontSize: 12, fontFamily: 'var(--font-body)', minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--fg-1)' }}>{variable}</div>
        <div style={{ color: 'var(--fg-3)', marginTop: 1 }}>{description}</div>
      </div>
    </div>
  )
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h3
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-lg)',
        color: 'var(--fg-1)',
        marginBottom: 16,
        marginTop: 0,
        paddingBottom: 8,
        borderBottom: '1px solid var(--border)',
      }}
    >
      {children}
    </h3>
  )
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Peakzi brand navy palette — from deep near-black to faint tint. */
export const NavyPalette: Story = {
  name: 'Navy palette',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeading>Brand Primitives — Navy</SectionHeading>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        <Swatch label="Navy 950" variable="--peakzi-navy-950" value="#0c0b2e" />
        <Swatch label="Navy 900" variable="--peakzi-navy-900" value="#14133f" />
        <Swatch label="Navy 800" variable="--peakzi-navy-800" value="#1f1e5a" />
        <Swatch label="Navy 700" variable="--peakzi-navy-700" value="#2a2972" />
        <Swatch label="Navy 600" variable="--peakzi-navy-600" value="#3b3a8e" />
        <Swatch label="Navy 500" variable="--peakzi-navy-500" value="#5a59b5" />
        <Swatch label="Navy 300" variable="--peakzi-navy-300" value="#a6a5d6" />
        <Swatch label="Navy 100" variable="--peakzi-navy-100" value="#e6e6f5" />
      </div>
    </div>
  ),
}

/** The gradient spectrum — pink → purple → blue — the "Peak" colour range. */
export const GradientSpectrum: Story = {
  name: 'Gradient spectrum',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeading>Brand Primitives — Gradient Spectrum</SectionHeading>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        <Swatch label="Pink" variable="--peakzi-pink" value="#eb55ff" />
        <Swatch label="Pink soft" variable="--peakzi-pink-soft" value="#f78fff" />
        <Swatch label="Purple" variable="--peakzi-purple" value="#a070f0" />
        <Swatch label="Purple soft" variable="--peakzi-purple-soft" value="#c29bf5" />
        <Swatch label="Blue" variable="--peakzi-blue" value="#7080f0" />
        <Swatch label="Blue deep" variable="--peakzi-blue-deep" value="#5a7bff" />
        <Swatch label="Blue soft" variable="--peakzi-blue-soft" value="#9ba8f5" />
      </div>
    </div>
  ),
}

/** Canonical gradient definitions used in button variants, card backgrounds, and text. */
export const Gradients: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeading>Canonical Gradients</SectionHeading>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        <GradientSwatch
          label="Brand"
          variable="--gradient-brand"
          value="linear-gradient(135deg, #eb55ff 0%, #a070f0 50%, #7080f0 100%)"
        />
        <GradientSwatch
          label="Brand soft"
          variable="--gradient-brand-soft"
          value="linear-gradient(135deg, #f78fff 0%, #c29bf5 50%, #9ba8f5 100%)"
        />
        <GradientSwatch
          label="Brand vertical"
          variable="--gradient-brand-vertical"
          value="linear-gradient(180deg, #a070f0 0%, #7080f0 100%)"
        />
        <GradientSwatch
          label="Peak"
          variable="--gradient-peak"
          value="linear-gradient(180deg, #eb55ff 0%, #a070f0 55%, #7080f0 100%)"
        />
        <GradientSwatch
          label="Navy fade"
          variable="--gradient-navy-fade"
          value="linear-gradient(180deg, #1f1e5a 0%, #0c0b2e 100%)"
        />
        <GradientSwatch
          label="Dawn"
          variable="--gradient-dawn"
          value="linear-gradient(135deg, #1f1e5a 0%, #a070f0 80%, #eb55ff 100%)"
        />
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', fontFamily: 'var(--font-body)' }}>
          Gradient text usage
        </div>
        <p
          className="peakzi-gradient-text"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-4xl)', lineHeight: 1, margin: 0 }}
        >
          Peakzi
        </p>
      </div>
    </div>
  ),
}

/** Cool neutral palette with slight navy undertone to harmonise with brand colours. */
export const Neutrals: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeading>Neutrals</SectionHeading>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        <Swatch label="0" variable="--neutral-0" value="#ffffff" />
        <Swatch label="25" variable="--neutral-25" value="#fafafc" />
        <Swatch label="50" variable="--neutral-50" value="#f5f5f9" />
        <Swatch label="100" variable="--neutral-100" value="#ededf3" />
        <Swatch label="200" variable="--neutral-200" value="#d9d9e3" />
        <Swatch label="300" variable="--neutral-300" value="#bcbccc" />
        <Swatch label="400" variable="--neutral-400" value="#9494a8" />
        <Swatch label="500" variable="--neutral-500" value="#6e6e84" />
        <Swatch label="600" variable="--neutral-600" value="#52526a" />
        <Swatch label="700" variable="--neutral-700" value="#393950" />
        <Swatch label="800" variable="--neutral-800" value="#23233a" />
        <Swatch label="900" variable="--neutral-900" value="#131327" />
        <Swatch label="1000" variable="--neutral-1000" value="#000000" />
      </div>
    </div>
  ),
}

/** Status and feedback colours for alerts, badges, form validation, and toasts. */
export const StatusColors: Story = {
  name: 'Status colors',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeading>Status / Feedback Colors</SectionHeading>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Swatch label="Success" variable="--success" value="#17b26a" />
          <Swatch label="Success soft" variable="--success-soft" value="#dcfae8" />
          <Swatch label="Success strong" variable="--success-strong" value="#0e7e49" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Swatch label="Warning" variable="--warning" value="#f79009" />
          <Swatch label="Warning soft" variable="--warning-soft" value="#fef0c7" />
          <Swatch label="Warning strong" variable="--warning-strong" value="#b54708" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Swatch label="Danger" variable="--danger" value="#f04438" />
          <Swatch label="Danger soft" variable="--danger-soft" value="#fee4e2" />
          <Swatch label="Danger strong" variable="--danger-strong" value="#b42318" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Swatch label="Info" variable="--info" value="#7080f0" />
          <Swatch label="Info soft" variable="--info-soft" value="#e6e9fc" />
        </div>
      </div>
    </div>
  ),
}

/** Semantic background tokens — swap automatically between light and dark theme. Toggle the theme to see them change. */
export const SemanticBackgrounds: Story = {
  name: 'Semantic — Backgrounds',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeading>Semantic Tokens — Backgrounds &amp; Surfaces</SectionHeading>
      <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--fg-3)', fontFamily: 'var(--font-body)' }}>
        Toggle the theme in the toolbar above to see how these tokens swap between light and dark mode.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 440 }}>
        <SemanticSwatch variable="--bg" description="Page background" />
        <SemanticSwatch variable="--bg-subtle" description="Faint page tint" />
        <SemanticSwatch variable="--bg-muted" description="Muted / disabled fill" />
        <SemanticSwatch variable="--bg-inverse" description="Inverse (navy in light; white in dark)" />
        <SemanticSwatch variable="--surface-1" description="Card / panel base" />
        <SemanticSwatch variable="--surface-2" description="Raised surface" />
        <SemanticSwatch variable="--surface-3" description="Recessed / inset surface" />
      </div>
    </div>
  ),
}

/** Semantic foreground tokens — swap automatically between light and dark theme. */
export const SemanticForeground: Story = {
  name: 'Semantic — Foreground',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeading>Semantic Tokens — Foreground &amp; Borders</SectionHeading>
      <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--fg-3)', fontFamily: 'var(--font-body)' }}>
        Foreground tokens control text and icon colours. Border tokens control strokes and dividers.
      </p>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 8, fontFamily: 'var(--font-body)' }}>Foreground</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 440 }}>
          <SemanticSwatch variable="--fg-1" description="Primary text" />
          <SemanticSwatch variable="--fg-2" description="Secondary text" />
          <SemanticSwatch variable="--fg-3" description="Tertiary / helper text" />
          <SemanticSwatch variable="--fg-4" description="Placeholder text" />
          <SemanticSwatch variable="--fg-inverse" description="Text on inverse (dark) surface" />
          <SemanticSwatch variable="--fg-accent" description="Brand accent (purple)" />
          <SemanticSwatch variable="--fg-link" description="Link colour (blue-deep)" />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 8, fontFamily: 'var(--font-body)' }}>Borders</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 440 }}>
          <SemanticSwatch variable="--border-subtle" description="Hairline dividers" />
          <SemanticSwatch variable="--border" description="Default border" />
          <SemanticSwatch variable="--border-strong" description="Emphasis border" />
          <SemanticSwatch variable="--border-focus" description="Focus ring (purple, same in both modes)" />
        </div>
      </div>
    </div>
  ),
}
