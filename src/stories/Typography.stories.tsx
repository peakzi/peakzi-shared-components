import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Foundation/Typography',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Peakzi type system: three font families, a modular scale (10px–104px), and semantic CSS classes. Use **`--font-display`** (Urbanist) for headings, **`--font-body`** (Inter) for UI and body copy, **`--font-mono`** (JetBrains Mono) for code and numeric data.',
      },
    },
  },
}
export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

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

function FontFamilyCard({
  name,
  token,
  variable,
  weights,
  sample,
}: {
  name: string
  token: string
  variable: string
  weights: number[]
  sample: string
}) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        background: 'var(--surface-1)',
        flex: '1 1 280px',
        minWidth: 0,
      }}
    >
      <div style={{ marginBottom: 4, fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--fg-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {token}
      </div>
      <div style={{ fontFamily: variable, fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--fg-1)', marginBottom: 4 }}>
        {name}
      </div>
      <div style={{ fontFamily: variable, fontSize: 'var(--text-sm)', color: 'var(--fg-3)', marginBottom: 16 }}>
        {sample}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {weights.map((w) => (
          <span
            key={w}
            style={{
              fontFamily: variable,
              fontWeight: w,
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-2)',
              padding: '2px 8px',
              background: 'var(--bg-muted)',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** The three brand font families and their available weights. Check the Network tab in DevTools to confirm Google Fonts loaded correctly. */
export const FontFamilies: Story = {
  name: 'Font families',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeading>Font Families</SectionHeading>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <FontFamilyCard
          name="Urbanist"
          token="--font-display"
          variable="'Urbanist', sans-serif"
          weights={[400, 500, 600, 700, 800, 900]}
          sample="Headlines, hero text, brand voice"
        />
        <FontFamilyCard
          name="Inter"
          token="--font-body"
          variable="'Inter', sans-serif"
          weights={[400, 500, 600, 700]}
          sample="Body copy, UI labels, form fields"
        />
        <FontFamilyCard
          name="JetBrains Mono"
          token="--font-mono"
          variable="'JetBrains Mono', monospace"
          weights={[400, 500, 600]}
          sample="Code snippets, numeric data, tokens"
        />
      </div>
      <div
        style={{
          padding: 16,
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--fg-2)',
        }}
      >
        <strong style={{ color: 'var(--fg-1)' }}>Note:</strong> Fonts are loaded via{' '}
        <code style={{ fontFamily: 'var(--font-mono)' }}>.storybook/preview-head.html</code> using{' '}
        <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;link&gt;</code> tags. If text looks like a system font, check the
        Network tab in DevTools — Google Fonts requests should be returning 200.
      </div>
    </div>
  ),
}

/** Full modular type scale from 10px (text-3xs) to 104px (text-7xl). */
export const TypeScale: Story = {
  name: 'Type scale',
  render: () => {
    const steps: { token: string; value: string }[] = [
      { token: '--text-3xs', value: '10px' },
      { token: '--text-2xs', value: '11px' },
      { token: '--text-xs', value: '12px' },
      { token: '--text-sm', value: '14px' },
      { token: '--text-base', value: '16px' },
      { token: '--text-md', value: '18px' },
      { token: '--text-lg', value: '20px' },
      { token: '--text-xl', value: '24px' },
      { token: '--text-2xl', value: '30px' },
      { token: '--text-3xl', value: '36px' },
      { token: '--text-4xl', value: '48px' },
      { token: '--text-5xl', value: '64px' },
      { token: '--text-6xl', value: '80px' },
      { token: '--text-7xl', value: '104px' },
    ]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <SectionHeading>Type Scale — Modular 1.25×</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {steps.map(({ token, value }) => (
            <div key={token} style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
              <div
                style={{
                  minWidth: 100,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--fg-3)',
                  flexShrink: 0,
                }}
              >
                {token}
              </div>
              <div
                style={{
                  minWidth: 36,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--fg-4)',
                  flexShrink: 0,
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: `var(${token})`,
                  fontWeight: 600,
                  color: 'var(--fg-1)',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                Peakzi
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

/** Semantic typography classes — copy the class name and apply it to any element. */
export const TypographyClasses: Story = {
  name: 'Typography classes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeading>Semantic Typography Classes</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>.peakzi-h-display</span>
          <p className="peakzi-h-display" style={{ margin: 0 }}>Display</p>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--font-body)' }}>Urbanist 800 · 104px · tracking −0.04em</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>.peakzi-h1</span>
          <p className="peakzi-h1" style={{ margin: 0 }}>Heading 1</p>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--font-body)' }}>Urbanist 700 · 64px · tracking −0.02em</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>.peakzi-h2</span>
          <p className="peakzi-h2" style={{ margin: 0 }}>Heading 2</p>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--font-body)' }}>Urbanist 700 · 36px · tracking −0.01em</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>.peakzi-h3</span>
          <p className="peakzi-h3" style={{ margin: 0 }}>Heading 3</p>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--font-body)' }}>Urbanist 600 · 24px</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>.peakzi-h4</span>
          <p className="peakzi-h4" style={{ margin: 0 }}>Heading 4</p>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--font-body)' }}>Urbanist 600 · 20px</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>.peakzi-eyebrow</span>
          <p className="peakzi-eyebrow" style={{ margin: 0 }}>Eyebrow label</p>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--font-body)' }}>Inter 600 · 12px uppercase · tracking 0.16em · accent colour</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>.peakzi-lede</span>
          <p className="peakzi-lede" style={{ margin: 0 }}>
            AI mentions your business in 14 search answers this week — up 23% from last week.
          </p>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--font-body)' }}>Inter 400 · 20px · leading 1.65</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>.peakzi-p</span>
          <p className="peakzi-p" style={{ margin: 0 }}>
            Track where AI systems cite your business and optimise your profile to appear in more AI-generated answers across ChatGPT, Perplexity, and Google AI Overviews.
          </p>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--font-body)' }}>Inter 400 · 16px · leading 1.65</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>.peakzi-small</span>
          <p className="peakzi-small" style={{ margin: 0 }}>Helper text, captions, and fine print.</p>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--font-body)' }}>Inter · 14px · leading 1.5</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>.peakzi-code</span>
          <p style={{ margin: 0 }}>Inline usage: set <code className="peakzi-code">data-theme=&quot;dark&quot;</code> on the root element.</p>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--font-body)' }}>JetBrains Mono · 0.9em · muted background</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>.peakzi-gradient-text</span>
          <p
            className="peakzi-gradient-text peakzi-h2"
            style={{ margin: 0 }}
          >
            AI Visibility
          </p>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--font-body)' }}>Brand gradient clipped to text — use on max 1 word per composition</span>
        </div>

      </div>
    </div>
  ),
}

/** Font weights available across the three brand families. */
export const FontWeights: Story = {
  name: 'Font weights',
  render: () => {
    const weights: { token: string; value: number }[] = [
      { token: '--weight-regular', value: 400 },
      { token: '--weight-medium', value: 500 },
      { token: '--weight-semibold', value: 600 },
      { token: '--weight-bold', value: 700 },
      { token: '--weight-extrabold', value: 800 },
      { token: '--weight-black', value: 900 },
    ]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <SectionHeading>Font Weights</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {weights.map(({ token, value }) => (
            <div
              key={token}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '8px 0',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ minWidth: 160, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>
                {token}
              </div>
              <div style={{ minWidth: 36, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-4)' }}>
                {value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: value,
                  fontSize: 'var(--text-lg)',
                  color: 'var(--fg-1)',
                }}
              >
                Peakzi AI Visibility
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

/**
 * Raw HTML elements styled automatically — no class names needed.
 * These styles activate the moment `data-theme` is set on `<html>`,
 * which every consuming repo already does for dark/light mode.
 * Write plain `<h2>` in any repo and it looks identical to this.
 */
export const HtmlElements: Story = {
  name: 'HTML elements (automatic)',
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <div
        style={{
          marginBottom: 24,
          padding: '10px 14px',
          background: 'var(--info-soft)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 13,
          color: 'var(--fg-2)',
          fontFamily: 'var(--font-body)',
          borderLeft: '3px solid var(--info)',
        }}
      >
        Every element below uses <strong>zero class names</strong>. Styles come from{' '}
        <code>_elements.scss</code> scoped to <code>[data-theme]</code> on{' '}
        <code>&lt;html&gt;</code>.
      </div>

      <h1>Heading 1 — Urbanist 700, 64px</h1>
      <h2>Heading 2 — Urbanist 700, 36px</h2>
      <h3>Heading 3 — Urbanist 600, 24px</h3>
      <h4>Heading 4 — Urbanist 600, 20px</h4>
      <h5>Heading 5 — Urbanist 600, 16px</h5>
      <h6>Heading 6 — Inter 600, 14px uppercase</h6>

      <p>
        This is a paragraph using Inter 400 at 16px with relaxed line-height.{' '}
        <a href="#">Links use --fg-link</a> and show an underline on hover.{' '}
        <strong>Bold text uses --weight-semibold.</strong>{' '}
        <em>Italic text is styled naturally.</em>{' '}
        <small>Small text sits at 14px in --fg-3.</small>
      </p>

      <p>
        Inline <code>code</code> gets JetBrains Mono with a muted pill background.
        A full block of code goes in a <code>pre</code>:
      </p>

      <pre><code>{`import '@peakzi/components/styles'
document.documentElement.setAttribute('data-theme', 'light')`}</code></pre>

      <p>Unordered list:</p>
      <ul>
        <li>AI citations tracked across ChatGPT, Perplexity, and Google AI Overviews</li>
        <li>Weekly visibility score with delta vs previous period</li>
        <li>Competitor benchmarking and gap analysis</li>
      </ul>

      <p>Ordered list:</p>
      <ol>
        <li>Import the stylesheet once at your app root</li>
        <li>Set <code>data-theme</code> on <code>&lt;html&gt;</code></li>
        <li>Write plain HTML — styles apply automatically</li>
      </ol>

      <hr />

      <blockquote>
        Peakzi helped us appear in 3× more AI-generated answers within 30 days.
      </blockquote>
    </div>
  ),
}

/** All letter-spacing tokens. */
export const LetterSpacing: Story = {
  name: 'Letter spacing',
  render: () => {
    const steps: { token: string; value: string }[] = [
      { token: '--tracking-tightest', value: '−0.04em' },
      { token: '--tracking-tighter', value: '−0.02em' },
      { token: '--tracking-tight', value: '−0.01em' },
      { token: '--tracking-normal', value: '0' },
      { token: '--tracking-wide', value: '0.02em' },
      { token: '--tracking-wider', value: '0.08em' },
      { token: '--tracking-widest', value: '0.16em' },
    ]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <SectionHeading>Letter Spacing</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {steps.map(({ token, value }) => (
            <div
              key={token}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '8px 0',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ minWidth: 176, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>
                {token}
              </div>
              <div style={{ minWidth: 56, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-4)' }}>
                {value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 'var(--text-base)',
                  color: 'var(--fg-1)',
                  letterSpacing: `var(${token})`,
                  textTransform: token.includes('wider') ? 'uppercase' : undefined,
                }}
              >
                PEAKZI
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
}
