import React from 'react'
import { addons, types, useChannel, useStorybookApi } from 'storybook/manager-api'

// ── JSX generator ────────────────────────────────────────────────────────────

function formatValue(value: unknown): string {
  if (typeof value === 'string') return `"${value}"`
  if (typeof value === 'number') return `{${value}}`
  if (value === false) return `{false}`
  if (Array.isArray(value)) return `{${JSON.stringify(value)}}`
  if (typeof value === 'object' && value !== null) return `{${JSON.stringify(value)}}`
  return `{${String(value)}}`
}

function generateJSX(
  componentName: string,
  args: Record<string, unknown>
): string {
  const children = typeof args['children'] === 'string' ? (args['children'] as string) : null

  const props = Object.entries(args)
    .filter(([key, value]) => key !== 'children' && value !== undefined && value !== null)
    .map(([key, value]) =>
      value === true ? `  ${key}` : `  ${key}=${formatValue(value)}`
    )

  if (props.length === 0 && !children) return `<${componentName} />`
  if (props.length === 0) return `<${componentName}>${children}</${componentName}>`

  const propsBlock = props.join('\n')
  if (children) {
    return `<${componentName}\n${propsBlock}\n>\n  ${children}\n</${componentName}>`
  }
  return `<${componentName}\n${propsBlock}\n/>`
}

/** Extract the last segment of a story title, e.g. "Brand/PeakziLogo" → "PeakziLogo" */
function nameFromTitle(title: string | undefined): string {
  // Use || not ?? — handles both undefined AND empty-string gracefully
  return (title || '').split('/').pop() || 'Component'
}

// ── Panel component ──────────────────────────────────────────────────────────

function SourcePanel() {
  const api = useStorybookApi()
  const [componentName, setComponentName] = React.useState('Component')
  const [args, setArgs] = React.useState<Record<string, unknown>>({})
  const [copied, setCopied] = React.useState(false)

  // Seed state when this panel first mounts (story may already be prepared)
  React.useEffect(() => {
    const story = api.getCurrentStoryData()
    if (!story) return
    setComponentName(nameFromTitle(story.title))
    if ('args' in story) {
      setArgs((story.args ?? {}) as Record<string, unknown>)
    }
  }, [api])

  useChannel({
    // Fires when a story finishes preparing — carries title + initial args
    storyPrepared: (story: { title?: string; args?: Record<string, unknown> }) => {
      setComponentName(nameFromTitle(story.title))
      setArgs(story.args ?? {})
    },

    // Fires when the user changes a control
    storyArgsUpdated: ({ args: newArgs }: { args: Record<string, unknown> }) => {
      setArgs(newArgs)
    },

    // Fires when navigating to a different story in the sidebar
    storyChanged: () => {
      const story = api.getCurrentStoryData()
      setComponentName(nameFromTitle(story?.title))
      setArgs({}) // clear until storyPrepared fires with the new story's args
    },

    // Fires once the preview has actually rendered — last-resort sync
    storyRendered: () => {
      const story = api.getCurrentStoryData()
      if (story?.title) setComponentName(nameFromTitle(story.title))
    },
  })

  const source = generateJSX(componentName, args)

  const handleCopy = () => {
    void navigator.clipboard.writeText(source).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: '6px 12px',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          background: 'var(--sb-content-bg, #fff)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={handleCopy}
          style={{
            padding: '4px 12px',
            fontSize: 12,
            fontWeight: 500,
            border: '1px solid rgba(0,0,0,0.15)',
            borderRadius: 4,
            cursor: 'pointer',
            background: copied ? '#22c55e' : '#fff',
            color: copied ? '#fff' : '#333',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Source code */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          background: '#0d1117',
          padding: '16px',
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace",
            fontSize: 12.5,
            color: '#e6edf3',
            lineHeight: 1.7,
            whiteSpace: 'pre',
            tabSize: 2,
          }}
        >
          {source}
        </pre>
      </div>
    </div>
  )
}

// ── Register ─────────────────────────────────────────────────────────────────

addons.register('peakzi/source', () => {
  addons.add('peakzi/source/panel', {
    type: types.PANEL,
    title: 'Source',
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => (active ? <SourcePanel /> : null),
  })
})
