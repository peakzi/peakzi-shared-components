import type { Preview, Decorator } from '@storybook/react'
import '../src/styles/index.scss'

/**
 * Global Storybook preview configuration.
 *
 * Theme toggle: Click the moon/sun icon in the Storybook toolbar to switch between
 * light and dark mode. This sets [data-theme] on <html>, which triggers the
 * CSS semantic token swap defined in src/styles/_dark.scss.
 *
 * Accessibility: The a11y panel (Shift+A) shows violations. All components must
 * pass a11y checks before being exported from this library.
 */

/** Apply [data-theme] to <html> so CSS semantic tokens swap correctly */
const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals['theme'] as string | undefined) ?? 'light'
  document.documentElement.setAttribute('data-theme', theme)

  const isFullscreen = context.parameters['layout'] === 'fullscreen'

  return (
    <div
      className="peakzi-base"
      style={{
        padding: isFullscreen ? 0 : '2rem',
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--fg)',
      }}
    >
      <Story />
    </div>
  )
}

const preview: Preview = {
  decorators: [withTheme],

  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Toggle light / dark mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    // Sidebar group order — most foundational / frequently used first
    options: {
      storySort: {
        order: [
          'Foundation',  // design tokens first — developers read these before anything else
          'Inputs',      // Button, Input, Checkbox, Switch — used on every page
          'Surfaces',    // Card, Badge — used everywhere
          'Feedback',    // Alert, Progress, Spinner, Skeleton
          'Navigation',  // Navbar, Tabs, Breadcrumbs, Pagination
          'Overlays',    // Modal, Dropdown, Tooltip
          'Data',        // Table, Avatar, Accordion — more specialised
          'Brand',       // PeakziLogo — internal asset
        ],
      },
    },

    // Auto-match color/date controls
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Show source code panel open by default in canvas and docs views
    docs: {
      canvas: {
        sourceState: 'shown',
      },
      source: {
        // 'dynamic' generates <Component prop="value" /> JSX from current args.
        // Render-based stories fall back to originalSource in the Source panel.
        type: 'dynamic',
        language: 'tsx',
      },
    },
    // Fail stories on a11y errors — enforces SEO & accessibility standards
    a11y: {
      test: 'error',
    },
    // Default layout for stories
    layout: 'padded',
  },
}

export default preview
